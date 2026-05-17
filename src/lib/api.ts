import { supabase } from "./supabase";

export async function fetchApi(url: string, options: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const impersonateId = typeof window !== 'undefined' ? localStorage.getItem("impersonate_user_id") : null;
  if (impersonateId) {
    headers.set("x-impersonate-user", impersonateId);
  }
  
  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (!res.ok) {
      if (res.status === 401) {
         console.warn("[API] 401 Unauthorized detected. Signing out.");
         if (typeof window !== 'undefined') {
           supabase.auth.signOut().then(() => {
             window.location.href = '/login?expired=1';
           });
         }
         throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
      }

      const text = await res.text();
      let errorData;
      try {
        errorData = JSON.parse(text);
        if (errorData.error && typeof errorData.error === 'string' && (errorData.error.includes('<html') || errorData.error.includes('<!doctype html>'))) {
          let friendlyMsg = "서버 오류가 발생했습니다. (외부 요청 차단됨)";
          if (errorData.error.includes("1015") || errorData.error.includes("rate limit")) {
             friendlyMsg = "외부 서비스 요청 한도를 초과했습니다 (Cloudflare 1015). 잠시 후 다시 시도해주세요.";
          } else if (errorData.error.includes("Access denied")) {
             friendlyMsg = "외부 서비스 접근이 차단되었습니다 (Cloudflare 보안).";
          }
          errorData.error = friendlyMsg;
        }
      } catch (e) {
        if (text.includes("Cloudflare") || text.includes("<html")) {
          let friendlyMsg = "서버 또는 네트워크 오류가 발생했습니다. (HTML 응답)";
          if (text.includes("1015") || text.includes("rate limit")) {
             friendlyMsg = "요청 한도를 초과했습니다 (Cloudflare 방화벽). 잠시 후 다시 시도해주세요.";
          } else if (text.includes("Access denied")) {
             friendlyMsg = "접근이 차단되었습니다 (Cloudflare 보안).";
          }
          errorData = { error: friendlyMsg };
        } else {
          errorData = { error: text || res.statusText };
        }
      }
      throw new Error(errorData.error || `Request failed with status ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error(`[API Error] Expected JSON but got ${contentType}:`, text.substring(0, 500));
      throw new Error(`Expected JSON response but received ${contentType || 'plain text'}. Please check if the server is running correctly.`);
    }

    return res;
  } catch (error: any) {
    if (error.name !== "AbortError") {
      console.error(`[API Error] ${url}:`, error.message);
    }
    throw error;
  }
}
