"use strict";
(() => {
  // extension/sidebar.ts
  console.log("[MAZA OS] Sidebar Engine Ready.");
  var logList = document.getElementById("log-list");
  var statusText = document.getElementById("engine-status");
  var activeTaskEl = document.getElementById("active-task");
  function addLog(message) {
    const now = /* @__PURE__ */ new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const div = document.createElement("div");
    div.className = "log-item";
    // FIX: was using innerHTML with unsanitized message — XSS risk from background log strings
    const timeSpan = document.createElement("span");
    timeSpan.className = "log-time";
    timeSpan.textContent = timeStr;
    div.appendChild(timeSpan);
    div.appendChild(document.createTextNode(" " + message));
    logList.insertBefore(div, logList.firstChild);
  }
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "TASK_STARTED") {
      activeTaskEl.textContent = `${msg.taskType} 실행 중...`;
      // FIX: statusText was referenced but never updated — now reflects live task state
      statusText.textContent = `Running: ${msg.taskType}`;
      addLog(`Task Started: ${msg.taskType}`);
    }
    if (msg.type === "TASK_LOG") {
      addLog(msg.message);
    }
    if (msg.type === "TASK_PENDING") {
      const card = document.getElementById("pending-task-card");
      const title = document.getElementById("pending-task-title");
      card.style.display = "block";
      title.textContent = msg.task.payload.title;
      addLog(`Draft Ready: ${msg.task.payload.title}`);
    }
    if (msg.type === "TASK_CLEARED") {
      const card = document.getElementById("pending-task-card");
      card.style.display = "none";
      // FIX: activeTaskEl was never reset on TASK_CLEARED — kept showing stale "X 실행 중..."
      activeTaskEl.textContent = "대기 중인 작업 없음";
      // FIX: statusText also needs reset
      statusText.textContent = "OS Engine Polling...";
      addLog("Draft Cleared.");
    }
  });
  document.getElementById("manual-inject-btn")?.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "MANUAL_INJECT_REQUEST" });
    addLog("Manual Injection Requested...");
  });
  document.getElementById("open-studio")?.addEventListener("click", () => {
    // FIX: sidebar runs in extension context so window.location.hostname is always
    // the extension origin — can never equal "localhost". Use storage to determine env.
    chrome.storage.local.get("mazaOrigin", (data) => {
      const origin = data.mazaOrigin || "";
      const url = origin.includes("localhost") ? "http://localhost:5174" : "https://mazastudio.kr";
      chrome.tabs.create({ url });
    });
  });
  document.getElementById("start-manual")?.addEventListener("click", () => {
    addLog("Force Polling Requested...");
    chrome.runtime.sendMessage({ type: "FORCE_POLLING" });
  });
})();
//# sourceMappingURL=sidebar.js.map
