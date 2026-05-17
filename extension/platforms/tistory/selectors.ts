/**
 * MAZA OS — platforms/tistory/selectors.ts
 * 
 * 티스토리 UI 변경 시 이 파일만 수정하면 모든 자동화가 정상화됩니다.
 */

export const SELECTORS = {
  // 글쓰기 버튼 (관리자 페이지)
  writeBtn: 'a[href*="/manage/post/write"], a[href*="/manage/page/write"], a[href$="/manage/page"], a.btn_tistory.btn_write',
  
  // 에디터 모드 전환
  modeMenu: '#editor-mode-select',
  htmlMode: 'li[data-mode="html"]',
  
  // 에디터 내부 (Monaco) - [I2] minimap-input이 아닌 실제 편집 영역 .inputarea 타겟팅
  monacoEditor: '.monaco-editor',
  monacoInput: '.monaco-editor .inputarea',
  
  // 기본 필드
  title: '#post-title-field, input.tf_title, textarea.tf_tit, .tf_tit, [placeholder*="제목"], .ph_tit',
  
  // 발행 버튼
  publishBtn: '#publish-layer-open, button.btn_publish, button.btn_done, .btn_done, .btn_publish',
  confirmBtn: '#publish-btn, button.btn_confirm, button.btn_done, .btn_confirm, .btn_done',
  
  // 태그 필드
  tagInput: '#post-tag-field, .tf_tag, [placeholder*="태그"], .ph_tag, .tag_input'
};
