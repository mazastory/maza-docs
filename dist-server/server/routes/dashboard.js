import express from 'express';
import { supabaseAdmin } from '../lib/supabaseServer.js';
import { requireAuth } from '../middleware/auth.js';
import { AuthorityEngine } from '../lib/authorityEngine.js';
const router = express.Router();
/**
 * GET /api/dashboard/stats
 * 유저의 대시보드 통계 및 사이트 상태 조회 (성능 최적화 버전)
 */
router.get('/stats', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        if (!supabaseAdmin) {
            return res.json({ success: true, data: { totalPosts: 0, avgSeoScore: 0 } });
        }
        // 1. 병렬 쿼리 실행 (성능 극대화)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const [{ data: sites, error: siteError }, { count: totalPosts, error: totalError }, { count: thisWeekPosts, error: weekError }, { data: seoData, error: seoError }, { count: complianceCount }, { count: gscEventCount }, { data: recentPosts }] = await Promise.all([
            supabaseAdmin.from('ms_sites').select('*').eq('user_id', userId),
            supabaseAdmin.from('ms_posts').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'published'),
            supabaseAdmin.from('ms_posts').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'published').gt('created_at', oneWeekAgo.toISOString()),
            supabaseAdmin.from('ms_posts').select('seo_score').eq('user_id', userId).gt('seo_score', 0),
            supabaseAdmin.from('ms_posts').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('source_type', 'compliance'),
            supabaseAdmin.from('ms_events').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('event_type', 'gsc_ping'),
            supabaseAdmin.from('ms_posts').select('id, title, created_at, seo_score, status').eq('user_id', userId).order('created_at', { ascending: false }).limit(5)
        ]);
        // Average SEO Score 계산
        let avgSeoScore = 0;
        if (seoData && seoData.length > 0) {
            const total = seoData.reduce((acc, curr) => acc + (curr.seo_score || 0), 0);
            avgSeoScore = Math.round(total / seoData.length);
        }
        const site = sites?.[0];
        res.json({
            success: true,
            data: {
                totalPosts: totalPosts || 0,
                thisWeekPosts: thisWeekPosts || 0,
                avgSeoScore,
                adsenseStatus: site?.adsense_status || (site?.adsense_pub ? 'approved' : 'pending'),
                hasCompliance: (complianceCount || 0) >= 5,
                hasGscAutomated: (gscEventCount || 0) > 0,
                sites: sites || [],
                recentPosts: recentPosts || []
            }
        });
    }
    catch (error) {
        console.error('[Dashboard Stats Error]', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
/**
 * GET /api/dashboard/hall-of-fame
 */
router.get('/hall-of-fame', async (req, res) => {
    try {
        if (!supabaseAdmin)
            return res.json({ success: true, data: [] });
        const { data, error } = await supabaseAdmin
            .from('ms_sites')
            .select('*')
            .not('blog_name', 'is', null)
            .order('created_at', { ascending: false })
            .limit(20);
        const approvedSites = (data || []).filter((s) => s.adsense_status === 'approved' || s.is_setup_complete === true);
        if (error)
            throw error;
        res.json({ success: true, data: approvedSites });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
/**
 * GET /api/dashboard/autopilot-status
 * 오토파일럿 엔진의 실시간 상태 조회
 */
router.get('/autopilot-status', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        if (!supabaseAdmin) {
            return res.json({ success: true, data: { safetyCooldown: 0, totalCompleted: 0 } });
        }
        // 1. 마지막 발행 기록 조회 (W-05 Cooldown 계산)
        const { data: lastPost } = await supabaseAdmin
            .from('ms_posts')
            .select('created_at')
            .eq('user_id', userId)
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        let safetyCooldown = 0;
        if (lastPost) {
            const lastTime = new Date(lastPost.created_at).getTime();
            const now = new Date().getTime();
            const elapsed = Math.floor((now - lastTime) / 1000);
            safetyCooldown = Math.max(0, 10800 - elapsed); // 3시간 = 10800초
        }
        // 2. 전체 완료 건수 및 시리즈 현황 + 큐 대기열 현황
        const [{ count: totalCompleted }, { data: activeSeries }, { data: activePost }] = await Promise.all([
            supabaseAdmin.from('ms_posts').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'published'),
            supabaseAdmin.from('ms_topic_clusters').select('*').eq('user_id', userId).eq('status', 'active').limit(1).maybeSingle(),
            supabaseAdmin.from('ms_posts')
                .select('id, title, status, metadata')
                .eq('user_id', userId)
                .eq('status', 'draft') // 현재 작업 중인 포스트
                .not('metadata->engine_status', 'is', null)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle()
        ]);
        // 3. 최근 AI 작업 조회 (최신 이벤트)
        const { data: lastEvent } = await supabaseAdmin
            .from('ms_events')
            .select('metadata, created_at')
            .eq('user_id', userId)
            .eq('event_type', 'generate')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        // 4. 지능형 상태 및 진행률 계산
        let currentTask = activePost?.title || lastEvent?.metadata?.keyword || null;
        let progress = 0;
        let engineStatus = activePost?.metadata?.engine_status;
        if (activePost) {
            if (engineStatus === 'generating') {
                progress = 30;
                currentTask = `[AI 집필 중] ${activePost.title}`;
            }
            else if (engineStatus === 'image_processing') {
                progress = 60;
                currentTask = `[이미지 생성 중] ${activePost.title}`;
            }
            else if (engineStatus === 'validating') {
                progress = 90;
                currentTask = `[SEO 검증 중] ${activePost.title}`;
            }
            else if (engineStatus === 'ready_to_publish') {
                progress = 100;
                currentTask = `[발행 대기] ${activePost.title}`;
            }
            else {
                progress = 10;
            }
        }
        else if (lastEvent) {
            const isRecent = (Date.now() - new Date(lastEvent.created_at).getTime()) < 300000; // 5분 이내
            progress = isRecent ? 100 : 0;
        }
        const isActive = !!(activeSeries) || !!(activePost) || (progress > 0 && progress < 100);
        res.json({
            success: true,
            data: {
                isActive,
                currentTask,
                progress,
                safetyCooldown,
                totalCompleted: totalCompleted || 0,
                activeSeries: activeSeries ? {
                    title: activeSeries.title,
                    total: activeSeries.total_count || activeSeries.keywords?.length || 0,
                    current: activeSeries.current_index || 0,
                    nextKeyword: activeSeries.keywords?.[activeSeries.current_index] || activeSeries.keywords?.[0]
                } : null
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
/**
 * GET /api/dashboard/clusters
 * 사이트별 토픽 클러스터 목록 조회
 */
router.get('/clusters', requireAuth, async (req, res) => {
    try {
        const { site_id } = req.query;
        if (!site_id)
            return res.status(400).json({ success: false, error: 'site_id is required' });
        const { data, error } = await supabaseAdmin
            .from('ms_topic_clusters')
            .select('*')
            .eq('site_id', site_id)
            .order('authority_score', { ascending: false });
        if (error)
            throw error;
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, error: '클러스터 목록을 가져오지 못했습니다.' });
    }
});
/**
 * POST /api/dashboard/clusters
 * 새 토픽 클러스터 생성
 */
router.post('/clusters', requireAuth, async (req, res) => {
    try {
        const { site_id, name, description, niche } = req.body;
        const userId = req.userId;
        if (!site_id || !name)
            return res.status(400).json({ success: false, error: 'site_id와 name은 필수입니다.' });
        const { data, error } = await supabaseAdmin
            .from('ms_topic_clusters')
            .insert([{
                site_id,
                user_id: userId,
                name,
                description,
                niche,
                authority_score: 0
            }])
            .select()
            .single();
        if (error)
            throw error;
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, error: '클러스터 생성에 실패했습니다.' });
    }
});
/**
 * GET /api/dashboard/clusters/:id
 * 특정 클러스터 상세 및 실시간 권위 지표 조회
 */
router.get('/clusters/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        // 1. 클러스터 기본 정보
        const { data: cluster, error } = await supabaseAdmin
            .from('ms_topic_clusters')
            .select('*, ms_posts(id, title, status, gsc_ctr, is_indexed)')
            .eq('id', id)
            .single();
        if (error || !cluster)
            throw new Error('Cluster not found');
        // 2. 실시간 Authority Score 계산 (B-2 엔진 호출)
        const realTimeScore = await AuthorityEngine.calculateTopicalDepth(cluster.site_id, id);
        // 3. 점수 업데이트 (비동기 캐싱)
        if (realTimeScore !== cluster.authority_score) {
            await supabaseAdmin.from('ms_topic_clusters').update({ authority_score: realTimeScore }).eq('id', id);
        }
        res.json({
            success: true,
            data: {
                ...cluster,
                authority_score: realTimeScore
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: '클러스터 정보를 가져오지 못했습니다.' });
    }
});
export default router;
