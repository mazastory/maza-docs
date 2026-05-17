/**
 * =============================================
 * MAZA Studio - Health & Observability API
 * AGENTS.md: Phase 5 - Real-time monitoring
 * =============================================
 */
import express from 'express';
import { generateQueue, imageQueue, validateQueue, publishQueue } from '../lib/queues.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';
const router = express.Router();
/**
 * getSystemStats: 모든 핵심 시스템 지표를 수집하여 반환합니다.
 * WebSocket 및 HTTP API에서 공동으로 사용합니다.
 */
export async function getSystemStats() {
    // 1. Queue Status (BullMQ)
    const [gen, img, val, pub] = await Promise.all([
        generateQueue.getJobCounts('wait', 'active', 'completed', 'failed', 'delayed'),
        imageQueue.getJobCounts('wait', 'active', 'completed', 'failed', 'delayed'),
        validateQueue.getJobCounts('wait', 'active', 'completed', 'failed', 'delayed'),
        publishQueue.getJobCounts('wait', 'active', 'completed', 'failed', 'delayed')
    ]);
    // 2. DB Stats (Recent 24h)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentPosts } = await supabaseAdmin
        .from('ms_posts')
        .select('status, created_at')
        .gte('created_at', yesterday);
    // 3. API Usage (Global)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const { count: globalApiCount } = await supabaseAdmin
        .from('ms_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'generate')
        .gte('created_at', startOfDay.toISOString());
    return {
        queues: {
            generate: gen,
            image: img,
            validate: val,
            publish: pub
        },
        db: {
            total24h: recentPosts?.length || 0,
            success24h: recentPosts?.filter((p) => ['published', 'draft', 'scheduled'].includes(p.status)).length || 0,
            failed24h: recentPosts?.filter((p) => p.status === 'failed' || p.status === 'error').length || 0,
            retry24h: recentPosts?.filter((p) => p.status === 'retry').length || 0
        },
        budget: {
            todayCount: globalApiCount || 0,
            limit: 1000 // Global system limit
        },
        system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            timestamp: new Date().toISOString()
        }
    };
}
router.get('/', async (req, res) => {
    try {
        const stats = await getSystemStats();
        res.json({ success: true, data: stats });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
export default router;
