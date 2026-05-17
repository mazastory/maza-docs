/**
 * MAZA OS — platforms/tistory/publish.ts
 *
 * 티스토리 전용 포스팅 실행 로직.
 */
import { SELECTORS } from './selectors.js';
import { findAnywhere, clickAnywhere, waitForElement } from '../../utils/dom.js';
export async function injectContent(title, html) {
    console.log('[MAZA Tistory] Starting Full Autopilot Injection...');
    // 1. 제목 입력
    const titleEl = await waitForElement(SELECTORS.title);
    if (titleEl) {
        titleEl.value = title;
        titleEl.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('[MAZA Tistory] Title injected.');
    }
    // 2. 본문 주입
    const editorSelectors = [
        SELECTORS.monacoInput,
        'div[contenteditable="true"]',
        '#tinymce_ifr',
        '.content_editable'
    ];
    let injected = false;
    for (const selector of editorSelectors) {
        const el = findAnywhere(selector);
        if (!el)
            continue;
        console.log(`[MAZA Tistory] Attempting injection via: ${selector}`);
        if (selector.includes('ifr')) {
            const doc = el.contentDocument || el.contentWindow.document;
            if (doc && doc.body) {
                doc.body.innerHTML = html;
                injected = true;
            }
        }
        else if (el.tagName === 'TEXTAREA') {
            el.value = html;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            injected = true;
        }
        else {
            el.innerHTML = html;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            injected = true;
        }
        if (injected)
            break;
    }
    if (!injected) {
        return { ok: false, error: 'EDITOR_NOT_FOUND' };
    }
    // 3. 자동 발행 (Autopilot)
    console.log('[MAZA Tistory] Triggering Publish Flow...');
    // 발행 레이어 열기
    const layerOpened = await clickAnywhere(SELECTORS.publishBtn);
    if (!layerOpened) {
        console.warn('[MAZA Tistory] Could not find publish button, stopping at injection.');
        return { ok: true, status: 'INJECTED_ONLY' };
    }
    // 발행 확정 버튼 대기 및 클릭
    await new Promise(r => setTimeout(r, 1000)); // 레이어 애니메이션 대기
    const confirmed = await clickAnywhere(SELECTORS.confirmBtn);
    if (confirmed) {
        console.log('[MAZA Tistory] Publish confirmed. Waiting for navigation...');
        // 발행 후 리다이렉트 대기 (URL 추출을 위해 백그라운드에서 감시 권장하지만, 일단 여기서도 대기)
        await new Promise(r => setTimeout(r, 3000));
        return { ok: true, status: 'PUBLISHED', published_url: window.location.href };
    }
    return { ok: true, status: 'INJECTED' };
}
//# sourceMappingURL=publish.js.map