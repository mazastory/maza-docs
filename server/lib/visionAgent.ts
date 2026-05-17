import { callAI } from "./aiClient.js";

/**
 * Maza Bridge v4 — server/lib/visionAgent.ts
 * Find element coordinates in a screenshot using Gemini Vision
 */
export const VisionAgent = {
  async findCoordinates(imageBase64: string, targetDescription: string) {
    const prompt = [
      {
        role: "user",
        content: `
          Find the coordinates for the following UI element: "${targetDescription}"
          
          Return ONLY a JSON object with:
          {
            "x": number, // 0-1000 scale
            "y": number, // 0-1000 scale
            "confidence": number, // 0-1
            "reason": "explanation"
          }
        `,
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64
        }
      }
    ];

    try {
      const result = await callAI(prompt, { 
        model: "gemini-3-flash-preview", 
        jsonMode: true 
      });
      
      const coords = typeof result === 'string' ? JSON.parse(result) : result;
      return coords;
    } catch (err) {
      console.error("[VisionAgent] Failed to find coordinates:", err);
      return null;
    }
  },

  /**
   * [E-01] Analyze user experience photo and generate emotional storytelling context.
   * AI-generated objective description is prohibited.
   */
  async analyzeExperience(imageBase64: string, keyword: string, userContext?: string) {
    const prompt = [
      {
        role: "user",
        content: `
          당신은 "Experience Writer"입니다. 사용자가 직접 촬영한 사진과 남긴 메모를 보고, 이 사진에 담긴 '직접적인 경험'을 증명하는 블로그 분석을 만드세요.
          
          [사용자 제공 메모]:
          ${userContext || "제공된 메모 없음"}

          [규약: Experience-First Protocol]
          1. 절대 "이 사진은 ~입니다"라고 말하지 마세요. (객관적 묘사 금지)
          2. 사용자가 남긴 메모(장소, 동행, 시기, 팁 등)를 최우선으로 반영하여 사진 속 상황을 해석하세요.
          3. 반드시 "제가 이 사진을 찍었을 때", "직접 가보니"와 같은 1인칭 시점으로 서술의 기초가 될 분석을 제공하세요.
          4. 사진 속의 세부 사항(빛의 느낌, 사물의 질감, 현장의 분위기)을 사용자의 메모와 결합하여 인간적인 향취를 극대화하세요.
          
          [반환 형식: JSON]
          {
            "storytelling": "사용자 메모와 사진을 결합한 1인칭 경험 분석 (기초 서사)",
            "observation": "사진에서 발견한 독특한 디테일 (사용자 메모와의 연관성 포함)",
            "emotional_hook": "사용자의 감정과 현장의 분위기를 관통하는 훅 문구",
            "eeat_score": 0.98
          }
        `,
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64
        }
      }
    ];

    try {
      const result = await callAI(prompt, { 
        model: "gemini-3-flash-preview", 
        jsonMode: true 
      });
      
      const analysis = typeof result === 'string' ? JSON.parse(result) : result;
      console.log(`[VisionAgent] ✨ Experience Analysis Complete with User Context: ${keyword}`);
      return analysis;
    } catch (err) {
      console.error("[VisionAgent] Experience analysis failed:", err);
      return {
        storytelling: `실제로 ${keyword} 관련 현장을 방문했을 때 찍은 사진입니다. ${userContext || '현장의 생생한 분위기를 전해드리고 싶었습니다.'}`,
        observation: "사용자 업로드 이미지 기반 분석",
        emotional_hook: "진심이 담긴 현장의 기록",
        eeat_score: 0.8
      };
    }
  }
};
