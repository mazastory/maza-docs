/**
 * AGENTS.md: blocks 배열 안의 모든 요소는 반드시 완벽한 {} 형태의 객체여야 함.
 * AI가 blocks 내부에 객체가 아닌 문자열이나 Key-Value를 직접 내뱉는 현상을 원천 방지
 */
function sanitizeBlocks(parsed: any): any {
  if (!parsed || typeof parsed !== 'object') return parsed;
  if (!Array.isArray(parsed.blocks)) return parsed;

  const originalCount = parsed.blocks.length;
  parsed.blocks = parsed.blocks.filter((b: any) => {
    if (b === null || b === undefined) return false;
    if (typeof b !== 'object' || Array.isArray(b)) {
      console.warn('[Parser] ❌ Invalid block item (non-object removed):', typeof b, String(b).substring(0, 80));
      return false;
    }
    return true;
  });

  if (parsed.blocks.length !== originalCount) {
    console.warn(`[Parser] Sanitized ${originalCount - parsed.blocks.length} invalid block(s).`);
  }
  return parsed;
}

export function parseAIResponse(raw: any) {
  if (!raw) return {};
  if (typeof raw !== 'string') {
    console.warn('[Parser] Expected string, got:', typeof raw);
    return raw; // Return as is if already parsed
  }
  
  try {
    return sanitizeBlocks(JSON.parse(raw));
  } catch (e) {
    // Aggressive cleanup for Step 2
    let cleaned = raw.trim();
    
    // 1. Remove Markdown code blocks if they exist
    cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "").trim();
    
    try {
      // 🔥 [Quantum Heal] Remove trailing commas before closing braces/brackets
      cleaned = cleaned.replace(/,\s*([\]\}])/g, '$1');
      return sanitizeBlocks(JSON.parse(cleaned));
    } catch (e2) {
      // 2. Deep extraction: Find the outer-most braces
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      
        if (start !== -1 && end !== -1 && end > start) {
          let potentialJson = cleaned.substring(start, end + 1);
          
          // 🔥 [Quantum Heal v2] Remove unescaped newlines within strings
          // This is common when AI doesn't use proper JSON mode
          potentialJson = potentialJson.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/gs, (match) => {
            return match.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
          });

          // 🔥 [Quantum Heal] Bracket mismatch recovery
          const openBraces = (potentialJson.match(/\{/g) || []).length;
          let closeBraces = (potentialJson.match(/\}/g) || []).length;
          
          if (openBraces > closeBraces) {
              potentialJson = potentialJson + '}'.repeat(openBraces - closeBraces);
          } else if (closeBraces > openBraces) {
              // 🔥 [Quantum Heal v4] Handle extra closing braces hallucinated at the end
              let tempJson = potentialJson;
              while (tempJson.endsWith('}') && closeBraces > openBraces) {
                try {
                  return sanitizeBlocks(JSON.parse(tempJson));
                } catch (e) {
                  tempJson = tempJson.slice(0, -1).trim();
                  closeBraces--;
                }
              }
              potentialJson = tempJson;
          }

            // 🔥 [Quantum Heal v3] Fix unescaped double quotes inside strings
            // This is a common failure for long AI responses with nested dialogue or quotes.
            potentialJson = potentialJson.replace(/([^:\s\[\{\,])"([^:\s\]\}\,])/g, "$1\\\"$2");

            try {
              return sanitizeBlocks(JSON.parse(potentialJson));
            } catch (e3) {
              // 3. Final attempt: Remove control characters and non-printable chars
              const extremeClean = potentialJson.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
              try {
                return sanitizeBlocks(JSON.parse(extremeClean));
              } catch (e4) {
                console.error("==== RAW AI RESPONSE ====");
                console.error(raw);
                console.error("==== END RAW AI RESPONSE ====");
                throw new Error("JSON_HEALING_FAILED");
              }
            }
        }
      throw new Error("NO_JSON_OBJECT_FOUND");
    }
  }
}

export function parseJSON(raw: string) {
  return parseAIResponse(raw);
}
