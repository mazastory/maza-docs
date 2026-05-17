/**
 * MAZA OS — sidebar/sidebar.ts
 */

console.log('[MAZA OS] Sidebar Engine Ready.');

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
  // UI Elements - Navigation & Logs
  const logList      = document.getElementById('log-list');
  const statusText  = document.getElementById('engine-status');
  const activeTaskEl = document.getElementById('active-task');

  // UI Elements - Identity
  const userEmailEl = document.getElementById('user-email');
  const tokenStatusEl = document.getElementById('token-status');

  // UI Elements - Connection
  const currentTabDomainEl = document.getElementById('current-tab-domain');
  const matchStatusEl = document.getElementById('match-status');
  const matchedSiteInfoEl = document.getElementById('matched-site-info');
  const matchedSiteNameEl = document.getElementById('matched-site-name');

  // [S1] 로그 추가 함수
  function addLog(message: string) {
    if (!logList) return;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const div = document.createElement('div');
    div.className = 'log-item';
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'log-time';
    timeSpan.textContent = timeStr;
    
    div.appendChild(timeSpan);
    div.appendChild(document.createTextNode(` ${message}`));
    
    logList.insertBefore(div, logList.firstChild);
  }

  // [S2] 연결 상태 업데이트 함수 (인증만 체크)
  async function updateConnectionInfo() {
    chrome.storage.local.get(['mazaToken', 'mazaUserEmail'], async (data) => {
      // 1. 인증 상태 업데이트
      if (tokenStatusEl && userEmailEl) {
        if (data.mazaToken) {
          tokenStatusEl.textContent = 'Connected';
          tokenStatusEl.className = 'badge badge-success';
          userEmailEl.textContent = (data.mazaUserEmail as string) || 'Logged In';
        } else {
          tokenStatusEl.textContent = 'Disconnected';
          tokenStatusEl.className = 'badge badge-error';
          userEmailEl.textContent = 'Guest User';
        }
      }
    });
  }

  // 2. 이벤트 리스너 등록
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'TASK_STARTED') {
      if (activeTaskEl) activeTaskEl.textContent = `${msg.taskType} 실행 중...`;
      if (statusText) statusText.textContent = `Running: ${msg.taskType}`;
      addLog(`Task Started: ${msg.taskType}`);
    }
    
    if (msg.type === 'TASK_LOG') {
      addLog(msg.message);
    }

    if (msg.type === 'TASK_PENDING') {
      const card = document.getElementById('pending-task-card');
      const title = document.getElementById('pending-task-title');
      if (card && title) {
        card.style.display = 'block';
        title.textContent = msg.task.payload.title;
        
        // [NEW] 대상 도메인 표시 추가 (Type fix: Element -> HTMLElement)
        const domainLabel = (card.querySelector('.ui-card-value') as HTMLElement) || document.createElement('div');
        domainLabel.className = 'ui-card-value';
        domainLabel.style.fontSize = '10px';
        domainLabel.style.marginTop = '4px';
        domainLabel.style.color = 'var(--accent)';
        domainLabel.textContent = `Target: ${msg.task.domain}`;
        if (!card.querySelector('.ui-card-value')) card.appendChild(domainLabel);
        
        addLog(`Dispatcher: targeting ${msg.task.domain}`);
      }
    }

    if (msg.type === 'MAZA_AUTOPILOT_SYNC') {
      if (activeTaskEl) {
        activeTaskEl.textContent = `Orchestrating: ${msg.payload.targetDomain}`;
        activeTaskEl.style.color = 'var(--primary)';
      }
      addLog(`Sync: Target switched to ${msg.payload.targetDomain}`);
    }

    if (msg.type === 'TASK_CLEARED') {
      const card = document.getElementById('pending-task-card');
      if (card) card.style.display = 'none';
      if (activeTaskEl) activeTaskEl.textContent = '대기 중인 작업 없음';
      if (statusText) statusText.textContent = 'OS Engine Polling...';
      addLog('Draft Cleared.');
    }
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.mazaToken || changes.mazaSites || changes.mazaUserEmail) {
      updateConnectionInfo();
    }
  });

  chrome.tabs.onActivated.addListener(updateConnectionInfo);
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete') updateConnectionInfo();
  });

  // 버튼 이벤트
  document.getElementById('manual-inject-btn')?.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'MANUAL_INJECT_REQUEST' });
    addLog('Manual Injection Requested...');
  });

  document.getElementById('open-studio')?.addEventListener('click', () => {
    chrome.storage.local.get('mazaOrigin', (data) => {
      const origin = (data.mazaOrigin as string) || '';
      const url = origin.includes('localhost') ? 'http://localhost:5174' : 'https://mazastudio.kr';
      chrome.tabs.create({ url });
    });
  });

  document.getElementById('start-manual')?.addEventListener('click', () => {
    addLog('Force Polling Requested...');
    chrome.runtime.sendMessage({ type: 'FORCE_POLLING' });
  });

  document.getElementById('open-manual')?.addEventListener('click', () => {
    chrome.storage.local.get('mazaOrigin', (data) => {
      const origin = (data.mazaOrigin as string) || 'https://mazastudio.kr';
      const url = `${origin}/guide`;
      chrome.tabs.create({ url });
    });
  });

  // 초기 실행
  updateConnectionInfo();
});
