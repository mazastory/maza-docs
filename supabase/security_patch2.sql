-- =============================================
-- MazaStudio - Security Fixes PATCH 2
-- 2026-05-12 | Warnings 잔재 해결
-- Supabase SQL Editor에서 실행하세요.
-- =============================================

-- =============================================
-- [FIX] Signed-In Users Can Execute SECURITY DEFINER
-- is_admin(), is_admin_safe() 에서 authenticated 롤도 REVOKE
--
-- 이유: RLS 정책 내에서 호출되는 SECURITY DEFINER 함수는
-- PostgreSQL 내부에서 평가되므로 authenticated 직접 호출 권한이
-- 없어도 정상 동작합니다. 직접 호출 허용 시 권한 상승 위험이 있으므로 제거.
-- =============================================

REVOKE EXECUTE ON FUNCTION public.is_admin()      FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin()      FROM authenticated;
GRANT  EXECUTE ON FUNCTION public.is_admin()      TO service_role;

REVOKE EXECUTE ON FUNCTION public.is_admin_safe() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin_safe() FROM authenticated;
GRANT  EXECUTE ON FUNCTION public.is_admin_safe() TO service_role;

-- =============================================
-- ✅ 위 SQL 실행 후:
--    Security Advisor > Refresh → 2건 해결 확인
--
-- ⚠️ [수동 처리] Leaked Password Protection:
--    Supabase Dashboard
--    → Authentication → Security
--    → "Enable Leaked Password Protection" 토글 ON
--    (이건 SQL로 변경 불가 — 대시보드에서만 설정 가능)
-- =============================================
