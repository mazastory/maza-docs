/**
 * =============================================
 * MAZA Studio - Unified Validation Engine
 * AGENTS.md v8.0 - AdSense Approval & EEAT Assessment
 * =============================================
 */

import { callAgent } from "./aiClient.js";
import { supabaseAdmin } from "./supabaseServer.js";
import { AuthorityEngine } from "./authorityEngine.js";
import { MazaLogger } from "./logger.js";

// --- Interfaces ---

export interface ValidationCheck {
  passed: boolean;
  score: number;
  detail?: string;
}

export interface ValidationResult {
  passed: boolean;        
  score: number;          
  scoreLabel: '🟢 발행 권장' | '🟡 보완 권장' | '🔴 재생성 권장';
  checks: {
    keywordInTitle: ValidationCheck;    // 20점
    wordCount: ValidationCheck;         // 20점
    headingStructure: ValidationCheck;  // 15점
    hasImage: ValidationCheck;          // 15점
    hasInternalLink: ValidationCheck;   // 10점
    metaDescription: ValidationCheck;   // 10점 (Summary)
    experienceBonus: ValidationCheck;   // 10점 (E-E-A-T)
    ymylRisk: ValidationCheck;          // 5점 (Risk-Free)
  };
  suggestions: string[];
}

export interface ValidationV2Result {
  overallScore: number;
  semanticDuplication: {
    score: number; // 0-25
    similarity: number;
    isDuplicate: boolean;
    detail: string;
  };
  aiFootprint: {
    score: number; // 0-25
    risk: 'low' | 'medium' | 'high';
    patterns: string[];
    detail: string;
  };
  searchIntent: {
    score: number; // 0-25
    intent: 'informational' | 'experiential' | 'commercial' | 'transactional';
    isMatched: boolean;
    detail: string;
  };
  topicDepth: {
    score: number; // 0-25
    authorityScore: number;
    coverage: string[];
    suggestions: string[];
  };
}

const YMYL_KEYWORDS = [
  '투자', '주식', '재테크', '의료', '진단', '치료', '법률', '소송',
  '보험', '대출', '금리', '채무', '파산', '백신', '약물', '처방', '비트코인', '코인'
];

// --- Engine Class ---

export class MazaValidator {
  /**
   * [Static] 글 품질 검증 (AGENTS.md RULE-5)
   * 단순 정적 규칙 기반 (빠름, 안정적)
   */
  static validateStatic(content: string, keyword: string, options?: { isCompliance?: boolean }): ValidationResult {
    const suggestions: string[] = [];
    const isCompliance = options?.isCompliance || /개인정보처리방침|이용약관|책임 한계|블로그 소개/.test(content);

    // 1. 제목에 키워드 포함 (20점)
    const titleLine = content.split('\n')[0] || '';
    const titleText = titleLine.replace(/^#+\s*/, '').trim();
    const keywordInTitlePassed = isCompliance || (keyword && titleText.toLowerCase().includes(keyword.toLowerCase()));
    const keywordInTitleCheck: ValidationCheck = {
      passed: keywordInTitlePassed,
      score: keywordInTitlePassed ? 20 : 0,
      detail: `제목: "${titleText || '없음'}"`
    };
    if (!keywordInTitlePassed && !isCompliance) {
      suggestions.push(`제목에 키워드 "${keyword}"를 포함해야 합니다.`);
    }

    // 2. 본문 글자 수 (20점) - 공백 제외 1,500자 기준
    const charCount = content.replace(/\s+/g, '').length;
    const wordCountTarget = isCompliance ? 800 : 1500;
    const wordCountPassed = charCount >= wordCountTarget;
    
    let wordCountScore = 0;
    if (charCount >= wordCountTarget) wordCountScore = 20;
    else if (charCount >= wordCountTarget * 0.7) wordCountScore = 12;
    else if (charCount >= wordCountTarget * 0.4) wordCountScore = 6;

    const wordCountCheck: ValidationCheck = {
      passed: wordCountPassed,
      score: wordCountScore,
      detail: `${charCount.toLocaleString()}자`
    };
    if (!wordCountPassed) {
      suggestions.push(`본문이 ${charCount}자입니다. ${wordCountTarget}자 이상 작성 시 승인 확률이 극대화됩니다.`);
    }

    // 3. H2/H3 태그 2개 이상 (15점)
    const h23Count = (content.match(/^##+\s/gm) || []).length;
    const headingPassed = isCompliance ? h23Count >= 1 : h23Count >= 2;
    const headingCheck: ValidationCheck = {
      passed: headingPassed,
      score: headingPassed ? 15 : (h23Count >= 1 ? 7 : 0),
      detail: `소제목: ${h23Count}개`
    };
    if (!headingPassed && !isCompliance) {
      suggestions.push(`소제목(H2/H3)을 2개 이상 사용하면 검색 로봇이 글의 구조를 더 잘 이해합니다.`);
    }

    // 4. 이미지 1개 이상 (15점)
    const hasImagePassed = /!\[.*?\]\(.+?\)|<img/i.test(content) || isCompliance;
    const hasImageCheck: ValidationCheck = {
      passed: hasImagePassed,
      score: hasImagePassed ? 15 : 0
    };
    if (!hasImagePassed && !isCompliance) {
      suggestions.push('이미지를 1개 이상 삽입하여 가독성을 높여주세요.');
    }

    // 5. 내부 링크 포함 (10점)
    const hasInternalLinkPassed = /\[.+?\]\(.+?\)|<a\s/i.test(content) || isCompliance;
    const hasInternalLinkCheck: ValidationCheck = {
      passed: hasInternalLinkPassed,
      score: hasInternalLinkPassed ? 10 : 0
    };
    if (!hasInternalLinkPassed && !isCompliance) {
      suggestions.push('블로그 내 다른 글 링크를 추가하면 체류시간 향상에 도움이 됩니다.');
    }

    // 6. 메타 디스크립션/요약 (10점)
    const firstParagraph = content.split('\n').find(l => l.length > 50 && !l.startsWith('#')) || '';
    const metaPassed = firstParagraph.length >= 100;
    const metaDescriptionCheck: ValidationCheck = {
      passed: metaPassed,
      score: metaPassed ? 10 : 0,
      detail: metaPassed ? '요약 서론 감지' : '서론 부족'
    };
    if (!metaPassed) {
      suggestions.push('글의 첫 부분에 내용을 요약하는 150자 내외의 서론을 작성하세요.');
    }

    // 7. 경험 증명 (E-E-A-T) (10점)
    const hasExperience = /photo_|user_upload|직접|체험|방문|리뷰|후기|제가|겪어보니/.test(content);
    const experienceBonusCheck: ValidationCheck = {
      passed: hasExperience,
      score: hasExperience ? 10 : 0,
      detail: hasExperience ? '경험/현장성 감지' : '일반 정보'
    };
    if (!hasExperience) {
      suggestions.push('직접 경험한 사례나 촬영한 사진을 언급하면 구글 E-E-A-T 가점을 받습니다.');
    }

    // 8. YMYL 리스크 관리 (5점)
    const riskWords = YMYL_KEYWORDS.filter(w => content.includes(w));
    const isRiskFree = riskWords.length < 3;
    const ymylRiskCheck: ValidationCheck = {
      passed: isRiskFree,
      score: isRiskFree ? 5 : 0,
      detail: isRiskFree ? '리스크 낮음' : `위험 단어 감지: ${riskWords.join(', ')}`
    };

    const totalScore =
      keywordInTitleCheck.score +
      wordCountCheck.score +
      headingCheck.score +
      hasImageCheck.score +
      hasInternalLinkCheck.score +
      metaDescriptionCheck.score +
      experienceBonusCheck.score +
      ymylRiskCheck.score;

    let scoreLabel: ValidationResult['scoreLabel'];
    if (totalScore >= 85) scoreLabel = '🟢 발행 권장';
    else if (totalScore >= 65) scoreLabel = '🟡 보완 권장';
    else scoreLabel = '🔴 재생성 권장';

    return {
      passed: totalScore >= 60,
      score: Math.min(totalScore, 100),
      scoreLabel,
      checks: {
        keywordInTitle: keywordInTitleCheck,
        wordCount: wordCountCheck,
        headingStructure: headingCheck,
        hasImage: hasImageCheck,
        hasInternalLink: hasInternalLinkCheck,
        metaDescription: metaDescriptionCheck,
        experienceBonus: experienceBonusCheck,
        ymylRisk: ymylRiskCheck
      },
      suggestions
    };
  }

  /**
   * [AI] 고도화된 콘텐츠 검증 (AI 기반)
   * 중복성, AI 패턴, 검색 의도, 주제 깊이 분석 (V2 로직 흡수)
   */
  static async validateAI(content: string, keyword: string, userId: string): Promise<ValidationV2Result> {
    MazaLogger.info(`[MazaValidator] 🛡️ Starting AI validation for: ${keyword}`, { userId });

    const [duplication, aiFootprint, searchIntent, topicDepth] = await Promise.all([
      this.checkSemanticDuplication(content, keyword, userId),
      this.checkAIFootprint(content),
      this.checkSearchIntent(content, keyword),
      this.checkTopicDepth(content, keyword, userId)
    ]);

    const overallScore = duplication.score + aiFootprint.score + searchIntent.score + topicDepth.score;

    return {
      overallScore,
      semanticDuplication: duplication,
      aiFootprint,
      searchIntent,
      topicDepth
    };
  }

  // --- AI Validation Helpers (V2 logic) ---

  private static async checkSemanticDuplication(content: string, keyword: string, userId: string) {
    if (!supabaseAdmin) return { score: 25, similarity: 0, isDuplicate: false, detail: "DB 연결 없음" };

    const { data: recentPosts } = await supabaseAdmin
      .from('ms_posts')
      .select('title, keyword')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const recentContext = recentPosts?.map((p: any) => `제목: ${p.title}, 키워드: ${p.keyword}`).join('\n') || "없음";

    const prompt = `
    Analyze semantic duplication between the new content and recent posts.
    New Content Keyword: ${keyword}
    New Content Snippet: ${content.substring(0, 500)}
    
    Recent Posts:
    ${recentContext}
    
    If the new content covers the same topic with similar meaning, it's a duplication.
    Return JSON: { "similarity": 0.0-1.0, "isDuplicate": boolean, "reason": string }
    `;

    const result = await callAgent(prompt, "SemanticChecker", { jsonMode: true });
    const data = result.data || { similarity: 0, isDuplicate: false, reason: "분석 실패" };

    let score = 25;
    if (data.similarity > 0.8) score = 5;
    else if (data.similarity > 0.5) score = 15;

    return {
      score,
      similarity: data.similarity,
      isDuplicate: data.isDuplicate,
      detail: data.reason
    };
  }

  private static async checkAIFootprint(content: string) {
    const sentences = content.split(/[.!?]\s/).filter((s: string) => s.length > 5);
    const lengths = sentences.map((s: string) => s.length);
    const avg = lengths.reduce((a: number, b: number) => a + b, 0) / (lengths.length || 1);
    const variance = lengths.reduce((a: number, b: number) => a + Math.pow(b - avg, 2), 0) / (lengths.length || 1);
    const stdDev = Math.sqrt(variance);

    const prompt = `
    Analyze the AI footprint of the following text. 
    Look for:
    1. Repetitive transition phrases (e.g., "Moreover", "In conclusion", "First of all")
    2. Uniform paragraph structures
    3. Lack of human-like "burstiness" or personal anecdotes
    
    Text: ${content.substring(0, 1000)}
    
    Return JSON: { "risk": "low"|"medium"|"high", "patterns": string[], "explanation": string }
    `;

    const result = await callAgent(prompt, "FootprintAnalyzer", { jsonMode: true });
    const data = result.data || { risk: 'medium', patterns: [], explanation: "분석 실패" };

    let score = 25;
    if (data.risk === 'high') score = 5;
    else if (data.risk === 'medium') score = 15;
    
    if (stdDev < 10 && score > 10) score -= 5;

    return {
      score,
      risk: data.risk,
      patterns: data.patterns,
      detail: data.explanation
    };
  }

  private static async checkSearchIntent(content: string, keyword: string) {
    const prompt = `
    Determine the search intent for keyword: "${keyword}"
    Analyze if the content (Title: ${content.split('\n')[0]}) matches this intent.
    Intent types: 
    - Informational (Generic info)
    - Experiential (Review, personal experience) - Preferred for AdSense 2026
    - Commercial (Comparison, product search)
    - Transactional (Buy, download)
    
    Return JSON: { "intent": string, "isMatched": boolean, "explanation": string }
    `;

    const result = await callAgent(prompt, "IntentAnalyzer", { jsonMode: true });
    const data = result.data || { intent: 'informational', isMatched: true, explanation: "분석 실패" };

    let score = 20;
    if (data.isMatched) score += 5;
    if (data.intent === 'experiential') score += 5; // EEAT Bonus

    return {
      score: Math.min(score, 25),
      intent: data.intent,
      isMatched: data.isMatched,
      detail: data.explanation
    };
  }

  private static async checkTopicDepth(content: string, keyword: string, userId: string) {
    const prompt = `
    Analyze the topic depth and authority for: "${keyword}"
    1. Are there specific sub-topics covered?
    2. Is there technical depth or just surface-level info?
    3. Suggest internal link opportunities.
    
    Content Snippet: ${content.substring(0, 1000)}
    
    Return JSON: { "depthScore": 0-100, "coveredTopics": string[], "suggestions": string[] }
    `;

    const result = await callAgent(prompt, "DepthAnalyzer", { jsonMode: true });
    const data = result.data || { depthScore: 50, coveredTopics: [], suggestions: [] };

    let score = 25;
    if (data.depthScore < 40) score = 10;
    else if (data.depthScore < 70) score = 18;

    const infoDensity = AuthorityEngine.analyzeInformationDensity(content);
    if (infoDensity > 80) score = Math.min(25, score + 5);
    else if (infoDensity < 40) score = Math.max(5, score - 10);

    return {
      score,
      authorityScore: data.depthScore,
      coverage: data.coveredTopics,
      suggestions: data.suggestions
    };
  }
}

/**
 * @deprecated Legacy wrapper for MazaValidator.validateStatic
 * Use MazaValidator.validateStatic() or validateAI() instead.
 */
export function validateContent(content: string, keyword: string, options?: { isCompliance?: boolean }): ValidationResult {
  return MazaValidator.validateStatic(content, keyword, options);
}

/**
 * Helper for V2-style validation
 */
export const ValidatorV2 = {
  validate: (content: string, keyword: string, userId: string) => MazaValidator.validateAI(content, keyword, userId)
};
