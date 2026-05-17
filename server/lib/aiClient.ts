import { GoogleGenerativeAI } from "@google/generative-ai";
import * as crypto from "crypto";
import { supabaseAdmin } from "./supabaseServer.js";
import { redisConnection } from "./redis.js";

export const MODEL_CHAIN = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.5-pro"
] as const;

export interface AgentResult<T = string> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
  metadata: {
    durationMs: number;
    model?: string;
    tokens?: number;
  };
}

class AgentCircuitBreaker {
  private failures = new Map<string, number>();
  private readonly THRESHOLD = 5;

  recordFailure(agentName: string) {
    const current = this.failures.get(agentName) || 0;
    this.failures.set(agentName, current + 1);
    if (this.failures.get(agentName)! >= this.THRESHOLD) {
      console.error(`[CircuitBreaker] 🔴 ${agentName} has failed 5 times continuously. Circuit is OPEN.`);
    }
  }

  recordSuccess(agentName: string) {
    if (this.failures.get(agentName) !== 0) {
      this.failures.set(agentName, 0);
      console.log(`[CircuitBreaker] 🟢 ${agentName} recovered. Circuit is CLOSED.`);
    }
  }

  isOpen(agentName: string): boolean {
    return (this.failures.get(agentName) || 0) >= this.THRESHOLD;
  }
}

export const circuitBreaker = new AgentCircuitBreaker();

// 1. AI Caching Layout (Cost reduction)
const aiCache = new Map<string, { result: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

let cachedBudgetStatus: any = null;
let lastBudgetCheck = 0;
const BUDGET_CHECK_INTERVAL = 1000 * 60 * 10; // 10 minutes

async function checkBudgetGuardrail(options: any) {
  if (Date.now() - lastBudgetCheck > BUDGET_CHECK_INTERVAL) {
    try {
      const { BudgetService } = await import("./budgetService.js");
      cachedBudgetStatus = await BudgetService.getBudgetStatus();
      lastBudgetCheck = Date.now();
    } catch (err) {
      console.warn("[BudgetGuardrail] Failed to check budget, failing open.", err);
      return;
    }
  }

  if (cachedBudgetStatus) {
    if (cachedBudgetStatus.isBlocked) {
      throw new Error("[BUDGET_EXCEEDED] 시스템 월간 예산이 초과되었습니다. 관리자에게 문의하세요.");
    }
    if (cachedBudgetStatus.shouldDowngrade && options.model?.includes("pro")) {
      console.warn(`[BudgetGuardrail] 🚨 95% budget reached ($${cachedBudgetStatus.cost.toFixed(2)}). Downgrading ${options.model} to flash.`);
      options.model = "gemini-2.5-flash"; // 강제 다운그레이드 (2026 유효 모델)
    }
  }
}

function getHash(input: string) {
  return crypto.createHash('md5').update(input).digest('hex');
}

// Removed currentKeyIndex to use random selection for better distributed scalability (I1)

export async function callAI(prompt: string | any[], options: { 
  jsonMode?: boolean, 
  retryCount?: number, 
  model?: string, 
  useCache?: boolean,
  useSearch?: boolean, // 🔥 Quantum Feature: Google Search Grounding
  rawResponse?: boolean, // 🔥 Return full object with tokens
  jobId?: string // 🛑 Job Cancellation Support
} = {}): Promise<any> {
  // Check Job Cancellation
  if (options.jobId) {
    const isStopped = await redisConnection.get(`stop_job_${options.jobId}`);
    if (isStopped) {
      console.log(`[AI Client] 🛑 Job ${options.jobId} was cancelled by user. Halting API calls.`);
      throw new Error("작업이 사용자에 의해 취소되었습니다.");
    }
  }

  // Budget Guardrail (AGENTS.md v2.4)
  await checkBudgetGuardrail(options);

  // Support multiple API keys separated by commas for rotation
  const rawKeys = process.env.GEMINI_TEXT_API_KEY || process.env.GEMINI_API_KEY || "";
  const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(k => k.length > 5);
  
  if (apiKeys.length === 0) {
    console.error("❌ [AI Client] Gemini API Key is missing.");
    throw new Error("Gemini API Key(GEMINI_TEXT_API_KEY)가 설정되지 않았습니다. 설정을 확인해주세요.");
  }

  const promptString = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);
  // [Stability-First] Unified Flash Cache: Group all flash models to share the same cache for the same prompt
  const modelGroup = (options.model || "").includes("flash") ? "gemini-flash-group" : (options.model || "default");
  const cacheKey = getHash(promptString + modelGroup);
  
  if (options.useCache !== false) {
    try {
      // [CRIT-03 Fix] supabaseAdmin null 체크 추가 (SERVICE_ROLE_KEY 없을 시 crash 방지)
      if (supabaseAdmin) {
        const { data: cachedRow } = await supabaseAdmin
          .from('ms_ai_cache')
          .select('response')
          .eq('prompt_hash', cacheKey)
          .single();
          
        if (cachedRow && cachedRow.response) {
          console.log(`[AI Client] 🟢 Cache HIT from Supabase! Cost saved.`);
          if (options.rawResponse) {
            return { text: cachedRow.response, tokens: 0, modelName: "cached" };
          }
          return cachedRow.response;
        }
      }
    } catch (e) {
      console.warn(`[AI Client] Cache lookup failed (Table might not exist yet):`, e);
    }
  }

  // Robust Rotation: If a retry, use the next key
  const retryCount = options.retryCount || 0;
  
  // [Stability-First] Global Throttle: Wait at least 3.0s between any API call attempt (increased from 2.5s)
  await new Promise(resolve => setTimeout(resolve, 3000));

  // [Stability-First] Filter out quarantined keys from Redis
  let validKeys = [];
  for (const key of apiKeys) {
    const keyHash = getHash(key).substring(0, 8);
    const isQuarantined = await redisConnection.get(`quarantine_key_${keyHash}`);
    if (!isQuarantined) {
      validKeys.push(key);
    }
  }

  // If all keys are quarantined, wait a bit or use the original list as a last resort
  const keysToUse = validKeys.length > 0 ? validKeys : apiKeys;
  const keyIdx = (Math.floor(Math.random() * keysToUse.length) + retryCount) % keysToUse.length;
  const apiKey = keysToUse[keyIdx];
  const apiKeyHash = getHash(apiKey).substring(0, 8);

  if (apiKeys.length > 1 || retryCount > 0) {
    console.log(`[AI Client] Using API Key #${keyIdx + 1} [Hash: ${apiKeyHash}] (Attempt: ${retryCount}, Quarantined: ${apiKeys.length - validKeys.length})`);
  }

  // Primary: gemini-3-flash-preview (Standard for 2026-05)
  const modelName = options.model || process.env.GEMINI_MODEL || "gemini-3-flash-preview";

  try {
    // Explicitly set the API key and ensure we are using the public endpoint
    // Extract system instruction if it exists
    let systemInstruction;
    let geminiContents: any;
    
    if (Array.isArray(prompt)) {
      const systemMsg = prompt.find(p => p.role === 'system');
      if (systemMsg) {
        systemInstruction = systemMsg.content;
      }
      
      geminiContents = prompt
        .filter(p => p.role !== 'system')
        .map(p => {
          const parts: any[] = [];
          if (p.content) parts.push({ text: p.content });
          if (p.inlineData) parts.push({ inlineData: p.inlineData });
          if (p.inlineDataArray) {
            p.inlineDataArray.forEach((data: any) => parts.push({ inlineData: data }));
          }
          return {
            role: p.role === 'assistant' ? 'model' : 'user',
            parts: parts.length > 0 ? parts : [{ text: "" }]
          };
        });
    }

    // [Stability-First] Global Model Quarantine Check: Skip models known to 404/403
    const isModelQuarantined = await redisConnection.get(`quarantine_model_${modelName}`);
    if (isModelQuarantined) {
      const currentIndex = MODEL_CHAIN.indexOf(modelName as any);
      const nextModel = (currentIndex !== -1 && currentIndex < MODEL_CHAIN.length - 1) 
        ? MODEL_CHAIN[currentIndex + 1] 
        : (modelName !== MODEL_CHAIN[0] ? MODEL_CHAIN[0] : null);
      
      if (nextModel && nextModel !== modelName) {
        console.log(`[AI Client] ⏩ Skipping quarantined model: ${modelName} -> ${nextModel}`);
        return callAI(prompt, { ...options, model: nextModel });
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelOptions: any = { 
      model: modelName,
      generationConfig: options.jsonMode ? { responseMimeType: "application/json" } : undefined,
      tools: options.useSearch ? [{ googleSearch: {} }] : undefined
    };
    if (systemInstruction) modelOptions.systemInstruction = systemInstruction;

    const model = genAI.getGenerativeModel(modelOptions);
    
    const result = Array.isArray(prompt) 
      ? await model.generateContent({ contents: geminiContents })
      : await model.generateContent(prompt);
      
    const response = await result.response;
    const text = response.text();
    const tokens = response.usageMetadata?.totalTokenCount || 0;
    
    if (!text) {
      throw new Error("AI 응답이 비어 있습니다.");
    }

    // Cache the result to Supabase
    if (options.useCache !== false && supabaseAdmin) {
      supabaseAdmin.from('ms_ai_cache').upsert({
        prompt_hash: cacheKey,
        model: modelName,
        response: text
      }, { onConflict: 'prompt_hash' }).then(({ error: cacheError }: { error: any }) => {
        if (cacheError) console.error(`[AI Client] Cache save failed:`, cacheError.message);
      });
    }

    if (options.rawResponse) {
      return { text, tokens, modelName };
    }

    return text;
  } catch (error: any) {
    const errorMsg = error.message || String(error);
    
    // Explicit 404/403 Fallback logic (Access or existence issues)
    const isAccessOrNotFoundError = 
      error.status === 404 || 
      error.status === 403 || 
      errorMsg.includes("404") || 
      errorMsg.includes("403") || 
      errorMsg.includes("not found") || 
      errorMsg.includes("denied access") ||
      errorMsg.includes("forbidden");

    if (isAccessOrNotFoundError) {
      // [FIX] Mark model as quarantined globally for 10 minutes (increased)
      console.warn(`[AI Client] ❌ Model ${modelName} 404/Access error. Quarantining for 600s.`);
      await redisConnection.set(`quarantine_model_${modelName}`, "true", 'EX', 600);

      // [FIX] Fallback chain: 3-flash-preview -> 2.5-flash -> 2.5-pro -> throw
      let nextModel: string | null = null;
      if (modelName === "gemini-3-flash-preview") nextModel = "gemini-2.5-flash"; 
      else if (modelName === "gemini-2.5-flash") nextModel = "gemini-2.5-pro";
      
      if (nextModel && (options.retryCount || 0) < 3) { // 404 에러 시에는 최대 3번만 모델 교체 시도
        console.warn(`[AI Client] 🔄 Testing next in chain: ${nextModel}.`);
        return callAI(prompt, { ...options, model: nextModel, retryCount: (options.retryCount || 0) + 1 });
      }
      throw error; 
    }

    const isQuotaError = error.status === 429 || errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("Too Many Requests");
    const isServiceUnavailable = error.status === 503 || errorMsg.includes("503") || errorMsg.includes("overloaded") || errorMsg.includes("high demand") || errorMsg.includes("Service Unavailable");
    
    if (isQuotaError || isServiceUnavailable) {
      const retryCount = options.retryCount || 0;
      const maxRetries = 5; // [FIX] 15회는 너무 많음. 5회로 단축하여 폭주 방지
      
      const apiKeyHash = getHash(apiKey).substring(0, 8);
      console.warn(`[AI Client] ⚠️ Quota error on Key [${apiKeyHash}]. Quarantining for 120s.`);
      await redisConnection.set(`quarantine_key_${apiKeyHash}`, "true", 'EX', 120);

      if (retryCount < maxRetries) {
        // v6/v5 logic: Exponential Backoff (2s, 4s, 8s...) after rapid rotation 
        let delay = 3000;
        if (apiKeys.length > 1 && retryCount < apiKeys.length) {
          // Rapid rotate for the first cycle of keys but add a tiny throttle to avoid global project RPM hits
          console.log(`[AI Client] Rotating key -> picking next healthy key (Attempt ${retryCount + 1}/${maxRetries})`);
          delay = 1000; // Small delay because callAI will add 3s anyway
        } else {
          // Calculate cycle to implement exponential backoff
          const cycle = Math.floor(retryCount / Math.max(apiKeys.length, 1));
          delay = Math.pow(2, Math.min(cycle, 5)) * 1000; // 2s, 4s, 8s, 16s, 32s...
          console.log(`[AI Client] Quota exhaustion, sleeping ${delay/1000}s... (Attempt ${retryCount + 1}/${maxRetries})`);
        }
        
        // Before sleeping, check cancellation again periodically or just sleep
        let slept = 0;
        while (slept < delay) {
          if (options.jobId) {
            const isStopped = await redisConnection.get(`stop_job_${options.jobId}`);
            if (isStopped) {
               console.log(`[AI Client] 🛑 Job ${options.jobId} cancelled during backoff. Halting.`);
               throw new Error("작업이 사용자에 의해 취소되었습니다.");
            }
          }
          await new Promise(resolve => setTimeout(resolve, Math.min(1000, delay - slept)));
          slept += 1000;
        }
        
        return callAI(prompt, { ...options, retryCount: retryCount + 1 });
      }

      // Final Quota Fallback Chain: KI 기준 검증된 모델만 사용
      if (isQuotaError) {
         let nextModel: string | null = null;
         if (modelName === "gemini-3-flash-preview") nextModel = "gemini-2.5-flash";
         else if (modelName === "gemini-2.5-flash") nextModel = "gemini-2.5-pro";

         if (nextModel) {
           console.warn(`[AI Client] Quota exhausted for ${modelName}. Falling back to next: ${nextModel}.`);
           return callAI(prompt, { ...options, model: nextModel, retryCount: 0 });
         }
      }
      
      console.error("[AI Client Error] Exhausted all models and retries:", errorMsg);
      throw new Error(`[QUOTA_EXCEEDED] 현재 모든 AI 모델의 사용량이 초과되었습니다. 잠시 후 다시 시도해 주세요.`);
    }
    
    if (errorMsg.includes("API key not valid") || error.status === 401) {
      console.error("[AI Client Error] Invalid Key:", errorMsg);
      throw new Error("API 키(GEMINI_TEXT_API_KEY)가 유효하지 않습니다. 설정을 확인해주세요.");
    }
    
    console.error("[AI Client Error] Unhandled:", error);
    throw new Error(`AI Service Error: ${errorMsg || "Unknown error"}`);
  }
}

export async function callAIStream(prompt: string | any[], options: { 
  model?: string, 
  onChunk?: (chunk: string) => void, 
  retryCount?: number,
  jsonMode?: boolean,
  useCache?: boolean,
  useSearch?: boolean,
  jobId?: string,
  rawResponse?: boolean
} = {}): Promise<any> {
  const rawKeys = process.env.GEMINI_TEXT_API_KEY || process.env.GEMINI_API_KEY || "";
  const apiKeys = rawKeys.split(",").map(k => k.replace(/[^\x00-\x7F]/g, "").trim()).filter(k => k.length > 5);
  
  if (apiKeys.length === 0) {
    throw new Error("Gemini API Key가 설정되지 않았습니다.");
  }

  const retryCount = options.retryCount || 0;
  
  // [Stability-First] Global Throttle: Wait at least 3.0s (increased from 2.5s)
  await new Promise(resolve => setTimeout(resolve, 3000));

  // [Stability-First] Filter out quarantined keys
  let validKeys = [];
  for (const key of apiKeys) {
    const keyHash = getHash(key).substring(0, 8);
    const isQuarantined = await redisConnection.get(`quarantine_key_${keyHash}`);
    if (!isQuarantined) validKeys.push(key);
  }

  const keysToUse = validKeys.length > 0 ? validKeys : apiKeys;
  const keyIdx = (Math.floor(Math.random() * keysToUse.length) + retryCount) % keysToUse.length;
  const apiKey = keysToUse[keyIdx];
  const apiKeyHash = getHash(apiKey).substring(0, 8);

  // STABILITY FIRST: Using gemini-3-flash-preview (Standard for 2026-05)
  const modelName = options.model || process.env.GEMINI_MODEL || "gemini-3-flash-preview";

  // [Stability-First] Unified Flash Cache for Streaming
  const promptString = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);
  const modelGroup = modelName.includes("flash") ? "gemini-flash-group" : (options.model || "default");
  const cacheKey = getHash(promptString + modelGroup);

  if (options.useCache !== false && supabaseAdmin) {
    try {
      const { data: cachedRow } = await supabaseAdmin
        .from('ms_ai_cache')
        .select('response')
        .eq('prompt_hash', cacheKey)
        .single();
        
      if (cachedRow && cachedRow.response) {
        console.log(`[AI Client] 🟢 Cache HIT from Supabase (Stream)!`);
        options.onChunk?.(cachedRow.response);
        return cachedRow.response;
      }
    } catch (e) { /* Cache miss or table missing */ }
  }

  try {
    let systemInstruction;
    let geminiContents: any;
    
    if (Array.isArray(prompt)) {
      const systemMsg = prompt.find(p => p.role === 'system');
      if (systemMsg) systemInstruction = systemMsg.content;
      geminiContents = prompt.filter(p => p.role !== 'system').map(p => ({
        role: p.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: p.content || "" }]
      }));
    }

    // [Stability-First] Global Model Quarantine Check for Streaming
    // KI 기준 검증된 폴백 체인만 사용 (2.0-flash 제거)
    const isModelQuarantined = await redisConnection.get(`quarantine_model_${modelName}`);
    if (isModelQuarantined) {
      let nextModel: string | null = null;
      if (modelName === "gemini-3-flash-preview") nextModel = "gemini-2.5-flash"; 
      else if (modelName === "gemini-2.5-flash") nextModel = "gemini-2.5-pro";
      
      if (nextModel) {
        console.log(`[AI Client] ⏩ Skipping quarantined model (Stream): ${modelName} -> ${nextModel}`);
        return callAIStream(prompt, { ...options, model: nextModel });
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelOptions: any = { 
      model: modelName,
      generationConfig: options.jsonMode ? { responseMimeType: "application/json" } : undefined,
      tools: options.useSearch ? [{ googleSearch: {} }] : undefined
    };
    if (systemInstruction) modelOptions.systemInstruction = systemInstruction;
    
    const model = genAI.getGenerativeModel(modelOptions);
    
    const result = Array.isArray(prompt) 
      ? await model.generateContentStream({ contents: geminiContents })
      : await model.generateContentStream(prompt);
      
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) options.onChunk?.(chunkText);
    }

  } catch (error: any) {
    const errorMsg = error.message || String(error);
    const isQuotaError = error.status === 429 || errorMsg.includes("429") || errorMsg.includes("quota");
    const isAuthError = error.status === 403 || errorMsg.includes("403");
    const isServiceUnavailable = error.status === 503 || errorMsg.includes("503") || errorMsg.includes("Service Unavailable");

    // Explicit 404/403 Fallback logic (Access or existence issues)
    const isAccessOrNotFoundError = 
      error.status === 404 || 
      error.status === 403 || 
      errorMsg.includes("404") || 
      errorMsg.includes("403") ||
      errorMsg.includes("not found") ||
      errorMsg.includes("permission") ||
      errorMsg.includes("denied access");

    if (isAccessOrNotFoundError) {
      // ✅ [PATCH] Mark model as quarantined globally for 5 minutes
      console.warn(`[AI Client] ❌ Model ${modelName} (Stream) 404/Access error. Quarantining for 300s.`);
      await redisConnection.set(`quarantine_model_${modelName}`, "true", 'EX', 300);

      // AGENTS.md v8.6: 2026 Full-Spectrum Testing Chain (v2: Preview-First)
      // KI 기준 검증된 폴백 체인: preview -> 2.5-flash -> 2.5-pro -> 종료 (2.0-flash 제거)
      let nextModel: string | null = null;
      if (modelName === "gemini-3-flash-preview") nextModel = "gemini-2.5-flash"; 
      else if (modelName === "gemini-2.5-flash") nextModel = "gemini-2.5-pro";

      if (nextModel) {
        console.warn(`[AI Client] 🔄 Testing next in chain: ${nextModel}.`);
        return callAIStream(prompt, { ...options, model: nextModel, retryCount: 0 });
      }
      throw error; // END OF LINE
    }

    if (isQuotaError || isAuthError || isServiceUnavailable) {
      const maxRetries = 10;
      
      // [Stability-First] Quarantine the failing key
      const apiKeyHash = getHash(apiKey).substring(0, 8);
      console.warn(`[AI Stream] ⚠️ Quota/Auth error on Key [${apiKeyHash}]. Quarantining for 60s.`);
      await redisConnection.set(`quarantine_key_${apiKeyHash}`, "true", 'EX', 60);

      if (retryCount < maxRetries) {
        let delay = 3000;
        
        if (apiKeys.length > 1 && retryCount < apiKeys.length) {
          console.warn(`[AI Stream] Rotating to next healthy key...`);
          delay = 1000;
        } else {
          const cycle = Math.floor(retryCount / Math.max(apiKeys.length, 1));
          delay = Math.pow(2, Math.min(cycle, 5)) * 1000;
          console.log(`[AI Stream] Resting ${delay/1000}s... (Attempt ${retryCount + 1}/${maxRetries})`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        return callAIStream(prompt, { ...options, retryCount: retryCount + 1 });
      }
    }
    
    console.error(`[AI Stream Error] Exhausted/Unhandled:`, errorMsg);
    throw new Error(`AI Stream Error: ${errorMsg || "Unknown error"}`);
  }
}

/**
 * 🔥 v5 Optimized API Helpers (Flash/Pro Split)
 */

// 1. 분석 (저렴하고 빠른 처리용)
export async function analyzeAI(prompt: string | any[]) {
  return callAI(prompt, { model: "gemini-3-flash-preview" }); 
}

// 2. 생성 (고품질 본문용)
export async function generateAI(prompt: string | any[]) {
  return callAI(prompt, { model: "gemini-3-flash-preview" });
}

// 3. 스트리밍 (UX 개선용)
export async function streamAI(prompt: string | any[], onChunk: (chunk: string) => void) {
  return callAIStream(prompt, { 
    model: "gemini-3-flash-preview", 
    onChunk 
  });
}

export async function generateContent(options: { prompt: string | any[], jsonMode?: boolean }): Promise<string> {
   return callAI(options.prompt, { jsonMode: options.jsonMode });
}

/**
 * 2-Stage Model Strategy (Cost/Speed Optimization)
 */
// Cheap/Flash: Analysis, Metadata, Quick Tasks
export async function callCheapAI(prompt: string | any[], options: any = {}) {
  return callAI(prompt, { 
    model: "gemini-3-flash-preview", // 2026: Fast & cheap for bulk tasks
    ...options 
  });
}

// Deep/Pro: Content Generation, Complex Reasoning
export async function callDeepAI(prompt: string | any[], options: any = {}) {
  return callAI(prompt, { 
    model: options.model || "gemini-2.5-pro", // KI 기준 유효 Pro 모델
    ...options 
  });
}

/**
 * 🔥 v2.4 Standardized Agent Caller (Circuit Breaker + Logging + Contract)
 */
export async function callAgent<T = any>(
  prompt: string | any[], 
  agentName: string, 
  options: { model?: string, jsonMode?: boolean, useSearch?: boolean } = {}
): Promise<AgentResult<T>> {
  const startTime = performance.now();
  const modelName = options.model || "gemini-2.5-flash";
  const { parseJSON } = await import("./parser.js");

  // 1. Operation Mode Check (Recovery / Maintenance)
  if (process.env.MAINTENANCE_MODE === 'true') {
    return {
      success: false,
      error: { code: "MAINTENANCE_MODE", message: "시스템 점검 중입니다. (Recovery Mode)", retryable: false },
      metadata: { durationMs: performance.now() - startTime, model: modelName }
    };
  }

  // 2. Circuit Breaker Check
  if (circuitBreaker.isOpen(agentName)) {
    return {
      success: false,
      error: { code: "CIRCUIT_OPEN", message: `Agent [${agentName}] is temporarily blocked due to repeated failures.`, retryable: false },
      metadata: { durationMs: performance.now() - startTime, model: modelName }
    };
  }

  try {
    const aiResult = await callAI(prompt, {
      ...options,
      rawResponse: true
    });

    circuitBreaker.recordSuccess(agentName);

    let finalData = aiResult.text;
    if (options.jsonMode) {
      try {
        if (typeof aiResult.text !== "string") {
          console.error("[callAgent] AI text is not a string:", typeof aiResult.text, aiResult.text);
          finalData = aiResult.text; // Use as-is if already parsed or unknown
        } else {
          finalData = parseJSON(aiResult.text);
        }
      } catch (err) {
        console.error(`[callAgent] JSON Parse Failed for ${agentName}:`, err);
        throw err; // Propagate error so that success: false is returned and retry/fallback logic is triggered
      }
    }

    return {
      success: true,
      data: finalData as T,
      metadata: {
        durationMs: Math.round(performance.now() - startTime),
        model: aiResult.modelName,
        tokens: aiResult.tokens
      }
    };
  } catch (error: any) {
    circuitBreaker.recordFailure(agentName);
    
    return {
      success: false,
      error: {
        code: "AI_EXECUTION_FAILED",
        message: error.message || String(error),
        retryable: true
      },
      metadata: {
        durationMs: Math.round(performance.now() - startTime),
        model: modelName
      }
    };
  }
}

/**
 * 🔥 v2.4 Vision Agent: Detect faces in an image and return bounding boxes
 */
export async function detectFaces(imageBase64: string): Promise<any[]> {
  const prompt = [
    {
      role: "user",
      content: "Find all human faces in this image. Return only a JSON array of bounding boxes like [[ymin, xmin, ymax, xmax], ...]. Coordinates should be 0-1000.",
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64
      }
    }
  ];

  try {
    const result = await callAI(prompt, { 
      model: "gemini-2.5-flash", // Vision tasks: KI 기준 유효 Flash
      jsonMode: true 
    });
    
    const { parseJSON } = await import("./parser.js");
    const boxes = typeof result === 'string' ? parseJSON(result) : result;
    return Array.isArray(boxes) ? boxes : [];
  } catch (error) {
    console.error("[Vision Agent] Face detection failed:", error);
    return [];
  }
}
