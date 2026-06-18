import { createClient } from "@supabase/supabase-js";

// Vite uses import.meta.env, and we check window.__RUNTIME_CONFIG__ for production/Cloud Run
const getEnv = (key: string) => {
  if (typeof window !== 'undefined' && (window as any).__RUNTIME_CONFIG__) {
    return (window as any).__RUNTIME_CONFIG__[key];
  }
  // @ts-ignore
  return (typeof (import.meta as any) !== 'undefined' && (import.meta as any).env?.[key]);
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder")) {
  console.error("❌ [SUPABASE ERROR] Supabase URL 또는 Anon Key가 설정되지 않았습니다. AI 스튜디오의 [Settings] 메뉴에서 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해주세요.");
}

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== "https://placeholder.supabase.co");

const globalSupabase = globalThis as any;

export const supabase = globalSupabase.supabase || createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: isConfigured,
      autoRefreshToken: false, // [FIX] 스튜디오(본진)와 Refresh Token 갱신 충돌 방지를 위해 Docs는 자동 갱신 비활성화
    }
  }
);

if (!globalSupabase.supabase) {
  globalSupabase.supabase = supabase;
}
