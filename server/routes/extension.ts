import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/extension/analyze-page
 * 현재 페이지 감지 결과를 받아 AI 추천 액션 반환
 * Extension DetectionLayer → Side Panel AI Planner 섹션
 */
router.post('/analyze-page', requireAuth, async (req, res) => {
  try {
    const { platform, seo, pageScore, checks } = req.body;

    const recommendations: Array<{
      id: string;
      icon: string;
      title: string;
      description: string;
      action: string;
      priority: 'HIGH' | 'MEDIUM' | 'LOW';
      impact: string;
    }> = [];

    // GA4 미설치
    if (!seo?.ga4 && platform === 'tistory') {
      recommendations.push({
        id: 'setup_ga4',
        icon: '📊',
        title: 'GA4 애널리틱스 설치',
        description: '방문자 행동 분석을 통해 콘텐츠 전략을 고도화하세요.',
        action: 'INJECT_INFRA',
        priority: 'HIGH',
        impact: '트래픽 패턴 분석 가능 → CTR 개선',
      });
    }

    // GSC 미설치
    if (!seo?.gsc && platform === 'tistory') {
      recommendations.push({
        id: 'setup_gsc',
        icon: '🔍',
        title: 'Search Console 소유권 확인',
        description: '구글 검색 인덱싱 시작을 위한 필수 단계입니다.',
        action: 'INJECT_INFRA',
        priority: 'HIGH',
        impact: '구글 검색 노출 시작 → 오가닉 트래픽',
      });
    }

    // AdSense 미설치
    if (!seo?.adsense && platform === 'tistory') {
      recommendations.push({
        id: 'setup_adsense',
        icon: '💰',
        title: 'AdSense 광고 단위 확인',
        description: '광고 코드가 감지되지 않습니다. 수익화 설정을 확인하세요.',
        action: 'CHECK_ADSENSE',
        priority: 'MEDIUM',
        impact: '광고 수익 활성화',
      });
    }

    // SEO 점수 낮음
    const score = pageScore || 0;
    if (score > 0 && score < 70) {
      const failedChecks = (checks || []).filter((c: any) => !c.ok);
      recommendations.push({
        id: 'seo_improve',
        icon: '📈',
        title: `SEO 점수 개선 필요 (현재 ${score}점)`,
        description: failedChecks.length > 0
          ? `미충족 항목: ${failedChecks.map((c: any) => c.name).join(', ')}`
          : '80점 이상을 목표로 콘텐츠를 보완하세요.',
        action: 'ANALYZE_SEO',
        priority: score < 50 ? 'HIGH' : 'MEDIUM',
        impact: 'AdSense 승인 확률 상승',
      });
    } else if (score >= 80) {
      recommendations.push({
        id: 'seo_good',
        icon: '✅',
        title: `SEO 점수 우수 (${score}점)`,
        description: '현재 페이지의 SEO 상태가 양호합니다.',
        action: 'NONE',
        priority: 'LOW',
        impact: 'AdSense 승인에 유리한 상태',
      });
    }

    // 콘텐츠 발행 추천 (편집 페이지)
    if (platform && platform !== 'unknown') {
      recommendations.push({
        id: 'inject_post',
        icon: '✍️',
        title: '대기 콘텐츠 발행',
        description: 'MAZA AI Writer가 작성한 포스트를 이 에디터에 주입하세요.',
        action: 'INJECT_POST',
        priority: 'MEDIUM',
        impact: 'W-05 안전 프로토콜로 계획적 발행',
      });
    }

    res.json({ success: true, recommendations });
  } catch (error: any) {
    console.error('[Extension/analyze-page]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/extension/preview-injection
 * 주입 전 미리보기 데이터 생성 (Before/After)
 * Approval Gate Preview Modal용
 */
router.post('/preview-injection', requireAuth, async (req, res) => {
  try {
    const { post_id, platform, title, html_preview } = req.body;

    if (!post_id && !title) {
      return res.status(400).json({ success: false, error: 'post_id 또는 title이 필요합니다.' });
    }

    const charCount = (html_preview || '').replace(/<[^>]*>/g, '').length;
    const estimatedScore = Math.min(100, 50 + Math.floor(charCount / 30));

    const platformNames: Record<string, string> = {
      tistory: '티스토리',
      naver: '네이버 블로그',
      wordpress: 'WordPress',
      blogger: 'Blogger',
    };

    res.json({
      success: true,
      title: title || '제목 없음',
      charCount,
      estimatedScore,
      platform: platformNames[platform] || platform || '알 수 없음',
      summary: `"${(title || '').substring(0, 25)}${title?.length > 25 ? '...' : ''}" — ${charCount.toLocaleString()}자 · 예상 SEO ${estimatedScore}점`,
      steps: [
        '에디터 자동 감지',
        '제목 입력',
        '본문 HTML 삽입',
        '대표 이미지 설정',
        'SEO 검증',
      ],
    });
  } catch (error: any) {
    console.error('[Extension/preview-injection]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/extension/delete-post
 * Side Panel에서 대기 포스트 삭제
 */
router.post('/delete-post', requireAuth, async (req, res) => {
  try {
    const { post_id } = req.body;
    const userId = req.userId!;

    if (!post_id) {
      return res.status(400).json({ success: false, error: 'post_id가 필요합니다.' });
    }

    const { supabaseAdmin } = await import('../lib/supabaseServer.js');
    if (!supabaseAdmin) {
      return res.status(503).json({ success: false, error: 'DB 연결 실패' });
    }

    // 1. ms_scheduled_posts에서 삭제 시도 (예약 포스트)
    const { data: scheduledDeleted } = await supabaseAdmin
      .from('ms_scheduled_posts')
      .delete()
      .eq('id', post_id)
      .eq('user_id', userId)
      .select('post_id');

    // 2. ms_posts에서도 삭제 (draft 포스트 또는 예약의 원본)
    //    scheduled_id로 온 경우: 연결된 post_id를 찾아서 삭제
    //    post_id로 온 경우: 직접 삭제
    const postIdToDelete = scheduledDeleted?.[0]?.post_id || post_id;
    
    // ms_posts 테이블은 'deleted' status check 제약조건 위반으로 에러가 났음
    // 큐에서 삭제 시 원본 draft도 영구 삭제(hard delete) 처리
    await supabaseAdmin
      .from('ms_posts')
      .delete()
      .eq('id', postIdToDelete)
      .eq('user_id', userId);

    // 혹시 post_id가 scheduled_posts의 post_id 컬럼과 매칭되면 그것도 삭제
    await supabaseAdmin
      .from('ms_scheduled_posts')
      .delete()
      .eq('post_id', postIdToDelete)
      .eq('user_id', userId);

    res.json({ success: true, message: '삭제 완료' });
  } catch (error: any) {
    console.error('[Extension/delete-post]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/extension/heal
 * [Phase 5] AI Self-Healing Trigger
 * DOM Snapshot을 분석하여 대안 셀렉터나 액션을 반환
 */
router.post('/heal', requireAuth, async (req, res) => {
  try {
    const { jobId, error, html } = req.body;
    const { callAI } = await import('../lib/aiClient.js');

    console.log(`[Heal API] 🩺 AI Healing requested for job ${jobId}. Error: ${error}`);

    const prompt = `
      You are a DOM Repair Agent for a browser automation tool.
      The automation failed with error: "${error}"
      
      Below is the HTML snapshot of the page (simplified).
      Find the most likely CSS selectors for the following elements:
      1. Post Title (input or textarea)
      2. Main Editor (contenteditable div or textarea)
      3. Publish Button
      
      Return ONLY a JSON object:
      {
        "selectors": {
          "title": "css_selector",
          "editor": "css_selector",
          "publish": "css_selector"
        },
        "reason": "Brief explanation of why the previous one failed and why this should work"
      }

      HTML Snapshot:
      ${html.substring(0, 50000)} // Limit to avoid token overflow
    `;

    const aiResponse = await callAI(prompt, { jsonMode: true, model: 'gemini-3-flash-preview' });
    const repair = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;

    console.log(`[Heal API] 💊 Healing complete. New selectors:`, repair.selectors);

    res.json({
      success: true,
      selectors: repair.selectors,
      action: 'RETRY'
    });
    
  } catch (err: any) {
    console.error('[Extension/heal] Healing failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/visual-click', requireAuth, async (req, res) => {
  try {
    const { screenshot, target } = req.body;
    const { VisionAgent } = await import('../lib/visionAgent.js');

    console.log(`[Vision API] 👁️ Visual Fallback requested for target: ${target}`);

    const result = await VisionAgent.findCoordinates(screenshot, target);

    if (!result || result.confidence < 0.5) {
      throw new Error(`Target [${target}] not found with high confidence.`);
    }

    res.json({
      success: true,
      x: result.x,
      y: result.y,
      confidence: result.confidence
    });
    
  } catch (err: any) {
    console.error('[Extension/visual-click] Visual search failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
