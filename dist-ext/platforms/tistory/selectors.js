/**
 * MAZA OS — platforms/tistory/selectors.ts
 *
 * 티스토리 UI 변경 시 이 파일만 수정하면 모든 자동화가 정상화됩니다.
 */
export const SELECTORS = {
    // 글쓰기 버튼 (관리자 페이지)
    writeBtn: 'a[href*="/manage/post/write"], a.btn_tistory.btn_write',
    // 에디터 모드 전환
    modeMenu: '#editor-mode-select',
    htmlMode: 'li[data-mode="html"]',
    // 에디터 내부 (Monaco)
    monacoEditor: '.monaco-editor',
    monacoInput: '.monaco-editor textarea.minimap-input',
    // 기본 필드
    title: '#post-title-field, input.tf_title',
    // 발행 버튼
    publishBtn: '#publish-layer-open, button.btn_publish',
    confirmBtn: '#publish-btn, button.btn_confirm'
};
//# sourceMappingURL=selectors.js.map