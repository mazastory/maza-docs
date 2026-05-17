// extension/shared/config.ts
var CONFIG = {
  API_BASE_URL: "https://mazastudio.kr/api",
  STUDIO_URL: "https://mazastudio.kr",
  POLLING_INTERVAL_MS: 5e3
};

// extension/utils/logger.ts
function log(scope, message, data) {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().split("T")[1].split("Z")[0];
  const formattedMsg = `[${timestamp}] [${scope}] ${message}`;
  console.log(formattedMsg, data || "");
  try {
    chrome.runtime.sendMessage({
      type: "TASK_LOG",
      scope,
      message: formattedMsg,
      data
    }).catch(() => {
    });
  } catch (e) {
  }
}
function error(scope, message, data) {
  console.error(`[${scope}] \u274C ${message}`, data || "");
}

// extension/utils/retry.ts
async function withRetry(fn, count = 3, delayMs = 2e3) {
  let lastError;
  for (let i = 0; i < count; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      log("RETRY", `Attempt ${i + 1}/${count} failed. Retrying in ${delayMs}ms...`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastError;
}

// extension/utils/screenshot.ts
async function captureErrorState() {
  try {
    return await chrome.tabs.captureVisibleTab({ format: "png" });
  } catch (e) {
    return null;
  }
}

// extension/background/background.ts
log("SYSTEM", "MAZA OS Phoenix Engine Started.");
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error2) => console.error(error2));
chrome.action.onClicked.addListener((tab) => {
  if (tab.windowId) {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});
async function pollingLoop() {
  try {
    const storage = await chrome.storage.local.get(["mazaToken", "mazaOrigin"]);
    if (!storage.mazaToken) return;
    const apiBase = storage.mazaOrigin ? `${storage.mazaOrigin}/api` : CONFIG.API_BASE_URL;
    const res = await fetch(`${apiBase}/tasks/next`, {
      headers: { "Authorization": `Bearer ${storage.mazaToken}` }
    });
    if (res.status === 200) {
      const result = await res.json();
      if (result.success && result.command === "EXECUTE") {
        const task = result.data;
        log("POLLING", `Task Found: ${task.type}`, task.id);
        await withRetry(() => executeTask(task), 3);
      }
    }
  } catch (err) {
    if (err.message?.includes("Failed to fetch") || err.message?.includes("Load failed")) {
      return;
    }
    error("POLLING", `Polling loop error: ${err.message}`);
  }
}
async function executeTask(task) {
  try {
    let tab = await findTabByDomain(task.domain);
    if (!tab) {
      tab = await chrome.tabs.create({ url: task.url });
      await waitForTabComplete(tab.id);
      await new Promise((r) => setTimeout(r, 5e3));
    } else {
      const targetPath = new URL(task.url).pathname;
      if (!tab.url?.includes(targetPath)) {
        await chrome.tabs.update(tab.id, { url: task.url });
        await waitForTabComplete(tab.id);
        await new Promise((r) => setTimeout(r, 3500));
      }
    }
    chrome.runtime.sendMessage({ type: "TASK_STARTED", taskType: task.type }).catch(() => {
    });
    let result;
    try {
      result = await chrome.tabs.sendMessage(tab.id, { type: "RUN_TASK", task });
    } catch (msgErr) {
      log("EXEC", "Content script not ready, retrying in 2s...", tab.id);
      await new Promise((r) => setTimeout(r, 2e3));
      try {
        result = await chrome.tabs.sendMessage(tab.id, { type: "RUN_TASK", task });
      } catch (retryErr) {
        result = { ok: false, error: `Content script \uC5F0\uACB0 \uC2E4\uD328: ${retryErr.message}` };
      }
    }
    if (task.type === "INFRA_INJECT") {
      relayToWebApp({
        type: "MAZA_INFRA_PROGRESS",
        step: result?.ok ? result.step || "SUCCESS" : "ERROR",
        detail: result?.error || ""
      });
      if (result?.ok) {
        await focusWebAppTab();
      }
    }
    await reportResult(task.id, result);
    log("EXEC", "Task Completed Successfully", task.id);
  } catch (err) {
    const screenshot = await captureErrorState();
    if (task.type === "INFRA_INJECT") {
      relayToWebApp({ type: "MAZA_INFRA_PROGRESS", step: "ERROR", detail: err.message });
    }
    await reportResult(task.id, { ok: false, error: err.message, screenshot });
    throw err;
  }
}
async function findTabByDomain(domain) {
  const tabs = await chrome.tabs.query({});
  return tabs.find((t) => t.url?.includes(domain)) || null;
}
async function waitForTabComplete(tabId) {
  const tab = await chrome.tabs.get(tabId).catch(() => null);
  if (tab?.status === "complete") return;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    }, 3e4);
    const listener = (id, info) => {
      if (id === tabId && info.status === "complete") {
        clearTimeout(timer);
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
  });
}
async function reportResult(taskId, result) {
  const storage = await chrome.storage.local.get(["mazaToken", "mazaOrigin"]);
  const apiBase = storage.mazaOrigin ? `${storage.mazaOrigin}/api` : CONFIG.API_BASE_URL;
  let postId = result.post_id || null;
  if (!postId && result.published_url) {
    const match = result.published_url.match(/\/(\d+)\/?$/);
    if (match) postId = match[1];
  }
  await fetch(`${apiBase}/tasks/report`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${storage.mazaToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ taskId, postId, status: result.ok ? "success" : "failed", result })
  });
}
chrome.alarms.clear("maza-polling", () => {
  chrome.alarms.create("maza-polling", { periodInMinutes: 0.083 });
});
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "maza-polling") {
    pollingLoop();
  }
});
async function handleImmediateAction(msg, sendResponse) {
  const { actionType, payload } = msg;
  log("SYSTEM", `Immediate Action: ${actionType}, domain: "${payload.domain}", title: "${payload.title?.substring(0, 20)}"`);
  if (!payload.domain) {
    error("SYSTEM", "\u274C No domain in payload. Trying storage recovery...");
    const storage = await chrome.storage.local.get(["mazaSites"]);
    const sites = storage["mazaSites"] || [];
    if (sites.length > 0 && sites[0].domain) {
      payload.domain = sites[0].domain;
      log("SYSTEM", `[Recovery] Auto-recovered domain: ${payload.domain}`);
    } else {
      sendResponse({ ok: false, error: "\uC5F0\uACB0\uB41C \uBE14\uB85C\uADF8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uB0B4 \uC0AC\uC774\uD2B8 \uBA54\uB274\uC5D0\uC11C \uBE14\uB85C\uADF8\uB97C \uB4F1\uB85D\uD574 \uC8FC\uC138\uC694." });
      return;
    }
  }
  let html = payload.content || payload.html || payload.body;
  if (actionType === "MAZA_INFRA_INJECT" && !html) {
    let clean_sc = payload.sc_verification?.trim() || "";
    const scDoubleMatch = clean_sc.match(/content="([^"]+)"/);
    const scSingleMatch = clean_sc.match(/content='([^']+)'/);
    if (scDoubleMatch) clean_sc = scDoubleMatch[1];
    else if (scSingleMatch) clean_sc = scSingleMatch[1];
    if (clean_sc.startsWith("google-site-verification=")) {
      clean_sc = clean_sc.replace("google-site-verification=", "");
    }
    let clean_ga = payload.ga_measurement_id?.trim() || "";
    if (clean_ga.includes("id=")) {
      const match = clean_ga.match(/id=(G-[A-Z0-9]+)/);
      if (match) clean_ga = match[1];
    }
    if (clean_ga && !clean_ga.startsWith("G-")) clean_ga = "";
    const scHtml = clean_sc ? `<meta name="google-site-verification" content="${clean_sc}" />` : "";
    const gaHtml = clean_ga ? `<!-- Global site tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${clean_ga}"><\/script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${clean_ga}');<\/script>` : "";
    const htmlParts = [scHtml, gaHtml].filter(Boolean);
    html = `<!-- Maza Infra -->
${htmlParts.join("\n")}
<!-- End Maza Infra -->`;
  }
  const task = {
    id: payload.id || `immediate-${Date.now()}`,
    type: actionType === "MAZA_INFRA_INJECT" ? "INFRA_INJECT" : "PUBLISH_POST",
    platform: "tistory",
    url: actionType === "MAZA_INFRA_INJECT" ? `https://${payload.domain.split(".")[0]}.tistory.com/manage/design/skin/edit#/source/html` : `https://${payload.domain.split(".")[0]}.tistory.com/manage/post`,
    domain: payload.domain,
    payload: {
      title: payload.title,
      html,
      type: payload.type
    }
  };
  globalThis.lastImmediateTask = task;
  chrome.storage.local.set({ lastImmediateTask: task });
  log("SYSTEM", `Task created: ${task.type} \u2192 ${task.domain}`);
  executeTask(task).catch((err) => error("EXEC", `Immediate Task Failed: ${err.message}`));
  sendResponse({ ok: true });
}
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "MAZA_SYNC_TOKEN") {
    const { token, origin } = msg.payload;
    log("SYSTEM", `Token synced from ${origin}.`);
    chrome.storage.local.set({
      "mazaToken": token,
      "mazaOrigin": origin,
      "last_sync": (/* @__PURE__ */ new Date()).toISOString()
    }).then(() => pollingLoop());
    sendResponse({ ok: true });
    return false;
  }
  if (msg.type === "TOKEN_UPDATED") {
    log("SYSTEM", "Token updated. Triggering immediate poll...");
    pollingLoop();
    return false;
  }
  if (msg.type === "FORCE_POLLING") {
    log("SYSTEM", "Force Polling requested.");
    pollingLoop();
    return false;
  }
  if (msg.type === "MAZA_AUTOPILOT_SYNC") {
    chrome.runtime.sendMessage(msg).catch(() => {
    });
    return false;
  }
  if (msg.type === "IMMEDIATE_ACTION") {
    handleImmediateAction(msg, sendResponse).catch((err) => {
      error("SYSTEM", `handleImmediateAction failed: ${err.message}`);
      sendResponse({ ok: false, error: err.message });
    });
    return true;
  }
  if (msg.type === "CONTENT_SCRIPT_READY") {
    sendResponse({ received: true });
    let task = globalThis.lastImmediateTask;
    if (!task) {
      chrome.storage.local.get("lastImmediateTask").then((storage) => {
        task = storage.lastImmediateTask;
        if (task && sender.tab?.id) {
          deliverTask(task, sender.tab.id);
        } else {
          log("SYSTEM", `READY received but NO TASK for tab ${sender.tab?.id}.`);
        }
      });
    } else if (sender.tab?.id) {
      deliverTask(task, sender.tab.id);
    }
    return true;
  }
  if (msg.type === "MAZA_INFRA_PROGRESS") {
    relayToWebApp(msg);
    return false;
  }
  if (msg.type === "MANUAL_INJECT_REQUEST") {
    const task = globalThis.lastImmediateTask;
    if (task) {
      chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0]?.id) deliverTask(task, tabs[0].id, true);
      });
    }
    return false;
  }
  if (msg.type === "EXECUTE_MAIN_WORLD") {
    if (sender.tab?.id) {
      const func = msg.funcId === "autoAcceptDialog" ? () => {
        const _origConfirm = window.confirm;
        window.confirm = () => true;
        setTimeout(() => {
          window.confirm = _origConfirm;
        }, 3e3);
        return { ok: true };
      } : msg.funcId === "injectInfra" ? (html) => {
        try {
          const processVal = (val) => {
            if (!html || html === "null" || html === "undefined") return null;
            if (val.includes(html)) return null;
            let cleaned = val;
            const regexNew = /<!-- Maza Infra -->[\s\S]*?<!-- End Maza Infra -->\n?/g;
            cleaned = cleaned.replace(regexNew, "");
            return cleaned.includes("<head>") ? cleaned.replace("<head>", "<head>\n" + html) : html + "\n" + cleaned;
          };
          const cmEls = document.querySelectorAll(".CodeMirror");
          for (const el of Array.from(cmEls)) {
            if (el.CodeMirror) {
              const cm = el.CodeMirror;
              const newVal = processVal(cm.getValue());
              if (newVal === null) return { ok: true, step: "ALREADY_INJECTED" };
              cm.setValue(newVal);
              return { ok: true, step: "SUCCESS" };
            }
          }
          if (window.monaco?.editor) {
            const models = window.monaco.editor.getModels();
            if (models && models.length > 0) {
              const newVal = processVal(models[0].getValue());
              if (newVal === null) return { ok: true, step: "ALREADY_INJECTED" };
              models[0].setValue(newVal);
              return { ok: true, step: "SUCCESS" };
            }
          }
          const htmlTextarea = Array.from(document.querySelectorAll("textarea")).find(
            (t) => t.value.includes("<html") || t.value.includes("<!doctype")
          );
          if (htmlTextarea) {
            const newVal = processVal(htmlTextarea.value);
            if (newVal === null) return { ok: true, step: "ALREADY_INJECTED" };
            const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
            if (setter) setter.call(htmlTextarea, newVal);
            else htmlTextarea.value = newVal;
            htmlTextarea.dispatchEvent(new Event("input", { bubbles: true }));
            htmlTextarea.dispatchEvent(new Event("change", { bubbles: true }));
            return { ok: true, step: "SUCCESS" };
          }
          return { ok: false, error: "NO_EDITOR_FOUND" };
        } catch (err) {
          return { ok: false, error: err.message };
        }
      } : void 0;
      if (func) {
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id, allFrames: true },
          world: "MAIN",
          args: msg.args || [],
          func
        }).then((results) => {
          const validResult = results.find((r) => r.result)?.result;
          sendResponse(validResult || { ok: false, error: "No valid result from frames" });
        }).catch((err) => {
          sendResponse({ ok: false, error: err.message });
        });
        return true;
      }
    }
  }
  return false;
});
function deliverTask(task, tabId, proactive = false) {
  log("SYSTEM", `${proactive ? "[Proactive]" : "[Reactive]"} Delivering task ${task.id} to tab ${tabId}...`);
  chrome.runtime.sendMessage({ type: "TASK_PENDING", task }).catch(() => {
  });
  chrome.tabs.sendMessage(tabId, { type: "RUN_TASK", task }).then((response) => {
    if (!response) {
      log("SYSTEM", `No response from tab ${tabId}. Keeping task in memory.`);
      return;
    }
    const isFinished = response.status === "PUBLISHED" || response.status === "INJECTED" || response.status === "INJECTED_ONLY" || response.ok === false;
    if (isFinished) {
      log("SYSTEM", `Task ${task.id} finished: ${response.status || "ERROR"}. Clearing.`);
      reportResult(task.id, response).catch(() => {
      });
      globalThis.lastImmediateTask = null;
      chrome.storage.local.remove("lastImmediateTask");
      chrome.runtime.sendMessage({ type: "TASK_CLEARED" }).catch(() => {
      });
    } else if (response.status === "NAVIGATING_TO_EDITOR") {
      log("SYSTEM", `Tab ${tabId} navigating to editor. Preserving task.`);
    }
  }).catch((err) => {
    log("SYSTEM", `Delivery to tab ${tabId} failed: ${err.message}. Task kept in memory.`);
  });
}
async function relayToWebApp(message) {
  const tabs = await chrome.tabs.query({});
  const webAppTabs = tabs.filter(
    (t) => t.url?.includes("localhost") || t.url?.includes("mazastudio.kr")
  );
  for (const tab of webAppTabs) {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, message).catch(() => {
      });
    }
  }
}
async function focusWebAppTab() {
  const tabs = await chrome.tabs.query({});
  const webAppTab = tabs.find(
    (t) => t.url?.includes("localhost") || t.url?.includes("mazastudio.kr")
  );
  if (webAppTab && webAppTab.id) {
    chrome.tabs.update(webAppTab.id, { active: true }).catch(() => {
    });
    if (webAppTab.windowId) {
      chrome.windows.update(webAppTab.windowId, { focused: true }).catch(() => {
      });
    }
  }
}
//# sourceMappingURL=background.js.map
