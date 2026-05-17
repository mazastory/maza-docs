"use strict";
(() => {
  // extension/content/sync_token.ts
  console.log("[MAZA OS] Sync Token Script Active.");
  console.log("[MAZA OS] Extension presence initialized.");
  window.__MAZA_EXTENSION_INSTALLED__ = true;
  function isContextValid() {
    return typeof chrome !== "undefined" && !!chrome.runtime && !!chrome.runtime.id;
  }
  var TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://mazastudio.kr"
  ];
  window.addEventListener("message", (event) => {
    if (!isContextValid()) return;
    if (event.data && (event.data.type === "MAZA_PING" || event.data.type === "MAZA_PING_REQUEST")) {
      window.postMessage({ type: "MAZA_PONG_EXTENSION", version: "1.0.0", source: "MAZA_EXTENSION" }, "*");
    }
    if (event.data && (event.data.type === "MAZA_PUBLISH_POST" || event.data.type === "MAZA_INFRA_INJECT" || event.data.type === "MAZA_SYNC_SITE" || event.data.type === "MAZA_AUTOPILOT_SYNC")) {
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
        } catch (e) {
        }
        return;
      }
      if (event.data.type === "MAZA_AUTOPILOT_SYNC") {
        try {
          chrome.runtime.sendMessage(event.data);
        } catch (e) {
        }
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
        console.warn("[MAZA OS] Extension context invalidated. Please refresh the page.");
      }
    }
  });
  function broadcastPresence() {
    if (!isContextValid()) return;
    window.postMessage({ type: "MAZA_PONG_EXTENSION", version: "1.0.0", source: "MAZA_EXTENSION" }, "*");
  }
  var presenceInterval = setInterval(() => {
    if (!isContextValid()) {
      clearInterval(presenceInterval);
      return;
    }
    broadcastPresence();
  }, 5e3);
  if (isContextValid()) {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === "MAZA_INFRA_PROGRESS" || msg.type === "MAZA_INFRA_INJECTED") {
        window.postMessage(msg, "*");
      }
    });
  }
  function extractSupabaseSession() {
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
        } catch (e) {
        }
      }
    }
    return { token: null, email: null };
  }
  var lastToken = null;
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
          chrome.runtime.sendMessage({ type: "TOKEN_UPDATED" }).catch(() => {
          });
        });
      } catch (e) {
      }
    } else if (!token && lastToken) {
      lastToken = null;
      try {
        chrome.storage.local.remove(["mazaToken", "mazaUserEmail"], () => {
          console.log("[MAZA OS] Auth data removed from Extension storage.");
        });
      } catch (e) {
      }
    }
  }
  var syncInterval = setInterval(() => {
    if (!isContextValid()) {
      clearInterval(syncInterval);
      return;
    }
    checkAndSyncToken();
  }, 2e3);
  checkAndSyncToken();
})();
//# sourceMappingURL=sync_token.js.map
