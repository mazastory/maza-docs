/**
 * =============================================
 * MAZA Studio - Maintenance Service
 * AGENTS.md: Infrastructure Resilience (R-01)
 * =============================================
 */

import { supabaseAdmin } from './supabaseServer.js';
import { MazaLogger } from './logger.js';

export class MaintenanceService {
  private static timer: NodeJS.Timeout | null = null;

  static start() {
    if (this.timer) return;
    MazaLogger.info('[Maintenance] 🛠️ Maintenance Service started');
    
    // 10분마다 실행
    this.timer = setInterval(() => this.cleanup(), 10 * 60 * 1000);
    this.cleanup();
  }

  private static async cleanup() {
    try {
      if (!supabaseAdmin) return;

      // 1. 자동 재시도 (Retry Durability)
      // 상태가 'retry'이고 업데이트된 지 30분 이상 지난 작업들을 다시 'queued'로 전환
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      
      const { data: retriable, error: retryError } = await supabaseAdmin
        .from('ms_scheduled_posts')
        .update({ status: 'queued', last_error: 'Auto-retried by MaintenanceService' })
        .eq('status', 'retry')
        .lt('updated_at', thirtyMinsAgo)
        .select('id');

      if (retriable && retriable.length > 0) {
        MazaLogger.info(`[Maintenance] Auto-retried ${retriable.length} jobs.`, { jobIds: retriable.map((j: { id: string }) => j.id) });
      }

      // 2. 오래된 로그 정리 (M-04 클린업)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      await supabaseAdmin
        .from('ms_events')
        .delete()
        .lt('created_at', thirtyDaysAgo);

    } catch(e: unknown) {
      MazaLogger.error('[Maintenance] Cleanup failed', e);
    }
  }
}
