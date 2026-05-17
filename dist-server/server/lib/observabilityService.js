/**
 * =============================================
 * MAZA Studio - Observability & Monitoring Service
 * AGENTS.md: Operational Stability (S-03)
 * =============================================
 */
import { generateQueue, imageQueue, validateQueue, publishQueue, verificationQueue } from './queues.js';
import { supabaseAdmin } from './supabaseServer.js';
import { MazaLogger } from './logger.js';
export class ObservabilityService {
    /**
     * 전역 시스템 메트릭 요약
     */
    static async getSystemMetrics() {
        const queues = [
            { name: 'AI Writing', queue: generateQueue },
            { name: 'Image Processing', queue: imageQueue },
            { name: 'Validation', queue: validateQueue },
            { name: 'Distribution', queue: publishQueue },
            { name: 'Verification', queue: verificationQueue }
        ];
        const queueStats = await Promise.all(queues.map(async (q) => {
            const counts = await q.queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed', 'paused');
            return {
                name: q.name,
                waiting: counts.waiting,
                active: counts.active,
                completed: counts.completed,
                failed: counts.failed,
                delayed: counts.delayed
            };
        }));
        // 최근 24시간 장애 통계 (Heatmap용)
        const { data: failStats } = await supabaseAdmin
            .from('ms_worker_metrics')
            .select('worker_name, error_type, created_at')
            .eq('status', 'failed')
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
        // 재시도 중인 작업 수
        const { count: retryCount } = await supabaseAdmin
            .from('ms_scheduled_posts')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'retry');
        return {
            queues: queueStats,
            failureHeatmap: this.processFailureHeatmap(failStats || []),
            retryCount: retryCount || 0,
            timestamp: new Date().toISOString()
        };
    }
    /**
     * 워커 메트릭 기록 (각 워커에서 호출)
     */
    static async recordMetric(workerName, jobId, status, startTime, errorType) {
        try {
            const duration = Date.now() - startTime;
            await supabaseAdmin.from('ms_worker_metrics').insert([{
                    worker_name: workerName,
                    job_id: jobId,
                    status,
                    processing_time_ms: duration,
                    error_type: errorType
                }]);
        }
        catch (e) {
            MazaLogger.error(`[Observability] Failed to record metric for ${workerName}`, e);
        }
    }
    static processFailureHeatmap(data) {
        // 24시간을 1시간 단위로 그룹화
        const heatmap = new Array(24).fill(0).map((_, i) => ({ hour: i, count: 0 }));
        data.forEach(d => {
            const hour = new Date(d.created_at).getHours();
            heatmap[hour].count++;
        });
        return heatmap;
    }
}
