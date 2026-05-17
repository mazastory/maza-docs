/**
 * MAZA OS — background/background.ts
 * 
 * [Dumb & Phoenix Engine]
 * 오직 3단계: 가져온다 -> 실행한다 -> 보고한다
 */

import { CONFIG } from '../shared/config.js';
import { log, error } from '../utils/logger.js';
import { MazaTask, MazaMessage } from '../shared/types.js';
import { withRetry } from '../utils/retry.js';
import { captureErrorState } from '../utils/screenshot.js';

log('SYSTEM', 'MAZA OS Phoenix Engine Started.');

// 익스텐션 아이콘 클릭 시 사이드바 열기 설정
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Fallback: 아이콘 클릭 시 명시적으로 사이드바 열기 시도
chrome.action.onClicked.addListener((tab) => {
  if (tab.windowId) {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// 1. Polling Loop
async function pollingLoop() {
  try {
    const storage = await chrome.storage.local.get(['mazaToken', 'mazaOrigin']);
    if (!storage.mazaToken) return;

    const apiBase = storage.mazaOrigin ? `${storage.mazaOrigin}/api` : CONFIG.API_BASE_URL;

    const res = await fetch(`${apiBase}/tasks/next`, {
      headers: { 'Authorization': `Bearer ${storage.mazaToken}` }
    });

    if (res.status === 200) {
      const result = await res.json();
      if (result.success && result.command === 'EXECUTE') {
        const task: MazaTask = result.data;
        log('POLLING', `Task Found: ${task.type}`, task.id);
        await withRetry(() => executeTask(task), 3);
      }
    }
  } catch (err: any) {
    if (err.message?.includes('Failed to fetch') || err.message?.includes('Load failed')) {
      return;
    }
    error("POLLING", `Polling loop error: ${err.message}`);
  }
}

// 2. Task Executor
async function executeTask(task: MazaTask) {
  try {
    let tab = await findTabByDomain(task.domain);
    if (!tab) {
      tab = await chrome.tabs.create({ url: task.url });
      await waitForTabComplete(tab.id!);
      await new Promise(r => setTimeout(r, 5000));
    } else {
      const targetPath = new URL(task.url).pathname;
      if (!tab.url?.includes(targetPath)) {
        await chrome.tabs.update(tab.id!, { url: task.url });
        await waitForTabComplete(tab.id!);
        await new Promise(r => setTimeout(r, 3500));
      }
    }

    chrome.runtime.sendMessage({ type: 'TASK_STARTED', taskType: task.type }).catch(() => {});

    let result;
    try {
      result = await chrome.tabs.sendMessage(tab.id!, { type: 'RUN_TASK', task });
    } catch (msgErr: any) {
      log('EXEC', 'Content script not ready, retrying in 2s...', tab.id);
      await new Promise(r => setTimeout(r, 2000));
      try {
        result = await chrome.tabs.sendMessage(tab.id!, { type: 'RUN_TASK', task });
      } catch (retryErr: any) {
        result = { ok: false, error: `Content script 연결 실패: ${retryErr.message}` };
      }
    }
    
    if (task.type === 'INFRA_INJECT') {
      relayToWebApp({
        type: 'MAZA_INFRA_PROGRESS',
        step: result?.ok ? (result.step || 'SUCCESS') : 'ERROR',
        detail: result?.error || ''
      });
      if (result?.ok) {
        await focusWebAppTab();
      }
    }

    await reportResult(task.id, result);
    log('EXEC', 'Task Completed Successfully', task.id);

  } catch (err: any) {
    const screenshot = await captureErrorState();
    if (task.type === 'INFRA_INJECT') {
      relayToWebApp({ type: 'MAZA_INFRA_PROGRESS', step: 'ERROR', detail: err.message });
    }
    await reportResult(task.id, { ok: false, error: err.message, screenshot });
    throw err;
  }
}

// Helpers
async function findTabByDomain(domain: string): Promise<chrome.tabs.Tab | null> {
  const tabs = await chrome.tabs.query({});
  return tabs.find(t => t.url?.includes(domain)) || null;
}

async function waitForTabComplete(tabId: number) {
  const tab = await chrome.tabs.get(tabId).catch(() => null);
  if (tab?.status === 'complete') return;

  return new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    }, 30000);

    const listener = (id: number, info: any) => {
      if (id === tabId && info.status === 'complete') {
        clearTimeout(timer);
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
  });
}

async function reportResult(taskId: string, result: any) {
  const storage = await chrome.storage.local.get(['mazaToken', 'mazaOrigin']);
  const apiBase = storage.mazaOrigin ? `${storage.mazaOrigin}/api` : CONFIG.API_BASE_URL;

  let postId = result.post_id || null;
  if (!postId && result.published_url) {
    const match = result.published_url.match(/\/(\d+)\/?$/);
    if (match) postId = match[1];
  }

  await fetch(`${apiBase}/tasks/report`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${storage.mazaToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ taskId, postId, status: result.ok ? 'success' : 'failed', result })
  });
}

// [B3] 서비스 워커 재시작 시 알람 중복 생성 방지
chrome.alarms.clear('maza-polling', () => {
  chrome.alarms.create('maza-polling', { periodInMinutes: 0.083 }); // 약 5초
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'maza-polling') {
    pollingLoop();
  }
});

// ============================================================
// [ASYNC HANDLER] IMMEDIATE_ACTION
// async function으로 분리하여 await 사용 가능하게 함
// ============================================================
async function handleImmediateAction(msg: any, sendResponse: (r: any) => void) {
  const { actionType, payload } = msg;
  log('SYSTEM', `Immediate Action: ${actionType}, domain: "${payload.domain}", title: "${payload.title?.substring(0, 20)}"`);

  // [SAFETY+RECOVERY] 도메인이 없으면 storage에서 자동 복구 시도
  if (!payload.domain) {
    error('SYSTEM', '❌ No domain in payload. Trying storage recovery...');
    const storage = await chrome.storage.local.get(['mazaSites']);
    const sites: any[] = (storage['mazaSites'] as any[]) || [];
    if (sites.length > 0 && sites[0].domain) {
      payload.domain = sites[0].domain;
      log('SYSTEM', `[Recovery] Auto-recovered domain: ${payload.domain}`);
    } else {
      sendResponse({ ok: false, error: '연결된 블로그가 없습니다. 내 사이트 메뉴에서 블로그를 등록해 주세요.' });
      return;
    }
  }

  let html = payload.content || payload.html || payload.body;
  if (actionType === 'MAZA_INFRA_INJECT' && !html) {
    let clean_sc = payload.sc_verification?.trim() || '';
    const scDoubleMatch = clean_sc.match(/content="([^"]+)"/);
    const scSingleMatch = clean_sc.match(/content='([^']+)'/);
    if (scDoubleMatch) clean_sc = scDoubleMatch[1];
    else if (scSingleMatch) clean_sc = scSingleMatch[1];
    if (clean_sc.startsWith('google-site-verification=')) {
      clean_sc = clean_sc.replace('google-site-verification=', '');
    }

    let clean_ga = payload.ga_measurement_id?.trim() || '';
    if (clean_ga.includes('id=')) {
      const match = clean_ga.match(/id=(G-[A-Z0-9]+)/);
      if (match) clean_ga = match[1];
    }
    if (clean_ga && !clean_ga.startsWith('G-')) clean_ga = '';

    const scHtml = clean_sc ? `<meta name="google-site-verification" content="${clean_sc}" />` : '';
    const gaHtml = clean_ga ? `<!-- Global site tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=${clean_ga}"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${clean_ga}');</script>` : '';

    const htmlParts = [scHtml, gaHtml].filter(Boolean);
    html = `<!-- Maza Infra -->\n${htmlParts.join('\n')}\n<!-- End Maza Infra -->`;
  }

  const task: MazaTask = {
    id: payload.id || `immediate-${Date.now()}`,
    type: actionType === 'MAZA_INFRA_INJECT' ? 'INFRA_INJECT' : 'PUBLISH_POST',
    platform: 'tistory',
    url: actionType === 'MAZA_INFRA_INJECT'
      ? `https://${payload.domain.split('.')[0]}.tistory.com/manage/design/skin/edit#/source/html`
      : `https://${payload.domain.split('.')[0]}.tistory.com/manage/post`,
    domain: payload.domain,
    payload: {
      title: payload.title,
      html: html,
      type: payload.type
    }
  };

  // 메모리 + 스토리지 동시 저장 (타이밍 미스 방지)
  (globalThis as any).lastImmediateTask = task;
  chrome.storage.local.set({ lastImmediateTask: task });

  log('SYSTEM', `Task created: ${task.type} → ${task.domain}`);

  // 항상 executeTask를 호출하여 자동 네비게이션 및 재시도 로직을 태움 (Silent failure 방지)
  executeTask(task).catch(err => error('EXEC', `Immediate Task Failed: ${err.message}`));

  sendResponse({ ok: true });
}

// ============================================================
// 메시지 리스너 (Popup/Sidebar/ContentScript)
// ============================================================
chrome.runtime.onMessage.addListener((msg: MazaMessage | any, sender, sendResponse) => {
  if (msg.type === 'MAZA_SYNC_TOKEN') {
    const { token, origin } = msg.payload;
    log('SYSTEM', `Token synced from ${origin}.`);
    chrome.storage.local.set({ 
      'mazaToken': token, 
      'mazaOrigin': origin,
      'last_sync': new Date().toISOString()
    }).then(() => pollingLoop());
    sendResponse({ ok: true });
    return false;
  }

  if (msg.type === 'TOKEN_UPDATED') {
    log('SYSTEM', 'Token updated. Triggering immediate poll...');
    pollingLoop();
    return false;
  }

  if (msg.type === 'FORCE_POLLING') {
    log('SYSTEM', 'Force Polling requested.');
    pollingLoop();
    return false;
  }

  if (msg.type === 'MAZA_AUTOPILOT_SYNC') {
    chrome.runtime.sendMessage(msg).catch(() => {});
    return false;
  }
  
  if (msg.type === 'IMMEDIATE_ACTION') {
    // async 핸들러 호출 - return true로 비동기 응답 채널 유지
    handleImmediateAction(msg, sendResponse).catch(err => {
      error('SYSTEM', `handleImmediateAction failed: ${err.message}`);
      sendResponse({ ok: false, error: err.message });
    });
    return true;
  } 

  if (msg.type === 'CONTENT_SCRIPT_READY') {
    sendResponse({ received: true });

    let task = (globalThis as any).lastImmediateTask;
    if (!task) {
      chrome.storage.local.get('lastImmediateTask').then((storage) => {
        task = storage.lastImmediateTask;
        if (task && sender.tab?.id) {
          deliverTask(task, sender.tab.id);
        } else {
          log('SYSTEM', `READY received but NO TASK for tab ${sender.tab?.id}.`);
        }
      });
    } else if (sender.tab?.id) {
      deliverTask(task, sender.tab.id);
    }
    return true;
  }
  
  if (msg.type === 'MAZA_INFRA_PROGRESS') {
    relayToWebApp(msg);
    return false;
  } 

  if (msg.type === 'MANUAL_INJECT_REQUEST') {
    const task = (globalThis as any).lastImmediateTask;
    if (task) {
      chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        if (tabs[0]?.id) deliverTask(task, tabs[0].id, true);
      });
    }
    return false;
  }
  
  if (msg.type === 'EXECUTE_MAIN_WORLD') {
    if (sender.tab?.id) {
      const func = msg.funcId === 'autoAcceptDialog' 
        ? () => {
            const _origConfirm = window.confirm;
            window.confirm = () => true;
            setTimeout(() => { window.confirm = _origConfirm; }, 3000);
            return { ok: true };
          }
        : msg.funcId === 'injectInfra'
        ? (html: string) => {
            try {
              const processVal = (val: string) => {
                if (!html || html === 'null' || html === 'undefined') return null; // [SAFETY] null 주입 방지
                if (val.includes(html)) return null;
                let cleaned = val;
                const regexNew = /<!-- Maza Infra -->[\s\S]*?<!-- End Maza Infra -->\n?/g;
                cleaned = cleaned.replace(regexNew, '');
                return cleaned.includes('<head>') ? cleaned.replace('<head>', '<head>\n' + html) : html + '\n' + cleaned;
              };

              const cmEls = document.querySelectorAll('.CodeMirror');
              for (const el of Array.from(cmEls) as any[]) {
                if (el.CodeMirror) {
                  const cm = el.CodeMirror;
                  const newVal = processVal(cm.getValue());
                  if (newVal === null) return { ok: true, step: 'ALREADY_INJECTED' };
                  cm.setValue(newVal);
                  return { ok: true, step: 'SUCCESS' };
                }
              }

              if ((window as any).monaco?.editor) {
                const models = (window as any).monaco.editor.getModels();
                if (models && models.length > 0) {
                  const newVal = processVal(models[0].getValue());
                  if (newVal === null) return { ok: true, step: 'ALREADY_INJECTED' };
                  models[0].setValue(newVal);
                  return { ok: true, step: 'SUCCESS' };
                }
              }

              const htmlTextarea = Array.from(document.querySelectorAll('textarea')).find(
                t => t.value.includes('<html') || t.value.includes('<!doctype')
              ) as HTMLTextAreaElement;
              if (htmlTextarea) {
                const newVal = processVal(htmlTextarea.value);
                if (newVal === null) return { ok: true, step: 'ALREADY_INJECTED' };
                const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
                if (setter) setter.call(htmlTextarea, newVal);
                else htmlTextarea.value = newVal;
                htmlTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                htmlTextarea.dispatchEvent(new Event('change', { bubbles: true }));
                return { ok: true, step: 'SUCCESS' };
              }
              return { ok: false, error: 'NO_EDITOR_FOUND' };
            } catch (err: any) {
              return { ok: false, error: err.message };
            }
          }
        : undefined;

      if (func) {
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id, allFrames: true },
          world: 'MAIN',
          args: msg.args || [],
          func: func as any
        }).then(results => {
          const validResult = results.find(r => r.result)?.result;
          sendResponse(validResult || { ok: false, error: 'No valid result from frames' });
        }).catch(err => {
          sendResponse({ ok: false, error: err.message });
        });
        return true;
      }
    }
  }

  return false;
});

// [Helper] Task delivery and cleanup
function deliverTask(task: MazaTask, tabId: number, proactive = false) {
  log('SYSTEM', `${proactive ? '[Proactive]' : '[Reactive]'} Delivering task ${task.id} to tab ${tabId}...`);
  
  chrome.runtime.sendMessage({ type: 'TASK_PENDING', task }).catch(() => {});

  chrome.tabs.sendMessage(tabId, { type: 'RUN_TASK', task }).then((response) => {
    if (!response) {
      log('SYSTEM', `No response from tab ${tabId}. Keeping task in memory.`);
      return;
    }

    const isFinished = response.status === 'PUBLISHED' || response.status === 'INJECTED' || response.status === 'INJECTED_ONLY' || response.ok === false;
    
    if (isFinished) {
      log('SYSTEM', `Task ${task.id} finished: ${response.status || 'ERROR'}. Clearing.`);
      reportResult(task.id, response).catch(() => {});
      (globalThis as any).lastImmediateTask = null;
      chrome.storage.local.remove('lastImmediateTask');
      chrome.runtime.sendMessage({ type: 'TASK_CLEARED' }).catch(() => {});
    } else if (response.status === 'NAVIGATING_TO_EDITOR') {
      log('SYSTEM', `Tab ${tabId} navigating to editor. Preserving task.`);
    }
  }).catch((err) => {
    log('SYSTEM', `Delivery to tab ${tabId} failed: ${err.message}. Task kept in memory.`);
  });
}

async function relayToWebApp(message: any) {
  const tabs = await chrome.tabs.query({});
  const webAppTabs = tabs.filter(t => 
    t.url?.includes('localhost') || 
    t.url?.includes('mazastudio.kr')
  );

  for (const tab of webAppTabs) {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, message).catch(() => {});
    }
  }
}

async function focusWebAppTab() {
  const tabs = await chrome.tabs.query({});
  const webAppTab = tabs.find(t => 
    t.url?.includes('localhost') || 
    t.url?.includes('mazastudio.kr')
  );
  if (webAppTab && webAppTab.id) {
    chrome.tabs.update(webAppTab.id, { active: true }).catch(() => {});
    if (webAppTab.windowId) {
      chrome.windows.update(webAppTab.windowId, { focused: true }).catch(() => {});
    }
  }
}
