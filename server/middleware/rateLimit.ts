/**
 * =============================================
 * MAZA Studio - Rate Limit Middleware
 * AGENTS.md v6.0 Section 6: 비용 제한 (Cost Guard)
 *
 * Free : 하루 3개 생성 / 20회 AI 호출
 * PRO  : 하루 10개 생성 / 100회 AI 호출
 * Admin: 무제한
 * =============================================
 */

import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabaseServer.js';

const LIMITS = {
  free:  { posts: 3,         calls: 20  },
  pro:   { posts: 10,        calls: 100 },
  admin: { posts: Infinity,  calls: Infinity }
};

async function getUserPlan(userId: string): Promise<'free' | 'pro' | 'admin'> {
  try {
    if (!supabaseAdmin) return 'free';
    const { data } = await supabaseAdmin
      .from('profiles')
      .select('plan')
      .eq('id', userId)
      .maybeSingle();
    
    if (data?.plan === 'pro') return 'pro';
    return 'free';
  } catch {
    return 'free';
  }
}

export async function checkDailyLimit(req: Request, res: Response, next: NextFunction) {
  const user_id = req.userId || req.body?.user_id || req.query?.user_id as string;

  if (!user_id) {
    return res.status(400).json({ success: false, error: 'user_id가 필요합니다.' });
  }

  try {
    if (!supabaseAdmin) return next(); // 개발 환경 호환성

    const plan = await getUserPlan(user_id);
    const limit = LIMITS[plan];

    // Admin은 무제한
    if (plan === 'admin') return next();

    // 오늘 자정 기준
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count, error } = await supabaseAdmin
      .from('ms_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('event_type', 'generate')
      .eq('status', 'success')
      .gte('created_at', todayStart.toISOString());

    if (error) {
      console.warn('[RateLimit] Count query failed, failing open:', error.message);
      return next();
    }

    const todayCount = count || 0;

    if (todayCount >= limit.posts) {
      const isPro = plan === 'pro';
      return res.status(429).json({
        success: false,
        error: isPro
          ? `오늘의 글 생성 한도에 도달했습니다 (${todayCount}/${limit.posts}). 내일 다시 이용해 주세요.`
          : `오늘의 무료 생성 한도에 도달했습니다 (${todayCount}/${limit.posts}). PRO로 업그레이드하면 하루 ${LIMITS.pro.posts}개까지 생성할 수 있습니다.`,
        code: 'DAILY_LIMIT_EXCEEDED',
        used: todayCount,
        limit: limit.posts,
        plan,
        upgrade_available: !isPro
      });
    }

    // 사용량 헤더 (프론트엔드 UI 표시용)
    res.setHeader('X-RateLimit-Plan', plan);
    res.setHeader('X-RateLimit-Limit', limit.posts);
    res.setHeader('X-RateLimit-Remaining', limit.posts - todayCount);

    console.log(`[RateLimit] ${plan} user ${user_id}: ${todayCount}/${limit.posts} today`);
    next();

  } catch (err: any) {
    console.warn('[RateLimit] Unexpected error, failing open:', err.message);
    next();
  }
}
