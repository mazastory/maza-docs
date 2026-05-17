/**
 * MAZA OS — utils/dom.ts
 * 
 * Shadow DOM 및 Iframe을 관통하는 강력한 DOM 유틸리티.
 */

/**
 * 모든 곳(Shadow DOM 및 중첩 Iframe 포함)에서 요소를 찾습니다.
 */
export function findAnywhere(selector: string, root: ParentNode = document): HTMLElement | null {
  // 1. 현재 루트에서 검색
  const el = root.querySelector(selector);
  if (el) return el as HTMLElement;

  // 2. Iframe 내부 탐색 (동일 도메인만 가능)
  const iframes = root.querySelectorAll('iframe, frame');
  for (const iframe of Array.from(iframes)) {
    try {
      const doc = (iframe as HTMLIFrameElement).contentDocument || (iframe as HTMLIFrameElement).contentWindow?.document;
      if (doc) {
        const found = findAnywhere(selector, doc);
        if (found) return found;
      }
    } catch (e) {
      // Cross-origin iframe 접근 불가
    }
  }

  // 3. Shadow DOM 내부 탐색
  const allElements = root.querySelectorAll('*');
  for (const node of Array.from(allElements)) {
    if (node.shadowRoot) {
      const found = findAnywhere(selector, node.shadowRoot);
      if (found) return found;
    }
  }

  return null;
}

/**
 * 텍스트 내용으로 요소를 찾습니다. (Iframe 포함)
 */
export function findByTextAnywhere(text: string, root: ParentNode = document): HTMLElement | null {
  // 1. 현재 루트에서 모든 요소 순회
  const all = root.querySelectorAll('button, a, div, span, p');
  for (const el of Array.from(all)) {
    if (el.textContent?.includes(text)) {
      return el as HTMLElement;
    }
  }

  // 2. Iframe 내부 탐색
  const iframes = root.querySelectorAll('iframe, frame');
  for (const iframe of Array.from(iframes)) {
    try {
      const doc = (iframe as HTMLIFrameElement).contentDocument || (iframe as HTMLIFrameElement).contentWindow?.document;
      if (doc) {
        const found = findByTextAnywhere(text, doc);
        if (found) return found;
      }
    } catch (e) {}
  }

  return null;
}

/**
 * 요소를 찾아 클릭합니다.
 */
export async function clickAnywhere(target: string | HTMLElement): Promise<boolean> {
  const el = typeof target === 'string' ? findAnywhere(target) : target;
  if (el) {
    el.click();
    return true;
  }
  return false;
}

/**
 * 작업 진행 상황을 알립니다.
 */
export function notifyProgress(step: string, detail?: string) {
  chrome.runtime.sendMessage({
    type: 'MAZA_INFRA_PROGRESS',
    step,
    detail,
    timestamp: new Date().toISOString()
  }).catch(() => {}); // 수신처가 없어도 무시
}

/**
 * 요소가 나타날 때까지 대기합니다.
 */
export async function waitForElement(selector: string, timeout = 10000): Promise<HTMLElement | null> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = findAnywhere(selector);
    if (el) return el;
    await new Promise(r => setTimeout(r, 1000));
  }
  return null;
}
