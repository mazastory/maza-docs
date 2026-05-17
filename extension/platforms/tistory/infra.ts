/**
 * MAZA OS — platforms/tistory/infra.ts
 *
 * 티스토리 스킨 HTML 에디터에 인프라 코드(GSC, GA4)를 주입합니다.
 *
 * [아키텍처 핵심]
 * Tistory의 강력한 CSP(Content Security Policy)로 인해 Content Script에서
 * <script> 태그를 인라인 삽입하는 방식은 차단됩니다.
 * 따라서 Background Script에 메시지를 보내 chrome.scripting.executeScript({ world: 'MAIN' })
 * 를 통해 안전하게 MAIN World에 접근합니다.
 */

import { findAnywhere, findByTextAnywhere, clickAnywhere, waitForElement, notifyProgress } from '../../utils/dom.js';

/**
 * 티스토리의 확인 팝업을 MAIN World에서 자동 수락.
 */
async function autoAcceptTistoryDialog() {
  await new Promise((resolve) => {
    chrome.runtime.sendMessage({
      type: 'EXECUTE_MAIN_WORLD',
      funcId: 'autoAcceptDialog'
    }, (res) => resolve(res));
  });
}

/**
 * CodeMirror 인스턴스를 MAIN World에서 찾아 html 주입.
 */
async function injectViaMainWorld(html: string): Promise<{ ok: boolean; step?: string; error?: string }> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      type: 'EXECUTE_MAIN_WORLD',
      funcId: 'injectInfra',
      args: [html]
    }, (res) => {
      resolve(res || { ok: false, error: 'No response from background script' });
    });
  });
}

export async function injectInfra(html: string) {
  try {
    console.log('[MAZA OS] Starting Infra Injection...');
    notifyProgress('STARTING');

    // 0. 로그인 페이지로 튕겼는지 확인
    if (window.location.href.includes('/auth/login')) {
      throw new Error('티스토리에 로그인되어 있지 않습니다. 로그인 후 다시 시도해 주세요.');
    }

    // 1. html 편집 버튼 자동 클릭 시도
    //    (이미 #/source/html에 있다면 에디터가 바로 보임)
    const hasEditor = findAnywhere('.CodeMirror, .cm-editor, #htmlEditor');
    if (!hasEditor) {
      console.log('[MAZA OS] Editor not visible. Trying to navigate to HTML edit mode...');
      notifyProgress('BUTTON_CLICKED');

      // Tistory 확인 다이얼로그 사전 차단 (MAIN World에서)
      await autoAcceptTistoryDialog();

      const htmlEditBtn = findByTextAnywhere('html 편집')
        || findByTextAnywhere('HTML 편집')
        || findAnywhere('[href*="source/html"], [data-tab="html"]');

      if (htmlEditBtn) {
        await clickAnywhere(htmlEditBtn);
        console.log('[MAZA OS] HTML edit button clicked.');
      }

      // 에디터 나타날 때까지 최대 15초 대기
      const appeared = await waitForElement('.CodeMirror, .cm-editor, textarea', 15000);
      if (!appeared) {
        throw new Error('HTML 에디터를 열 수 없습니다. 스킨 편집 페이지에서 다시 시도해 주세요.');
      }
    }

    notifyProgress('EDITOR_READY');

    // 2. MAIN World에서 CodeMirror에 주입 (Isolated World 한계 우회)
    console.log('[MAZA OS] Injecting via MAIN World script...');
    const injectResult = await injectViaMainWorld(html);

    if (!injectResult.ok) {
      throw new Error(injectResult.error || 'CodeMirror 주입 실패');
    }

    if (injectResult.step === 'ALREADY_INJECTED') {
      console.log('[MAZA OS] Infra already injected.');
      notifyProgress('ALREADY_INJECTED');
      return { ok: true, step: 'ALREADY_INJECTED' };
    }

    notifyProgress('CODE_INJECTED');
    console.log('[MAZA OS] Code injected successfully. Clicking apply button...');

    // 3. 적용 버튼 클릭
    await new Promise(r => setTimeout(r, 800)); // CodeMirror 렌더링 대기
    const applyBtn = findByTextAnywhere('적용')
      || findByTextAnywhere('저장')
      || findAnywhere('button[type="submit"]');

    if (applyBtn) {
      notifyProgress('SAVE_CLICKED');
      await clickAnywhere(applyBtn);
      console.log('[MAZA OS] Apply button clicked.');
    } else {
      console.warn('[MAZA OS] Apply button not found. Manual save required.');
    }

    notifyProgress('SUCCESS');
    return { ok: true, step: 'SUCCESS' };

  } catch (err: any) {
    console.error('[MAZA OS] Infra injection failed:', err);
    notifyProgress('ERROR', err.message);
    return { ok: false, error: err.message };
  }
}
