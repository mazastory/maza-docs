/**
 * MAZA OS — platforms/tistory/infra.ts
 *
 * 티스토리 스킨 HTML 에디터에 인프라 코드(GSC, GA4)를 주입합니다.
 */
import { findAnywhere, clickAnywhere, waitForElement, findByTextAnywhere, notifyProgress } from '../../utils/dom.js';
export async function injectInfra(html) {
    try {
        console.log('[MAZA OS] Starting Infra Injection...');
        notifyProgress('STARTING');
        // 0. 로그인 페이지로 튕겼는지 확인
        if (window.location.href.includes('/auth/login')) {
            throw new Error('티스토리에 로그인이 되어 있지 않습니다. 로그인 후 다시 시도해 주세요.');
        }
        // 1. 현재 에디터 상태인지 확인
        let editor = findAnywhere('.CodeMirror, #htmlEditor, textarea');
        // 2. 에디터가 없다면 'html 편집' 버튼 클릭 시도
        if (!editor) {
            console.log('[MAZA OS] Editor not found. Trying to click "html 편집" button...');
            notifyProgress('BUTTON_CLICKED', '에디터 전환 시도 중...');
            const targetBtn = findByTextAnywhere('html 편집');
            if (targetBtn) {
                await clickAnywhere(targetBtn);
                console.log('[MAZA OS] "html 편집" button clicked.');
                // 에디터가 나타날 때까지 재대기
                editor = await waitForElement('.CodeMirror, #htmlEditor, textarea', 15000);
            }
        }
        if (!editor)
            throw new Error('HTML 에디터를 찾을 수 없습니다. (로그인 상태를 확인해 주세요)');
        notifyProgress('EDITOR_READY');
        // 3. 이미 주입되어 있는지 확인
        const currentCode = editor.value || editor.textContent || '';
        if (currentCode.includes('google-site-verification') || currentCode.includes('Maza Infra')) {
            console.log('[MAZA OS] Infra already injected.');
            notifyProgress('ALREADY_INJECTED');
            return { ok: true, step: 'ALREADY_INJECTED' };
        }
        // 4. 코드 주입
        notifyProgress('CODE_INJECTED');
        // findAnywhere로 찾은 editor 요소가 CodeMirror 에디터인 경우 처리
        let injected = false;
        // CodeMirror 인스턴스 탐색 (티스토리 신형 에디터 대응)
        const cmElement = editor.classList.contains('CodeMirror') ? editor : editor.querySelector('.CodeMirror');
        const actualCmElement = cmElement || editor.closest('.CodeMirror');
        if (actualCmElement && actualCmElement.CodeMirror) {
            const cm = actualCmElement.CodeMirror;
            const content = cm.getValue();
            if (content.includes('<head>')) {
                cm.setValue(content.replace('<head>', `<head>\n${html}`));
            }
            else {
                cm.setValue(html + content);
            }
            injected = true;
        }
        if (!injected) {
            if (editor.tagName === 'TEXTAREA') {
                const textarea = editor;
                textarea.value = html + textarea.value;
                injected = true;
            }
            else {
                editor.prepend(document.createTextNode(html));
                injected = true;
            }
        }
        // 5. 저장(적용) 버튼 클릭
        const applyBtn = findByTextAnywhere('적용');
        if (applyBtn) {
            notifyProgress('SAVE_CLICKED');
            await clickAnywhere(applyBtn);
            console.log('[MAZA OS] Apply button clicked.');
        }
        notifyProgress('SUCCESS');
        return { ok: true, step: 'SUCCESS' };
    }
    catch (err) {
        console.error('[MAZA OS] Infra injection failed:', err);
        notifyProgress('ERROR', err.message);
        return { ok: false, error: err.message };
    }
}
//# sourceMappingURL=infra.js.map