/**
 * =============================================
 * MAZA Studio - Auth Middleware
 * ENGINE_RULES: API 인증 없는 엔드포인트 금지
 * =============================================
 * Supabase JWT를 검증하여 req.userId에 주입한다.
 * 검증 실패 시 401 반환 - 절대 통과시키지 않는다.
 */

import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

// 토큰 검증용 클라이언트 (anon key 사용 - 토큰 검증 전용)
const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    // Disable realtime — auth middleware only needs JWT verification, no subscriptions.
    // This prevents the Node.js 20 WebSocket crash at startup.
    transport: class FakeWS { constructor() {} } as any,
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Request에 userId 타입 확장
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * requireAuth: Bearer JWT 토큰을 검증하고 req.userId를 설정한다.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: '인증 헤더(Authorization: Bearer <token>)가 누락되었습니다.',
        code: 'UNAUTHORIZED'
      });
    }

    const token = authHeader.substring(7); // "Bearer " 제거

    // Supabase JWT 검증
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      if (!error?.message?.includes('expired')) {
        console.warn("[AuthMiddleware] Invalid Token:", error?.message);
      }
      return res.status(401).json({ 
        success: false, 
        error: '유효하지 않거나 만료된 인증 토큰입니다. 다시 로그인해 주세요.',
        code: 'INVALID_TOKEN'
      });
    }

    // req.userId에 확실히 주입
    req.userId = user.id;
    next();

  } catch(err: unknown) {
    // 에러 메시지 sanitize - 스택 노출 금지
    return res.status(500).json({ 
      success: false, 
      error: '인증 처리 중 오류가 발생했습니다.',
      code: 'AUTH_ERROR'
    });
  }
}

/**
 * optionalAuth: 인증이 있으면 req.userId를 설정하고, 없어도 통과 (공개 API용)
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const { data: { user } } = await supabaseAuth.auth.getUser(token);
    if (user) req.userId = user.id;
  }
  next();
}
