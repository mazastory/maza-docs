import { Router } from 'express';
import { SeriesManager } from '../lib/seriesManager.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';
import { generateQueue } from '../lib/queues.js';
import { PostStatus } from '../lib/postStatus.js';
import { requireAuth } from '../middleware/auth.js';
import { scheduleSeries } from '../lib/engine.js';

const router = Router();

/**
 * 0. 시리즈 마스터 브리프 및 배차 생성 (POST /api/series/generate)
 */
router.post('/generate', requireAuth, async (req, res) => {
  const { title, postCount, site_id, platform } = req.body;
  const userId = req.userId; // auth middleware에서 주입됨

  try {
    const series = await SeriesManager.createMasterBrief({
      title,
      postCount: postCount || 5,
      userId: userId!,
      siteId: site_id, // site_id 추가
      platform: platform || 'tistory'
    });

    // 핵심 누락: 마스터 브리프 생성 후 엔진의 큐 배차 로직(W-05)을 호출하여 즉시 발행 프로세스 시작
    await scheduleSeries(userId!, series.id);

    res.json({ 
      success: true, 
      message: `"${title}" 시리즈 마스터 브리프 설계 및 배차가 완료되었습니다.`,
      data: series 
    });
  } catch (error: any) {
    console.error("[Series Generate Error]", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 1. 시리즈/배차 리스트 조회 (GET /api/series)
 */
router.get('/', requireAuth, async (req, res) => {
  const userId = req.userId;
  try {
    if (!supabaseAdmin) throw new Error("Supabase Admin not available");

    const { data, error } = await supabaseAdmin
      .from('ms_topic_clusters')
      .select('*, ms_posts(id, title, status)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 2. 새 클러스터/시리즈 생성 (POST /api/series)
 */
router.post('/', requireAuth, async (req, res) => {
  const { title, keywords, site_id } = req.body;
  const userId = req.userId;
  try {
    if (!supabaseAdmin) throw new Error("Supabase Admin not available");

    const { data, error } = await supabaseAdmin
      .from('ms_topic_clusters')
      .insert({
        user_id: userId,
        site_id,
        title: title || '새 시리즈',
        pillar_keyword: title || '새 시리즈',
        keywords: keywords || [],
        authority_score: 0.1
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 3. 클러스터 수정 (PATCH /api/series/:id)
 */
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    if (!supabaseAdmin) throw new Error("Supabase Admin not available");

    const { data, error } = await supabaseAdmin
      .from('ms_topic_clusters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 4. 클러스터 삭제 (DELETE /api/series/:id)
 */
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    if (!supabaseAdmin) throw new Error("Supabase Admin not available");

    const { error } = await supabaseAdmin
      .from('ms_topic_clusters')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 5. 즉시 발행 시작 (POST /api/series/:id/schedule)
 */
router.post('/:id/schedule', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    if (!supabaseAdmin) throw new Error("Supabase Admin not available");

    const { data: cluster, error: clusterError } = await supabaseAdmin
      .from('ms_topic_clusters')
      .select('*')
      .eq('id', id)
      .single();

    if (clusterError || !cluster) throw new Error("시리즈 정보를 찾을 수 없습니다.");

    // 최신 V2 엔진으로 전체 키워드 재배차 시도
    await scheduleSeries(userId!, id as string);

    res.json({ 
      success: true, 
      message: `[${cluster.title}] 시리즈 배차가 재시작되었습니다.` 
    });
  } catch (error: any) {
    console.error("[Schedule Error]", error);
    res.status(500).json({ success: false, error: `발행 엔진 오류: ${error.message}` });
  }
});

export default router;
