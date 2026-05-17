import express from 'express';
import { callAI } from '../lib/aiClient.js';
import { parseJSON } from '../lib/parser.js';
import { RendererAgent } from '../lib/rendererAgent.js';
import { calculateSEOScore } from '../lib/seoEngine.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';

const router = express.Router();

/**
 * POST /api/refine
 * 외부 콘텐츠(ChatGPT 등)를 마자 스타일로 휴머나이즈 및 EEAT 최적화
 */
router.post('/', async (req, res) => {
  try {
    const { user_id, title, content, site_id } = req.body;

    if (!user_id || !title || !content) {
      return res.status(400).json({ success: false, error: '필수 정보(user_id, title, content)가 누락되었습니다.' });
    }

    console.log(`[Refine] Refining content for user: ${user_id}, title: ${title}`);

    // 1. AI 휴머나이즈 & EEAT 최적화 프롬프트
    const prompt = `
      You are an expert AdSense SEO & Content Humanizer. 
      Your task is to transform the following raw content (possibly AI-generated) into a high-quality, humanized, and EEAT-optimized blog post for Google AdSense approval.

      Requirements:
      1. Tone: Human-like, engaging, and professional. Avoid typical AI patterns (like overusing "In conclusion").
      2. EEAT Elements: 
         - Add an "Insight Box" (💡 전문가 팁) with deep insights.
         - Add an "Experience Note" (✍️ 개인적 견해/경험) to prove human experience.
         - Use clear H2, H3 heading structure.
         - Include a comparison table or list if applicable.
      3. Formatting: Return the result in structured JSON format.

      Original Title: ${title}
      Original Content: ${content}

      Return JSON:
      {
        "title": "Optimized Title",
        "intro": "Engaging introduction",
        "definitionSection": { "title": "What is X?", "content": "..." },
        "content1": "Deep dive analysis",
        "insightBox": "Unique expert insight",
        "content2": "Practical application or guide",
        "experienceNote": "Human-like experience or reasoning",
        "outro": "Summary without using the word 'Conclusion'",
        "hashtags": ["tag1", "tag2"],
        "category": "Suggested Category"
      }
    `;

    // 2. AI 호출 (Gemini 2.5 Flash)
    const raw = await callAI(prompt, { jsonMode: true });
    const data = typeof raw === 'string' ? parseJSON(raw) : raw;

    // 3. 렌더링 및 SEO 점수 계산
    const renderResult = RendererAgent.renderPost(data, { topic: title });
    const seoScore = calculateSEOScore(renderResult.html, title);

    const fullMarkdown = `# ${data.title}\n\n${data.intro}\n\n## ${data.definitionSection?.title || '정의'}\n\n${data.definitionSection?.content}\n\n## 상세 분석\n\n${data.content1}\n\n> 💡 **전문가 팁**\n> ${data.insightBox}\n\n## 가이드\n\n${data.content2}\n\n> ✍️ **경험담**\n> ${data.experienceNote}\n\n${data.outro}`;

    // 4. DB 저장 (Optional, but good for tracking)
    let savedPostId = null;
    if (supabaseAdmin && site_id) {
      const { data: savedPost } = await supabaseAdmin.from('ms_posts').insert([{
        user_id,
        site_id,
        title: data.title,
        content: fullMarkdown,
        html_content: renderResult.html,
        status: 'draft',
        source_type: 'refined',
        word_count: fullMarkdown.replace(/\s+/g, '').length,
        seo_score: seoScore,
        metadata: { data, blocks: renderResult.blocks }
      }]).select('id').single();
      savedPostId = savedPost?.id;
    }

    res.json({
      success: true,
      data: {
        id: savedPostId,
        title: data.title,
        content: fullMarkdown,
        html: renderResult.html,
        seo_score: seoScore,
        metadata: data
      }
    });

  } catch (error: any) {
    console.error('[Refine Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
