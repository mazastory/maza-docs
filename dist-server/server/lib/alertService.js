/**
 * =============================================
 * MAZA Studio - Alert Service
 * AGENTS.md: Observability (O-01) - Critical alerting
 * =============================================
 */
import { supabaseAdmin } from "./supabaseServer.js";
import { MazaLogger } from "./logger.js";
import { generateQueue, imageQueue, validateQueue, publishQueue } from './queues.js';
export class AlertService {
    /**
     * 알림 감지 루프 시작 (5분 간격)
     */
    static start() {
        console.log("[AlertService] 🚨 Monitoring for critical issues...");
        setInterval(() => this.check(), 5 * 60 * 1000);
        this.check();
    }
    static async check() {
        try {
            if (!supabaseAdmin)
                return;
            // 1. 연속 실패 체크 (최근 10건 중 실패율 50% 이상)
            const { data: recentTasks } = await supabaseAdmin
                .from('ms_scheduled_posts')
                .select('status')
                .order('created_at', { ascending: false })
                .limit(10);
            const failedCount = recentTasks?.filter((t) => t.status === 'dead' || t.status === 'failed').length || 0;
            if (failedCount >= 5) {
                MazaLogger.error("CRITICAL: High failure rate detected in last 10 tasks!", new Error(`${failedCount}/10 failed`), { failedCount });
                // TODO: Slack/Discord webhook 연동 가능
            }
            // 2. 큐 정체 체크 (Wait 상태 50개 이상)
            const queues = [generateQueue, imageQueue, validateQueue, publishQueue];
            for (const queue of queues) {
                const counts = await queue.getJobCounts('wait');
                if (counts.wait > 50) {
                    MazaLogger.warn(`ALERT: Queue backlog detected in ${queue.name}!`, { queue: queue.name, waitCount: counts.wait });
                }
            }
            // 3. 24시간 내 발행 성공 전무 (활성 유저 대비)
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const { count: successCount } = await supabaseAdmin
                .from('ms_scheduled_posts')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'success')
                .gte('created_at', yesterday);
            if (successCount === 0) {
                // MazaLogger.warn("ALERT: No successful posts in the last 24 hours.");
            }
        }
        catch (e) {
            MazaLogger.error("AlertService check failed", e);
        }
    }
}
