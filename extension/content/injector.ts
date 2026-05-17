/**
 * MAZA OS — content/injector.ts
 * 
 * 역할을 최소화한 Dumb Content Script.
 */

console.log("%c[MAZA OS] Tistory Injector Active!", "color: #8b5cf6; font-weight: bold; font-size: 14px;");

import { injectContent } from '../platforms/tistory/publish.js';
import { injectInfra } from '../platforms/tistory/infra.js';

// [MAZA OS] Content Injector Active. (로그 생략)

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log(`[MAZA OS] Message Received: ${msg.type}`);
  if (msg.type === 'RUN_TASK') {
    handleTask(msg.task)
      .then(sendResponse)
      .catch(err => sendResponse({ ok: false, error: err.message }));
    return true;
  }
});

// [I4] 백그라운드와 연결될 때까지 준비 완료 알림 (최대 10회 재시도)
let readyAttempts = 0;
function announceReady() {
  if (readyAttempts++ > 10) {
    console.warn("[MAZA OS] Gave up sending READY signal after 10 attempts.");
    return;
  }
  console.log("[MAZA OS] Sending READY signal to background...");
  chrome.runtime.sendMessage({ type: 'CONTENT_SCRIPT_READY' }, (response) => {
    if (chrome.runtime.lastError) {
      console.warn("[MAZA OS] Background not ready yet, retrying in 1s...");
      setTimeout(announceReady, 1000);
    } else {
      console.log("[MAZA OS] READY signal acknowledged by background.");
    }
  });
}

announceReady();

async function handleTask(task: any) {
  console.log(`[MAZA OS] Received Task: ${task.type}`);

  if (task.platform === 'tistory') {
    if (task.type === 'PUBLISH_POST') {
      return injectContent(task.payload.title, task.payload.body || task.payload.html);
    }
    if (task.type === 'INFRA_INJECT') {
      return injectInfra(task.payload.html);
    }
  }

  return { ok: false, error: 'Unknown Task' };
}
