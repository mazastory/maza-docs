import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { VaultManagerAgent } from '../lib/agents/vaultManager.js';
import { ShuffleEngineAgent } from '../lib/agents/shuffleEngine.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';

const router = Router();
const vaultManager = VaultManagerAgent.getInstance();

/**
 * GET /api/hunter/blueprints
 * 현재 로드된 모든 Winning Blueprints 반환
 */
router.get('/blueprints', requireAuth, (req, res) => {
  try {
    const blueprints = vaultManager.getAllBlueprints();
    res.json({ success: true, data: blueprints });
  } catch(error: unknown) {
    console.error('[Hunter API] Failed to fetch blueprints:', error);
    res.status(500).json({ success: false, error: '블루프린트 목록을 가져오지 못했습니다.' });
  }
});

/**
 * POST /api/hunter/generate-series
 * 특정 Blueprint를 선택하여 시리즈(마스터 브리프 + 배차) 생성
 */
router.post('/generate-series', requireAuth, async (req, res) => {
  try {
    const { blueprintId, count = 3 } = req.body;
    const userId = req.userId!;

    if (!blueprintId) {
      return res.status(400).json({ success: false, error: 'blueprintId가 필요합니다.' });
    }

    const blueprint = vaultManager.getBlueprintById(blueprintId);
    if (!blueprint) {
      return res.status(404).json({ success: false, error: '해당 Blueprint를 찾을 수 없습니다.' });
    }

    const keywords = vaultManager.getVaultKeywords(blueprintId);
    if (keywords.length === 0) {
      return res.status(400).json({ success: false, error: '해당 Blueprint에 키워드가 없습니다.' });
    }

    // 1. 키워드 무작위 추출 (Shuffle)
    const selectedKeywords = ShuffleEngineAgent.shuffleKeywords(keywords, Math.min(count, keywords.length));
    
    // 2. 마스터 브리프 생성
    const masterBrief = ShuffleEngineAgent.generateMasterBrief(blueprint, selectedKeywords);

    // 3. 시리즈(Topic Cluster) 생성
    const { data: cluster, error: clusterError } = await supabaseAdmin
      .from('ms_topic_clusters')
      .insert([{
        user_id: userId,
        title: `${blueprint.title} (자동 생성)`,
        name: `${blueprint.title} (자동 생성)`,
        pillar_keyword: selectedKeywords[0],
        sub_keywords: selectedKeywords.slice(1),
        description: blueprint.description,
        keywords: selectedKeywords,
        master_brief: masterBrief,
        status: 'building',
        interval_hours: 3 // W-05 3시간 간격 강제
      }])
      .select('id')
      .single();

    if (clusterError || !cluster) {
      throw new Error(`클러스터 생성 실패: ${clusterError?.message}`);
    }

    const clusterId = cluster.id;

    // 4. 배차 스케줄링 (ms_scheduled_posts 생성)
    // 3시간 간격(W-05)으로 배차
    const scheduledPosts = selectedKeywords.map((kw, index) => {
      const publishAt = new Date();
      publishAt.setHours(publishAt.getHours() + (index * 3)); // 3시간 간격

      return {
        user_id: userId,
        site_id: req.body.siteId || null, // UI에서 전달된 siteId 연동
        post_id: null,
        keyword: kw,
        publish_at: publishAt.toISOString(),
        status: 'queued',
        metadata: {
          blueprint_id: blueprint.id,
          cluster_id: clusterId,
          series_order: index + 1,
          step: 'generation_pending'
        }
      };
    });

    const { error: scheduleError } = await supabaseAdmin
      .from('ms_scheduled_posts')
      .insert(scheduledPosts);

    if (scheduleError) {
      throw new Error(`배차 생성 실패: ${scheduleError.message}`);
    }

    res.json({ 
      success: true, 
      message: '시리즈 기획 및 배차가 완료되었습니다.',
      clusterId,
      keywords: selectedKeywords
    });

  } catch(error: unknown) {
    console.error('[Hunter API] Failed to generate series:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/hunter/stop-series
 * 현재 진행 중인 모든 자동화 배차 중단
 */
router.post('/stop-series', requireAuth, async (req, res) => {
  try {
    const userId = req.userId!;
    
    // 1. 대기 중인 예약 포스트 취소
    const { error: postError } = await supabaseAdmin
      .from('ms_scheduled_posts')
      .update({ status: 'CANCELLED' })
      .eq('user_id', userId)
      .in('status', ['queued', 'pending', 'generating', 'processing']);

    if (postError) throw postError;

    // 2. 현재 빌드 중인 클러스터 중단
    await supabaseAdmin
      .from('ms_topic_clusters')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .eq('status', 'active');

    res.json({ success: true, message: '모든 자동화 작업이 중단되었습니다.' });
  } catch(error: unknown) {
    console.error('[Hunter API] Failed to stop series:', error);
    res.status(500).json({ success: false, error: '중단 처리 중 오류가 발생했습니다.' });
  }
});

/**
 * POST /api/hunter/stop-post/:postId
 * 특정 포스트 생성 중단
 */
router.post('/stop-post/:postId', requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId!;

    const { error } = await supabaseAdmin
      .from('ms_posts')
      .update({ status: 'FAILED', metadata: { error: 'USER_STOPPED' } })
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ success: true, message: '포스트 생성이 중단되었습니다.' });
  } catch(error: unknown) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
