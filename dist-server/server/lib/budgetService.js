/**
 * =============================================
 * MAZA Studio - Budget & Daily Limit Guard
 * =============================================
 * - 유저당 일일 AI 생성 횟수 제한 (100회)
 * - 80% 초과 시 Lite 모델 자동 다운그레이드 권고
 * - 100% 초과 시 요청 차단 (isBlocked: true)
 * AGENTS.md: Anti-Billing-Bomb Protocol
 */
import { supabaseAdmin } from './supabaseServer.js';
const DAILY_LIMIT = 100;
const DOWNGRADE_THRESHOLD = 0.8; // 80%
export const BudgetService = {
    getBudgetStatus: async (userId) => {
        // userId 없이 호출되는 경우 (기존 호환성) → 허용
        if (!userId || !supabaseAdmin) {
            return { isBlocked: false, shouldDowngrade: false, cost: 0, todayCount: 0 };
        }
        try {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const { count } = await supabaseAdmin
                .from('ms_events')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('event_type', 'generate')
                .gte('created_at', startOfDay.toISOString());
            const todayCount = count ?? 0;
            const ratio = todayCount / DAILY_LIMIT;
            return {
                isBlocked: ratio >= 1.0,
                shouldDowngrade: ratio >= DOWNGRADE_THRESHOLD,
                cost: todayCount, // 실제 사용 횟수 (비용 대용)
                todayCount,
                remaining: Math.max(0, DAILY_LIMIT - todayCount),
                limitPercent: Math.round(ratio * 100)
            };
        }
        catch (e) {
            // DB 에러 시 안전 기본값 (fail-open)
            console.warn('[BudgetService] Failed to check usage, failing open:', e);
            return { isBlocked: false, shouldDowngrade: false, cost: 0, todayCount: 0 };
        }
    }
};
