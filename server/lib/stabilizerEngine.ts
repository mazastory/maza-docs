/**
 * =============================================
 * MAZA Studio - Operational Stabilizer Engine
 * AGENTS.md: Phase 8 - SaaS Stability (S-01)
 * =============================================
 */

import { supabaseAdmin } from "./supabaseServer.js";
import { MazaLogger } from "./logger.js";

export class StabilizerEngine {
  /**
   * 8-1. Multi-site Isolation
   * 특정 사이트의 연속 실패 시 격리(Quarantine) 처리
   */
  static async reportFailure(siteId: string, error: string) {
    try {
      if (!supabaseAdmin) return;

      const { data: health } = await supabaseAdmin
        .from('ms_site_health')
        .select('*')
        .eq('site_id', siteId)
        .maybeSingle();

      const failures = (health?.consecutive_failures || 0) + 1;
      let status = 'healthy';

      if (failures >= 5) {
        status = 'quarantined';
        MazaLogger.error(`SITE QUARANTINED: ${siteId} reached 5 consecutive failures.`, new Error(error), { siteId });
      } else if (failures >= 3) {
        status = 'warning';
      }

      await supabaseAdmin.from('ms_site_health').upsert([{
        site_id: siteId,
        status,
        consecutive_failures: failures,
        last_error: error,
        quarantined_at: status === 'quarantined' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }]);

      return status;
    } catch (e: any) {
      MazaLogger.error("Stabilizer failed to report failure", e);
    }
  }

  static async isSiteActive(siteId: string): Promise<boolean> {
    const { data: health } = await supabaseAdmin!
      .from('ms_site_health')
      .select('status')
      .eq('site_id', siteId)
      .maybeSingle();

    return health?.status !== 'quarantined';
  }

  /**
   * 8-2. Rate Limit Protection
   * 리소스별 사용량 체크 및 차단
   */
  static async checkUsage(userId: string, resource: 'ai_api' | 'image_api' | 'tistory_publish'): Promise<boolean> {
    try {
      const { data: usage } = await supabaseAdmin!
        .from('ms_usage_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('resource_type', resource)
        .maybeSingle();

      if (!usage) return true; // 기본값 허용

      if (usage.usage_count >= usage.daily_limit) {
        MazaLogger.warn(`RATE LIMIT: User ${userId} exceeded ${resource} limit.`, { userId, resource, usage: usage.usage_count });
        return false;
      }

      // 사용량 증가
      await supabaseAdmin!.from('ms_usage_tracking').update({
        usage_count: usage.usage_count + 1,
        updated_at: new Date().toISOString()
      }).eq('id', usage.id);

      return true;
    } catch (e) {
      return true; // DB 오류 시 서비스 중단 방지를 위해 허용
    }
  }

  /**
   * 8-3. Config Snapshot
   * 설정 변경 시 스냅샷 저장
   */
  static async takeSnapshot(userId: string, type: string, data: any) {
    await supabaseAdmin!.from('ms_config_snapshots').insert([{
      user_id: userId,
      config_type: type,
      config_data: data
    }]);
  }
}
