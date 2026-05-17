import { Router } from 'express';

const router = Router();

// Cloud Selector Registry - Phase 1
// 티스토리 UI 변경 시 익스텐션 재배포 없이 여기서 바로 수정 가능
const SELECTOR_REGISTRY = {
  version: '2026.05.13-v3-cloud',
  tistory: {
    // 1. 제목 입력란 (우선순위 순서)
    TITLE: [
      { selector: '#post-title-inp', version: '2026-textarea' },
      { selector: '#post-title-0', version: '2026-block' },
      { selector: '.title-input input', version: 'legacy' },
      { selector: 'input[placeholder="제목을 입력하세요."]', version: 'standard' },
      { selector: 'input[placeholder="제목을 입력하세요"]', version: 'standard' },
      { selector: '.textarea_input', version: 'mobile' },
      { selector: '#post-title-dashboard', version: 'dashboard' },
      { selector: 'input.tf_title', version: 'classic' },
      { selector: '#title', version: 'legacy' },
      { selector: 'div[contenteditable="true"].title_area', version: 'modern-editable' }
    ],

    // 2. 본문 에디터 (Iframe 방식)
    IFRAME_EDITOR: [
      { selector: '#editor-tistory_ifr', version: 'tinymce' },
      { selector: 'iframe.cke_wysiwyg_frame', version: 'ckeditor' },
      { selector: 'iframe[title="에디터"]', version: 'standard' },
      { selector: 'iframe.editor-tistory', version: 'legacy' }
    ],

    // 3. 본문 에디터 (Block/Direct 방식)
    BLOCK_EDITOR: [
      { selector: '.content_editable', version: '2026-new' },
      { selector: '#editor-root [contenteditable="true"]', version: '2026-standard' },
      { selector: '.editor_area [contenteditable="true"]', version: 'legacy-block' },
      { selector: '[contenteditable="true"]', version: 'generic' }
    ],

    // 4. 카테고리 선택
    CATEGORY_SELECT: [
      { selector: 'select[name="category"]', version: 'standard' },
      { selector: '#category', version: 'legacy' }
    ],

    // 5. 발행 버튼
    PUBLISH_TRIGGER: [
      { selector: 'button.btn_publish', version: 'standard' },
      { selector: '.publish_btn', version: 'legacy' },
      { text: '발행', version: 'text-match' }
    ],

    // 6. 대표 이미지 설정
    REPRESENTATIVE_IMAGE_BTN: [
      { selector: 'button.btn_represent', version: 'standard' },
      { selector: '.btn_represent', version: 'legacy' },
      { text: '대표', version: 'text-match' },
      { selector: '.thumb_selected', version: 'indicator' }
    ]
  }
};

router.get('/selectors', (req, res) => {
  res.json({
    success: true,
    data: SELECTOR_REGISTRY
  });
});

export default router;
