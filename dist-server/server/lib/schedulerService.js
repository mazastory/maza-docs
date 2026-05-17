/**
 * =============================================
 * MAZA Studio - Scheduler Service v4
 * DB 기반 Durable Scheduling & State Machine Orchestrator
 * =============================================
 */
import { supabaseAdmin } from './supabaseServer.js';
import { generateQueue } from './queues.js';
import { MazaLogger } from './logger.js';
import { redisConnection } from './redis.js';
import { PostStatus } from './postStatus.js';
import { FeedbackEngine } from './feedbackEngine.js';
const SCHEDULER_LOCK_KEY = 'maza:scheduler:lock';
const SCHEDULER_LOCK_TTL = 30000; // 30초
export class SchedulerService {
    static start() {
        if (this.timer)
            return;
        MazaLogger.info('[Scheduler] 🚀 Durable Scheduler started with Redis Lock');
        // 1분마다 실행 (실시간 작업)
        this.timer = setInterval(() => this.poll(), 60000);
        this.poll();
        // 24시간마다 실행 (일간 성과 동기화 - 매일 새벽 4시 권장이나 단순화하여 시작 시 1회 + 24시간 주기)
        setInterval(() => this.runDailyJobs(), 86400000);
        setTimeout(() => this.runDailyJobs(), 5000); // 시작 5초 후 1회 실행
    }
    static async poll() {
        // 1. Distributed Lock 획득 시도 (Redis SET NX)
        // PX: milliseconds, NX: only if not exists
        const lock = await redisConnection.set(SCHEDULER_LOCK_KEY, 'locked', 'PX', SCHEDULER_LOCK_TTL, 'NX');
        if (!lock)
            return; // 다른 인스턴스가 실행 중
        try {
            if (!supabaseAdmin)
                return;
            // 2. Pending/Queued 작업 폴링
            // 🔥 [Pre-writing Upgrade] Don't wait for publish_at for GENERATION.
            // We want to generate all content as drafts IMMEDIATELY so the user can see them
            // and the extension can schedule them on Tistory.
            const { data: tasks, error } = await supabaseAdmin
                .from('ms_scheduled_posts')
                .select('*')
                .eq('status', PostStatus.QUEUED)
                .order('publish_at', { ascending: true })
                .limit(10); // Burst limit to avoid API abuse
            if (error)
                throw error;
            if (!tasks || tasks.length === 0) {
                // 좀비 작업 체크 (Hanging Job Recovery)
                await this.recoverHangingJobs();
                return;
            }
            MazaLogger.info(`[Scheduler] 🔍 Found ${tasks.length} pending tasks to process.`);
            for (const task of tasks) {
                try {
                    MazaLogger.info(`[Scheduler] ⚙️ Processing task ${task.id} (Keyword: ${task.keyword})...`);
                    // 상태를 'GENERATING'으로 변경하여 중복 방지 (Atomic Update)
                    const { data: updated, error: updateError } = await supabaseAdmin
                        .from('ms_scheduled_posts')
                        .update({ status: PostStatus.GENERATING })
                        .eq('id', task.id)
                        .eq('status', PostStatus.QUEUED)
                        .select()
                        .single();
                    if (updateError) {
                        MazaLogger.error(`[Scheduler] ❌ Update error for task ${task.id}:`, updateError);
                        continue;
                    }
                    if (!updated) {
                        MazaLogger.warn(`[Scheduler] ⚠️ Task ${task.id} already picked up or status changed.`);
                        continue;
                    }
                    // 3. BullMQ 큐에 투입
                    await generateQueue.add('generate-post', {
                        userId: task.user_id,
                        siteId: task.site_id,
                        keyword: task.keyword,
                        scheduledId: task.id
                    }, {
                        jobId: `scheduled_${task.id}`, // BullMQ 멱등성 보장
                        attempts: 3,
                        backoff: { type: 'exponential', delay: 10000 }
                    });
                    MazaLogger.info(`[Scheduler] ✅ Task ${task.id} successfully pushed to AI Writer queue.`);
                }
                catch (taskErr) {
                    MazaLogger.error(`[Scheduler] ❌ Failed to push task ${task.id} to queue`, taskErr);
                }
            }
        }
        catch (e) {
            MazaLogger.error('[Scheduler] Poll failed', e);
        }
        finally {
            // 락 해제 (TTL이 있지만 명시적으로 해제하면 더 빠름)
            await redisConnection.del(SCHEDULER_LOCK_KEY);
        }
    }
    /**
     * 1시간 이상 멈춰있는 작업(Hanging Jobs) 복구
     */
    static async recoverHangingJobs() {
        if (!supabaseAdmin)
            return;
        const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
        const { data: hanging } = await supabaseAdmin
            .from('ms_scheduled_posts')
            .select('id, status')
            .in('status', [PostStatus.GENERATING, PostStatus.VALIDATING, PostStatus.PUBLISHING, PostStatus.VERIFYING])
            .lt('updated_at', oneHourAgo);
        if (hanging && hanging.length > 0) {
            MazaLogger.warn(`[Scheduler] Recovering ${hanging.length} hanging jobs...`);
            for (const job of hanging) {
                await supabaseAdmin
                    .from('ms_scheduled_posts')
                    .update({
                    status: PostStatus.FAILED,
                    last_error: 'Hanging job detected and recovered'
                })
                    .eq('id', job.id);
            }
        }
    }
    /**
     * 일간 자동화 작업: GSC 데이터 동기화 및 Winning Pattern 학습
     */
    static async runDailyJobs() {
        try {
            if (!supabaseAdmin)
                return;
            MazaLogger.info('[Scheduler] 📊 Running daily performance sync jobs...');
            // 1. 모든 활성 사이트 조회
            const { data: sites } = await supabaseAdmin
                .from('ms_sites')
                .select('id, domain');
            if (!sites || sites.length === 0)
                return;
            for (const site of sites) {
                try {
                    MazaLogger.info(`[Scheduler] Syncing performance for ${site.domain}...`);
                    await FeedbackEngine.syncPerformance(site.id);
                }
                catch (err) {
                    MazaLogger.error(`[Scheduler] Daily sync failed for ${site.domain}`, err);
                }
            }
            MazaLogger.info('[Scheduler] ✅ Daily performance sync completed.');
        }
        catch (e) {
            MazaLogger.error('[Scheduler] Daily jobs failed', e);
        }
    }
}
SchedulerService.timer = null;
