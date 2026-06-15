import express from 'express';
import { callAI, streamAI } from '../lib/aiClient.js';
import { validateContent, ValidatorV2 } from '../lib/validator.js'; // Unified validator engine
import { checkDailyLimit } from '../middleware/rateLimit.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';
import { getOptimizedImage } from '../lib/imageService.js';
import { RendererAgent, applyHTMLTemplate } from '../lib/rendererAgent.js';
import { calculateSEOScore, isSafeTopic } from '../lib/seoEngine.js';
import { parseJSON } from '../lib/parser.js';
import { PostStatus, FAILURE_POLICY } from '../lib/postStatus.js';

import { generateQueue } from '../lib/queues.js';
import { requireAuth } from '../middleware/auth.js';
import { FeedbackEngine } from '../lib/feedbackEngine.js';
import { redisConnection } from '../lib/redis.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { MazaLogger } from '../lib/logger.js';

const router = express.Router();

// ─── Validation Schemas ──────────────────────────────────────────
const generateSchema = z.object({
  body: z.object({
    keyword: z.string().min(1, '키워드는 필수입니다.'),
    site_id: z.string().uuid('유효한 사이트 ID가 필요합니다.'),
    blueprintId: z.string().optional(),
    is_experience: z.boolean().optional(),
  })
});

const streamSchema = z.object({
  query: z.object({
    keyword: z.string().min(1, '키워드는 필수입니다.'),
    site_id: z.string().uuid('유효한 사이트 ID가 필요합니다.'),
    blueprintId: z.string().optional(),
    is_experience: z.string().optional(), // Query params are strings
  })
});

// ─── 공통 AI 프롬프트 빌더 ───────────────────────────────────────
export function buildGeneratePrompt(keyword: string, strategy?: any): string {
  let strategyInstruction = "";
  if (strategy) {
    strategyInstruction = `
[특별 전략: 데이터 피드백 기반 성과 패턴]
최근 귀하의 블로그에서 검색 엔진과 독자 모두에게 가장 반응이 좋았던 패턴입니다. 반드시 적용하세요:
- 권장 제목 스타일: ${strategy.best_title_pattern || '경험 공유형'}
- 최적 본문 분량: ${strategy.optimal_length || 2800}자 내외
- 핵심 인텐트: ${strategy.winning_intent || '정보+경험'}
- 선호되는 문체: ${strategy.winning_tone || '정중하면서도 생생한 1인칭 관점'}
- 추천 구조: ${strategy.winning_structure || '문제 제기 - 직접 해결 - 꿀팁 - Q&A'}
`;
  }

  return `당신은 구글 SEO와 애드센스 승인에 최적화된 전문 블로그 포스팅 작가이자, 독자의 마음을 움직이는 스토리텔러입니다. 현재 연도는 2026년입니다. 모든 내용은 2026년 최신 트렌드와 기준에 맞게 작성해야 합니다.
타겟 키워드 "${keyword}"에 대해 독자에게 깊은 통찰력과 '인간적인 감동'을 주는 ${strategy?.optimal_length || 2800}자 이상의 압도적 고품질 글을 작성하고, 반드시 아래의 JSON 형식으로 응답하세요.

${strategyInstruction}

[필수 지침 - Experience-First (E-E-A-T) 강화]
1. **반(Anti)-AI 페르소나**: 기계적인 서술을 철저히 배제하고, 반드시 본인이 직접 경험한 것처럼 생생한 1인칭 말투(~습니다, ~해요)를 사용하세요. 
2. **감정적 스토리텔링 (Emotional Hook)**: 글의 시작(Intro)은 독자의 감성을 자극하는 문구로 시작하세요. (예: "솔직히 처음엔 반신반의했거든요", "이걸 직접 마주한 순간 울컥했습니다", "가기 전엔 긴장됐는데 막상 보니 미소가 번지더라고요")
3. **다층적 맥락 주입**: 단순 정보 나열이 아닌, 당시의 날씨, 주변의 소음, 본인의 미묘한 기분 변화, 사소하지만 결정적인 디테일을 문장 사이사이에 녹여내어 '실제 경험'임을 증명하세요.
4. **고중량 신뢰도**: 타겟 키워드인 "${keyword}"뿐만 아니라 연관 키워드를 자연스럽게 포함하며, 전문 지식과 개인적 통찰이 7:3의 비율로 섞인 깊이 있는 본문을 구성하세요.

[구조화 및 정보성 지침]
- 명확한 정의 섹션 (Definition): 전문적이고 상세한 개념 설명.
- 지능형 비교 표 (Comparison Table): 상황별/개념별 차이점을 명확히 시각화.
- 실전 사례 (Practical Examples): "피해야 할 최악의 수 vs 전문가의 한 수"를 대조하여 설명.
- 풍부한 FAQ: 독자들이 실무에서 가장 궁금해할 질문 3개 이상.

JSON Schema:
{
  "title": "SEO 최적화된 매력적인 제목 (키워드 포함, 35자 내외)",
  "intro": "서론 (300자 내외, 강력한 감정적 훅과 경험적 배경 설명)",
  "definitionSection": {
    "title": "${keyword}의 정확한 뜻과 핵심 원리",
    "content": "전문적이고 상세한 개념 설명 (600자 이상)"
  },
  "comparisonData": {
    "title": "실패를 줄이는 핵심 비교 분석",
    "headers": ["핵심 포인트", "일반적인 오해(Bad)", "전문가의 정석(Good)"],
    "rows": [
      ["상황1", "설명A1", "설명B1"],
      ["상황2", "설명A2", "설명B2"],
      ["상황3", "설명A3", "설명B3"]
    ]
  },
  "practicalExamples": [
    {"case": "상황 1: 적용 시점", "bad": "피해야 할 행동/표현", "good": "권장되는 최적의 행동/표현"},
    {"case": "상황 2: 위기 관리", "bad": "피해야 할 행동/표현", "good": "권장되는 최적의 행동/표현"}
  ],
  "summary": "글 전체의 핵심 내용을 3문장으로 임팩트 있게 요약",
  "content1": "본문 심화 섹션 (900자 이상, 구체적인 실행 팁과 노하우 포함)",
  "insightBox": "전문가적 관점에서 전수하는 '진짜' 핵심 비법 (200자 내외)",
  "content2": "심층 활용 가이드 및 리스크 관리 (900자 이상)",
  "experienceNote": "작가가 직접 겪으며 느낀 생생한 소회와 진심 어린 조언 (350자 내외)",
  "detailedFaqs": [
    {"q": "Q. 실무에서 가장 자주 묻는 질문 1", "a": "A. 전문적인 답변 1"},
    {"q": "Q. 실무에서 가장 자주 묻는 질문 2", "a": "A. 전문적인 답변 2"},
    {"q": "Q. 실무에서 가장 자주 묻는 질문 3", "a": "A. 전문적인 답변 3"}
  ],
  "outro": "결론 (200자 내외, 독자의 행동을 이끌어내는 마무리)",
  "hashtags": ["태그1", "태그2", "태그3", "태그4", "태그5"]
}

주의: JSON 외의 텍스트는 절대 포함하지 마세요. 답변은 한국어로 작성하세요.`;
}

/**
 * POST /api/generate
 * 기본 글 생성 (JSON 응답)
 */
router.post('/', requireAuth, validate(generateSchema), checkDailyLimit, async (req: any, res) => {
  const keyword = req.body.keyword;
  const site_id = req.body.site_id;
  const user_id = req.userId;
  const traceId = req.headers['x-request-id'] as string;

  MazaLogger.info(`[Generate] Starting generation for ${keyword}`, { siteId: site_id, userId: user_id, traceId });

  try {

    if (!isSafeTopic(keyword)) {
      return res.status(400).json({ success: false, error: '해당 키워드는 애드센스 정책에 위배될 수 있어 생성이 제한됩니다.' });
    }

    // 큐에 작업 추가
    const job = await generateQueue.add('generate-post', {
      keyword,
      userId: user_id,
      siteId: site_id
    });

    console.log(`[Generate API] Enqueued job ${job.id} for: ${keyword}`);

    // [Health Check Fix] ms_events 기록 추가
    await supabaseAdmin.from('ms_events').insert([{
      user_id,
      site_id,
      event_type: 'generate',
      status: 'success',
      metadata: { keyword, job_id: job.id }
    }]);

    res.status(202).json({ 
      success: true, 
      message: '작업이 큐에 등록되었습니다.',
      job_id: job.id 
    });
  } catch(error: unknown) {
    console.error('[Generate Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/generate/stop/:id
 * 작업 중단(취소) 요청
 */
router.post('/stop/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    // 1시간 뒤 만료되는 Stop Flag Redis에 기록
    await redisConnection.set(`stop_job_${id}`, "true", "EX", 3600);
    
    // BullMQ 큐에서도 제거 시도 (아직 대기 중인 경우 대비)
    const job = await generateQueue.getJob(id as string);
    if (job) {
      const state = await job.getState();
      if (state === 'delayed' || state === 'waiting') {
        await job.remove();
      }
    }

    res.json({ success: true, message: "작업 취소 요청이 전달되었습니다." });
  } catch(error: unknown) {
    console.error('[Generate Stop Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/generate/status/:id
 * 작업 상태 조회
 */
router.get('/status/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const job = await generateQueue.getJob(id as string);

  if (!job) {
    return res.status(404).json({ success: false, error: '작업을 찾을 수 없습니다.' });
  }

  const state = await job.getState();
  const progress = job.progress;
  const result = job.returnvalue;
  const reason = job.failedReason;

  res.json({
    id: job.id,
    state,
    progress,
    result,
    reason
  });
});


/**
 * POST /api/generate/stream
 * 🔥 스트리밍 파이프라인 (Queue-Safe v2)
 * - 스트리밍 UX는 유지
 * - 생성 전 QUEUED 상태로 DB 저장 → 실패 시 FAILED 처리 (retry 가능)
 * ENGINE_RULES: Queue 우회 금지, 모든 실패는 추적 대상
 */
router.post('/stream', requireAuth, validate(generateSchema), async (req: any, res) => {
  const { keyword, site_id: reqSiteId } = req.body;
  const user_id = req.userId;
  const traceId = req.headers['x-request-id'] as string;
  const targetKeyword = keyword || req.body.topic || '블로그 정보';
  let trackingPostId: string | null = null; // [A-2] 실패 추적용 포스트 ID

  MazaLogger.info(`[Stream] Starting stream for ${targetKeyword}`, { siteId: reqSiteId, userId: user_id, traceId });

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    if (!isSafeTopic(targetKeyword)) {
      res.write(`\n\n---ERROR---\n해당 키워드는 애드센스 정책에 위배될 수 있습니다.`);
      res.end();
      return;
    }

    // [A-2] 생성 시작 전 DB에 QUEUED 상태로 저장 (실패 추적 보장)
    if (supabaseAdmin && user_id) {
      try {
        const { data: trackingPost } = await supabaseAdmin.from('ms_posts').insert([{
          user_id,
          site_id: reqSiteId || null,
          title: targetKeyword,
          status: PostStatus.QUEUED,
          source_type: 'stream',
          metadata: { keyword: targetKeyword, stream_started_at: new Date().toISOString() }
        }]).select('id').single();
        trackingPostId = trackingPost?.id || null;
      } catch (trackErr) {
        console.warn('[Stream] Pre-tracking insert failed:', trackErr);
      }
    }

    // GENERATING 상태로 전환
    if (trackingPostId && supabaseAdmin) {
      await supabaseAdmin.from('ms_posts').update({ status: PostStatus.GENERATING }).eq('id', trackingPostId);
    }

    // 전략 컨텍스트 가져오기 (Section 2.2)
    const strategy = await FeedbackEngine.getStrategyContext(user_id);
    const prompt = buildGeneratePrompt(targetKeyword, strategy);
    let fullText = "";

    // 1. 스트리밍 생성
    await streamAI(prompt, (chunk) => {
      fullText += chunk;
      res.write(chunk);
    });

    // 2. JSON 파싱
    let parsed: any = {};
    try {
      const match = fullText.match(/\{[\s\S]*\}/);
      if (match) parsed = parseJSON(match[0]);
    } catch (e) {
      console.warn("[Stream] JSON parse failed on stream result");
    }

    // 3. 다중 이미지 추가 (스트리밍 시 3장 확보)
    if (parsed.title) {
      MazaLogger.info(`[Stream] Searching 3 images for: ${targetKeyword}`, { traceId });
      try {
        const [img1, img2, img3] = await Promise.all([
          getOptimizedImage(targetKeyword),
          getOptimizedImage(`${targetKeyword} detail`),
          getOptimizedImage(`${targetKeyword} view`)
        ]);
        parsed.image1 = img1;
        parsed.image2 = img2;
        parsed.image3 = img3;
      } catch {
        parsed.image1 = `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg`;
      }
    }

    // 4. UI 블록 자동 변환 (ver01 방식)
    let uiBlocks = parsed.blocks;
    if (!uiBlocks && Object.keys(parsed).length > 0) {
      uiBlocks = [];
      if (parsed.intro) uiBlocks.push({ type: "intro", text: parsed.intro });
      if (parsed.image1) uiBlocks.push({ type: "image", url: parsed.image1, alt: targetKeyword });
      if (parsed.content1) {
        uiBlocks.push({ type: "heading", text: `${targetKeyword}의 핵심 원리와 이해`, level: 2 });
        uiBlocks.push({ type: "paragraph", text: parsed.content1 });
      }
      if (parsed.insightBox) uiBlocks.push({ type: "insight", text: parsed.insightBox });
      if (parsed.image2) uiBlocks.push({ type: "image", url: parsed.image2, alt: `${targetKeyword} 상세` });
      if (parsed.summary) uiBlocks.push({ type: "summary_box", text: parsed.summary });
      if (parsed.content2) {
        uiBlocks.push({ type: "heading", text: "실전 적용 방법 및 주의사항", level: 2 });
        uiBlocks.push({ type: "paragraph", text: parsed.content2 });
      }
      if (parsed.experienceNote) uiBlocks.push({ type: "experience", text: parsed.experienceNote });
      if (parsed.image3) uiBlocks.push({ type: "image", url: parsed.image3, alt: `${targetKeyword} 마무리` });
      if (parsed.detailedFaqs && parsed.detailedFaqs.length > 0) {
        uiBlocks.push({ type: "faq", items: parsed.detailedFaqs });
      }
      if (parsed.outro) uiBlocks.push({ type: "conclusion", text: parsed.outro });
      if (parsed.hashtags) uiBlocks.push({ type: "hashtags", items: parsed.hashtags });
    }

    // 5. AdSense HTML 생성 전 사이트 상태 조회 (ver01 완전판 템플릿 + 투트랙 엔진)
    let adsenseStatus = 'pending';
    let adsensePub = '';
    let coupangId = '';
    let coupangTracking = '';
    let site_id = reqSiteId || null;

    if (supabaseAdmin && user_id) {
      try {
        if (!site_id) {
          const { data: site } = await supabaseAdmin.from('ms_sites').select('id, adsense_status, adsense_pub, metadata').eq('user_id', user_id).limit(1).maybeSingle();
          if (site) {
            site_id = site.id;
            adsenseStatus = site.adsense_status || 'pending';
            adsensePub = site.adsense_pub || '';
            coupangId = site.metadata?.coupang_id || '';
            coupangTracking = site.metadata?.coupang_tracking_code || '';
          }
        } else {
          const { data: site } = await supabaseAdmin.from('ms_sites').select('adsense_status, adsense_pub, metadata').eq('id', site_id).maybeSingle();
          if (site) {
            adsenseStatus = site.adsense_status || 'pending';
            adsensePub = site.adsense_pub || '';
            coupangId = site.metadata?.coupang_id || '';
            coupangTracking = site.metadata?.coupang_tracking_code || '';
          }
        }
      } catch (err) {
        console.warn('[Stream] Site fetch error:', err);
      }
    }

    const html = applyHTMLTemplate(parsed, targetKeyword, { adsenseStatus, adsensePub, coupangId, coupangTracking });
    const seoScore = calculateSEOScore(html, targetKeyword);

    // [v2 병행] ValidatorV2 정밀 점수 산출 (비동기, 실패해도 흐름 유지)
    let v2Score: any = null;
    try {
      v2Score = await ValidatorV2.validate(fullText, targetKeyword, user_id || '');
    } catch (v2Err) {
      console.warn('[Stream] ValidatorV2 scoring failed (non-fatal):', v2Err);
    }

    // 6. DB 저장 (tracking post 업데이트 또는 신규 삽입)
    if (supabaseAdmin && user_id && parsed.title) {
      if (trackingPostId) {
        // [A-2] 기존 tracking post 업데이트 (DRAFT 상태로 완성)
        const { error: updateErr } = await supabaseAdmin.from('ms_posts').update({
          title: parsed.title,
          content: fullText,
          html_content: html,
          status: PostStatus.DRAFT,
          word_count: html.replace(/\s+/g, '').length,
          seo_score: seoScore,
          metadata: { blocks: uiBlocks, data: parsed }
        }).eq('id', trackingPostId);

        if (updateErr) {
          console.error('[Stream] CRITICAL: DB update failed for post', trackingPostId, updateErr);
          // 실패를 기록하되 응답은 계속 (사용자 UX 보호)
        }
      } else {
        // fallback: tracking post 없으면 신규 삽입
        await supabaseAdmin.from('ms_posts').insert([{
          user_id, site_id,
          title: parsed.title,
          content: fullText,
          html_content: html,
          status: PostStatus.DRAFT,
          source_type: 'stream',
          word_count: html.replace(/\s+/g, '').length,
          seo_score: seoScore,
          metadata: { blocks: uiBlocks, data: parsed }
        }]);
      }
    }

    // 7. 최종 응답 마커 (프론트가 감지)
    res.write("\n\n---END---\n");
    res.write(JSON.stringify({ 
      success: true,
      post_id: trackingPostId,
      title: parsed.title || targetKeyword,
      blocks: uiBlocks || [{ type: "paragraph", text: "내용이 생성되었습니다." }],
      html,
      seoScore,
      v2Score,       // ValidatorV2 정밀 점수 (null이면 산출 실패)
      topic: targetKeyword
    }));
    res.end();

  } catch(err: unknown) {
    MazaLogger.error({ msg: `[Stream] Error for ${targetKeyword}`, error: err, siteId: reqSiteId, userId: user_id, traceId });

    // [A-2] 실패 시 FAILED 상태로 전환 (retry 가능하도록)
    if (trackingPostId && supabaseAdmin) {
      await supabaseAdmin.from('ms_posts').update({
        status: PostStatus.FAILED,
        metadata: { error: err.message, failed_at: new Date().toISOString() }
      }).eq('id', trackingPostId);
    }

    res.write(`\n\n---ERROR---\n${err.message}`);
    res.end();
  }
});

// ─── Phase 1: Magic Rewrite (부분 자동 수정) ──────────────────────────────────
router.post('/revise', requireAuth, async (req, res) => {
  try {
    const { blocks, feedback } = req.body;
    if (!blocks || !feedback) {
      return res.status(400).json({ success: false, error: "블록 데이터와 피드백이 필요합니다." });
    }

    const promptText = `당신은 구글 애드센스 승인과 SEO에 최적화된 블로그 전문 에디터입니다. 현재 연도는 2026년입니다.
사용자의 피드백을 바탕으로 아래 제공된 블로그 콘텐츠(블록 배열)를 수정해주세요.

[사용자 코멘트 (피드백)]
"${feedback}"

[원본 블록 데이터 (JSON)]
${JSON.stringify(blocks, null, 2)}

[수정 지침]
1. 사용자의 피드백에 해당하는 블록(특정 문단 등)을 찾아 내용을 자연스럽게 교체하거나 추가하세요. (예: 장소 이름 추가, 말투 변경 등)
2. 기존 블록의 전체적인 순서와 구조(이미지 등)는 최대한 유지하세요.
3. 기계적인 말투를 피하고 블로거 본인이 직접 쓴 것처럼 생생하게 적어주세요.
4. 수정이 완료된 전체 블록 배열을 유효한 JSON 배열 형태로만 반환하세요.`;

    const aiResponse = await callAI(promptText, { jsonMode: true });

    let revisedBlocks = [];
    try {
      revisedBlocks = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;
      if (!Array.isArray(revisedBlocks)) throw new Error("Not an array");
    } catch (parseError) {
      console.error("[Revise Parse Error]", parseError);
      return res.status(500).json({ success: false, error: "AI 응답 파싱 실패" });
    }

    res.json({ success: true, blocks: revisedBlocks });
  } catch(error: unknown) {
    console.error("[Revise Error]", error);
    res.status(500).json({ success: false, error: error.message || "수정 중 오류 발생" });
  }
});

// ─── Phase 2: 애드센스 탈락 처방전 (외부 글 세탁기) ─────────────────────────
router.post('/purify', requireAuth, async (req, res) => {
  try {
    const { originalText, reason } = req.body;
    if (!originalText || !reason) {
      return res.status(400).json({ success: false, error: "원본 글과 거절 사유가 필요합니다." });
    }

    const promptText = `당신은 구글 애드센스 승인과 SEO에 최적화된 블로그 전문 에디터입니다. 현재 연도는 2026년입니다.
사용자가 애드센스에서 [${reason}] 사유로 승인 거절을 받았습니다.
제공된 원본 글의 주제와 핵심 정보(팩트)는 살리되, 애드센스 승인에 완벽히 부합하는 EEAT 기반의 고품질 글로 재창조(세탁)해주세요. 특히 2026년 최신 기준에 맞춰 작성해주세요.

[애드센스 거절 사유에 따른 세탁 지침]
- "가치 있는 인벤토리: 콘텐츠 없음" 인 경우: 분량을 대폭 늘리고, 본인의 경험담과 전문적인 인사이트를 추가하여 정보의 가치를 높이세요.
- "기계적인 챗GPT 텍스트" 인 경우: AI가 쓴 듯한 딱딱한 말투(~합니다. 첫째, 둘째)를 사람 냄새 나는 에세이 스타일(~습니다. 제가 겪어보니~)로 완벽히 바꾸세요.
- 공통: 독자에게 주는 명확한 정보(가치)가 있어야 합니다.

[원본 글]
"${originalText}"

반드시 아래의 JSON 형식으로 응답하세요. (HTML이나 마크다운 백틱 없이 JSON만 반환)
{
  "title": "SEO 최적화된 제목 (30자 내외)",
  "intro": "서론 (1인칭 경험형 스토리텔링)",
  "summary": "글 전체의 핵심 내용을 3문장으로 요약",
  "content1": "본문 첫 번째 섹션 (풍부하고 생생한 문체)",
  "insightBox": "전문가적 관점에서 전수하는 핵심 노하우나 팁",
  "content2": "본문 두 번째 섹션 (구체적인 실천 방법이나 심화 정보)",
  "experienceNote": "작가가 직접 겪은 듯한 생생한 경험담이나 사례",
  "detailedFaqs": [
    {"q": "독자들이 가장 궁금해할 질문 1", "a": "그에 대한 상세한 답변"}
  ],
  "outro": "독자의 실천을 독려하는 결론"
}`;

    const rawContent = await callAI(promptText, { jsonMode: true });
    if (!rawContent) {
      throw new Error('AI 콘텐츠 세탁에 실패했습니다.');
    }

    let parsed: any;
    try {
      parsed = typeof rawContent === 'string' ? parseJSON(rawContent) : rawContent;
    } catch (e) {
      console.error("[Purify] JSON Parse Error:", e);
      throw new Error('AI 응답 형식이 올바르지 않습니다.');
    }

    // Convert parsed JSON into uiBlocks format for frontend
    const uiBlocks = [];
    if (parsed.intro) uiBlocks.push({ type: "intro", text: parsed.intro });
    if (parsed.content1) {
      uiBlocks.push({ type: "heading", text: "핵심 원리와 이해", level: 2 });
      uiBlocks.push({ type: "paragraph", text: parsed.content1 });
    }
    if (parsed.insightBox) uiBlocks.push({ type: "insight", text: parsed.insightBox });
    if (parsed.summary) uiBlocks.push({ type: "summary_box", text: parsed.summary });
    if (parsed.content2) {
      uiBlocks.push({ type: "heading", text: "실전 적용 방법 및 주의사항", level: 2 });
      uiBlocks.push({ type: "paragraph", text: parsed.content2 });
    }
    if (parsed.experienceNote) uiBlocks.push({ type: "experience", text: parsed.experienceNote });
    if (parsed.detailedFaqs && parsed.detailedFaqs.length > 0) {
      uiBlocks.push({ type: "faq", items: parsed.detailedFaqs });
    }
    if (parsed.outro) uiBlocks.push({ type: "conclusion", text: parsed.outro });

    // Generate HTML preview if needed, though frontend handles block rendering mostly
    const html = applyHTMLTemplate(parsed, parsed.title || '세탁된 콘텐츠');
    const seoScore = calculateSEOScore(html, parsed.title || '세탁된 콘텐츠');

    res.json({ 
      success: true, 
      blocks: uiBlocks, 
      html, 
      seoScore, 
      title: parsed.title,
      diagnosis: "애드센스 거절 사유에 맞춰, 기계적인 말투를 1인칭 경험담으로 교체하고 정보의 깊이를 더해 EEAT 점수를 대폭 향상시켰습니다."
    });
  } catch(error: unknown) {
    console.error("[Purify Error]", error);
    res.status(500).json({ success: false, error: error.message || "글 세탁 중 오류 발생" });
  }
});

/**
 * POST /api/generate/compliance
 * 애드센스 필수 5대 페이지 (소개, 약관, 개인정보 등) 자동 생성 및 저장
 */
router.post('/compliance', requireAuth, async (req: any, res) => {
  try {
    const { blog_name, owner_name, email } = req.body;
    const user_id = req.userId;
    if (!user_id) return res.status(400).json({ success: false, error: "user_id가 필요합니다." });

    const blog = blog_name || "내 블로그";
    const owner = owner_name || "운영자";
    const contactEmail = email || "contact@example.com";

    const pages = [
      { type: 'about', title: '블로그 소개 및 비전' },
      { type: 'privacy', title: '개인정보처리방침' },
      { type: 'terms', title: '이용약관' },
      { type: 'contact', title: '문의하기' },
      { type: 'disclaimer', title: '책임 한계 및 법적 고지' }
    ];

    const results = [];

    // 루프를 돌며 AI에게 각 페이지 생성 요청 (병렬 처리)
    const generatePromises = pages.map(async (page) => {
      let specializedInstruction = "";
      
      switch(page.type) {
        case 'about':
          specializedInstruction = "블로그의 전문성, 운영 목적, 독자에게 제공하는 가치, 신뢰할 수 있는 정보를 제공하겠다는 약속을 포함하여 최소 1,500자 이상의 풍부한 내용을 작성하세요.";
          break;
        case 'privacy':
          specializedInstruction = "GDPR 및 구글 애드센스 정책을 준수해야 합니다. 데이터 수집 항목(쿠키, 로그 데이터 등), 사용 목적, 구글 애드센스 광고 쿠키(DART) 사용에 대한 고지, 제3자 정보 제공, 사용자 권리, 연락처 정보 등을 법률적 용어를 사용하여 매우 상세하게 작성하세요.";
          break;
        case 'terms':
          specializedInstruction = "서비스 이용 규칙, 콘텐츠 저작권 정책, 면책 조항, 이용자의 권리 및 의무 등을 포함하여 매우 상세하게 작성하세요.";
          break;
        case 'contact':
          specializedInstruction = "사용자가 운영자에게 연락할 수 있는 공식적인 채널 고지, 문의 가능 시간, 스팸 방지 정책 등을 포함하세요.";
          break;
        case 'disclaimer':
          specializedInstruction = "정보의 정확성에 대한 책임 한계, 수익형 광고 포함 사실(애드센스 고지), 제휴 링크 포함 가능성 등을 명확히 밝히는 법적 고지문을 작성하세요.";
          break;
      }

      const prompt = `당신은 전문 법률 및 블로그 컨설턴트입니다. 현재 연도는 2026년입니다.
구글 애드센스 승인을 위해 블로그에 반드시 필요한 [${page.title}] 페이지 내용을 2026년 최신 법률 및 정책에 맞게 작성해주세요.
블로그명: ${blog}, 운영자: ${owner}, 연락처: ${contactEmail}

[특별 지침]
${specializedInstruction}

반드시 아래 JSON 형식으로 응답하세요:
{
  "title": "${page.title}",
  "content": "마크다운 형식의 본문 내용 (법적 효력이 느껴지도록 전문적이고 정중한 어조로 작성, 풍부한 분량 보장)"
}

주의: JSON 외의 텍스트는 절대 포함하지 마세요.`;

      const aiResponse = await callAI(prompt, { jsonMode: true });
      let data: any;
      try {
        data = typeof aiResponse === 'string' ? parseJSON(aiResponse) : aiResponse;
      } catch (e) {
        data = { title: page.title, content: `내용 생성 실패. 수동 작성이 필요합니다.` };
      }

      // 렌더링 (단순 텍스트 블록으로 구성)
      const uiBlocks = [
        { type: "heading", text: data.title, level: 1 },
        { type: "paragraph", text: data.content }
      ];

      // DB 저장 (ms_posts에 draft 상태로 저장하여 익스텐션이 가져갈 수 있게 함)
      if (supabaseAdmin) {
        // 사이트 ID 조회
        const { data: site } = await supabaseAdmin
          .from('ms_sites')
          .select('id')
          .eq('user_id', user_id)
          .maybeSingle();

        const site_id = site?.id || null;

        await supabaseAdmin.from('ms_posts').insert([{
          user_id,
          site_id,
          title: data.title,
          content: data.content,
          html_content: `<h1>${data.title}</h1><div style="white-space: pre-wrap;">${data.content}</div>`,
          status: 'draft',
          source_type: 'compliance',
          word_count: data.content.length,
          seo_score: 100,
          metadata: { blocks: uiBlocks, is_compliance: true }
        }]);
      }

      return { type: page.type, title: data.title };
    });

    const generatedPages = await Promise.all(generatePromises);

    res.json({ 
      success: true, 
      message: "필수 5대 페이지가 생성되어 '발행 대기' 목록에 추가되었습니다.",
      data: generatedPages 
    });

  } catch(error: unknown) {
    console.error("[Compliance Error]", error);
    res.status(500).json({ success: false, error: error.message || "페이지 생성 중 오류 발생" });
  }
});

/**
 * POST /api/generate/consulting
 * 애드센스 거절 사유 AI 분석 및 처방전 생성
 * Consulting.tsx에서 호출
 */
router.post('/consulting', requireAuth, async (req: any, res) => {
  try {
    const { reason } = req.body;
    const user_id = req.userId;

    if (!reason) {
      return res.status(400).json({ success: false, error: '거절 사유(reason)가 필요합니다.' });
    }

    const prompt = `당신은 구글 애드센스 승인 전문 컨설턴트입니다. 현재 연도는 2026년입니다.
사용자가 입력한 애드센스 거절 메시지를 분석하여, 구체적인 원인과 해결 전략을 처방하세요.

[거절 메시지]
"${reason}"

반드시 아래 JSON 형식으로 응답하세요:
{
  "cause": "거절의 핵심 원인 (1-2문장, 구체적으로)",
  "strategy": "즉각 적용 가능한 해결 전략 (1-2문장)",
  "tasks": [
    "즉시 수행할 액션 1",
    "즉시 수행할 액션 2",
    "즉시 수행할 액션 3",
    "즉시 수행할 액션 4"
  ],
  "keyword": "승인 확률을 높일 수 있는 추천 키워드 (10자 내외)"
}

주의: JSON 외의 텍스트는 절대 포함하지 마세요. 한국어로 응답하세요.`;

    const aiResponse = await callAI(prompt, { jsonMode: true });
    let data: any;
    try {
      data = typeof aiResponse === 'string' ? parseJSON(aiResponse) : aiResponse;
    } catch (e) {
      throw new Error('AI 응답 파싱 실패');
    }

    res.json({ success: true, data });
  } catch(error: unknown) {
    MazaLogger.error('[Consulting Error]', error);
    res.status(500).json({ success: false, error: error.message || '분석 중 오류 발생' });
  }
});


/**
 * POST /api/generate/recommend-titles
 * 사이트 맞춤형 전략 타이틀 10개 추천
 */
router.post('/recommend-titles', requireAuth, async (req: any, res) => {
  try {
    const { site_id } = req.body;
    const user_id = req.userId;
    if (!site_id || !user_id) {
      return res.status(400).json({ success: false, error: 'site_id와 user_id가 필요합니다.' });
    }

    // 1. 사이트 정보 조회
    if (!supabaseAdmin) throw new Error('Supabase not initialized');
    
    const { data: site, error: siteError } = await supabaseAdmin
      .from('ms_sites')
      .select('*')
      .eq('id', site_id)
      .single();

    if (siteError || !site) {
      return res.status(404).json({ success: false, error: '사이트 정보를 찾을 수 없습니다.' });
    }

    // 2. 전략 추천 프롬프트 생성
    const niche = site.category || site.niche || '일반 정보';
    const siteTitle = site.title || '내 블로그';

    const prompt = `당신은 블로그 콘텐츠 전략가이자 구글 SEO 전문가입니다. 현재 연도는 2026년입니다.
운영 중인 블로그의 주제(${niche})와 이름(${siteTitle})을 바탕으로, 애드센스 승인 확률이 높고 검색 유입이 보장되는 'Winning Blueprint' 기반의 포스팅 제목 10개를 제안해주세요. 2024년 등 과거 연도를 절대 사용하지 말고, 연도가 필요하다면 반드시 2026년을 사용하세요.

[지침]
1. 주제에 대해 깊이 있는 정보를 줄 수 있는 연재(Series) 형태의 제목을 포함하세요.
2. 초보자 가이드, 심층 분석, 실전 팁 등 다양한 형식을 섞어주세요.
3. 한국어 사용자의 검색 의도를 고려하여 매력적인 클릭을 유도하는 제목이어야 합니다.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "niche": "${niche}",
  "recommendations": [
    {"title": "추천 제목 1", "reason": "추천 사유 및 SEO 포인트"},
    {"title": "추천 제목 2", "reason": "추천 사유 및 SEO 포인트"},
    ... (총 10개)
  ]
}

주의: JSON 외의 텍스트는 절대 포함하지 마세요.`;

    const aiResponse = await callAI(prompt, { jsonMode: true });
    let data: any;
    try {
      data = typeof aiResponse === 'string' ? parseJSON(aiResponse) : aiResponse;
    } catch (e) {
      throw new Error('AI 응답 파싱 실패');
    }

    res.json({ success: true, data });
  } catch(error: unknown) {
    console.error('[Recommend Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/generate/save-legal
 * 필수 페이지(법적 문서)를 DB에 저장하고 익스텐션 큐에 등록
 */
router.post('/save-legal', requireAuth, async (req: any, res) => {
  try {
    const { site_id, title, html, type } = req.body;
    const user_id = req.userId;

    if (!user_id || !site_id || !title || !html) {
      return res.status(400).json({ success: false, error: '필수 정보가 누락되었습니다.' });
    }

    if (!supabaseAdmin) throw new Error('Supabase not initialized');

    // 1. ms_posts에 저장
    const { data: post, error: postError } = await supabaseAdmin
      .from('ms_posts')
      .insert([{
        user_id,
        site_id,
        title,
        html_content: html,
        content: html,
        status: 'draft',
        source_type: 'legal',
        metadata: { post_type: type || 'page' }
      }])
      .select('id')
      .single();

    if (postError) throw postError;

    // [FIX] 중복 방지: 동일 사이트의 기존 대기 중인 법적 문서 일괄 삭제/취소 처리
    // 이렇게 하면 익스텐션 목록에 하나만 뜨게 됩니다.
    await supabaseAdmin
      .from('ms_scheduled_posts')
      .delete()
      .eq('site_id', site_id)
      .eq('status', 'queued');

    // 2. ms_scheduled_posts에 등록
    const { error: scheduleError } = await supabaseAdmin
      .from('ms_scheduled_posts')
      .insert([{
        user_id,
        site_id,
        post_id: post.id,
        publish_at: new Date().toISOString(),
        status: 'queued'
      }]);

    if (scheduleError) throw scheduleError;

    res.json({ success: true, data: { id: post.id } });
  } catch(error: unknown) {
    console.error('[Save Legal Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
