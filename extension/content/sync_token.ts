/**
 * MAZA OS — content/sync_token.ts
 * 
 * 역할을 최소화한 토큰 동기화 스크립트.
 * 로컬호스트(localhost:5174) 및 프로덕션(mazastudio.kr)의 웹앱에 주입되어
 * Supabase 로그인 토큰을 추출하고 Extension의 chrome.storage.local에 저장합니다.
 */

console.log("[MAZA OS] Sync Token Script Active.");
console.log("[MAZA OS] Extension presence initialized.");
(window as any).__MAZA_EXTENSION_INSTALLED__ = true;

function isContextValid() {
  return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
}

// [ST1] 보안 강화: 신뢰할 수 있는 Origin 리스트 정의 (개발 포트 확장)
const TRUSTED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://mazastudio.kr'
];

window.addEventListener("message", (event) => {
  if (!isContextValid()) return;

  if (event.data && (event.data.type === "MAZA_PING" || event.data.type === "MAZA_PING_REQUEST")) {
    window.postMessage({ type: "MAZA_PONG_EXTENSION", version: "1.0.0", source: "MAZA_EXTENSION" }, "*");
  }
  
  if (event.data && (event.data.type === "MAZA_PUBLISH_POST" || event.data.type === "MAZA_INFRA_INJECT" || event.data.type === "MAZA_SYNC_SITE" || event.data.type === "MAZA_AUTOPILOT_SYNC")) {
    // [ST1] Origin 검증 누락 수정 - 신뢰할 수 없는 사이트에서의 메시지 차단
    if (!TRUSTED_ORIGINS.includes(event.origin)) {
      console.warn(`[MAZA OS] Blocked message from untrusted origin: ${event.origin}`);
      return;
    }

    if (event.data.type === "MAZA_SYNC_SITE") {
       console.log("[MAZA OS] Syncing site list from WebApp.");
       try {
         chrome.storage.local.set({ 
            mazaSites: event.data.allSites || [] 
         });
       } catch (e) {}
       return;
    }

    if (event.data.type === "MAZA_AUTOPILOT_SYNC") {
       try {
         chrome.runtime.sendMessage(event.data);
       } catch (e) {}
       return;
    }

    console.log(`%c[MAZA OS] Relaying immediate action: ${event.data.type}`, "color: #10b981; font-weight: bold;");
    try {
      chrome.runtime.sendMessage({
        type: "IMMEDIATE_ACTION",
        actionType: event.data.type,
        payload: event.data.payload
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("[MAZA OS] Relay failed:", chrome.runtime.lastError.message);
        } else {
          console.log("[MAZA OS] Relay success acknowledged by background.");
        }
      });
    } catch (e) {
      console.warn('[MAZA OS] Extension context invalidated. Please refresh the page.');
    }
  }
});

function broadcastPresence() {
  if (!isContextValid()) return;
  window.postMessage({ type: "MAZA_PONG_EXTENSION", version: "1.0.0", source: "MAZA_EXTENSION" }, "*");
}

const presenceInterval = setInterval(() => {
  if (!isContextValid()) {
    clearInterval(presenceInterval);
    return;
  }
  broadcastPresence();
}, 5000);

if (isContextValid()) {
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "MAZA_INFRA_PROGRESS" || msg.type === "MAZA_INFRA_INJECTED") {
      window.postMessage(msg, "*");
    }
  });
}

function extractSupabaseSession(): { token: string | null, email: string | null } {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const parsed = JSON.parse(value);
          return {
            token: parsed.access_token || null,
            email: parsed.user?.email || null
          };
        }
      } catch (e) {}
    }
  }
  return { token: null, email: null };
}

let lastToken: string | null = null;
function checkAndSyncToken() {
  if (!isContextValid()) return;

  const { token, email } = extractSupabaseSession();
  if (token && token !== lastToken) {
    lastToken = token;
    try {
      chrome.storage.local.set({
        mazaToken: token,
        mazaUserEmail: email,
        mazaOrigin: window.location.origin
      }, () => {
        console.log("[MAZA OS] Token, Email and Origin successfully synced to Extension storage.");
        chrome.runtime.sendMessage({ type: "TOKEN_UPDATED" }).catch(() => {});
      });
    } catch (e) {}
  } else if (!token && lastToken) {
    lastToken = null;
    try {
      chrome.storage.local.remove(["mazaToken", "mazaUserEmail"], () => {
        console.log("[MAZA OS] Auth data removed from Extension storage.");
      });
    } catch (e) {}
  }
}

const syncInterval = setInterval(() => {
  if (!isContextValid()) {
    clearInterval(syncInterval);
    return;
  }
  checkAndSyncToken();
}, 2000);

checkAndSyncToken();
