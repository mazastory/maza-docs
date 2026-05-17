/**
 * MAZA OS — platforms/tistory/publish.ts
 * 
 * 티스토리 전용 포스팅 실행 로직.
 */

import { SELECTORS } from './selectors.js';
import { findAnywhere, clickAnywhere, waitForElement, findByTextAnywhere } from '../../utils/dom.js';

export async function injectContent(title: string, html: string) {
  console.log('[MAZA Tistory] Starting Full Autopilot Injection...');

  // [Dedupe] 본문 상단에 제목이 중복 포함되어 있으면 제거
  let cleanHtml = html.trim();
  const titleText = title.trim();
  
  // <h1>제목</h1>, <h2>제목</h2>, <b>제목</b> 또는 단순 텍스트 매칭 제거
  const titlePatterns = [
    new RegExp(`^<h1[^>]*>\\s*${titleText}\\s*<\\/h1>`, 'i'),
    new RegExp(`^<h2[^>]*>\\s*${titleText}\\s*<\\/h2>`, 'i'),
    new RegExp(`^<p[^>]*>\\s*<b>\\s*${titleText}\\s*<\\/b>\\s*<\\/p>`, 'i'),
    new RegExp(`^<b>\\s*${titleText}\\s*<\\/b>`, 'i'),
    new RegExp(`^<strong>\\s*${titleText}\\s*<\\/strong>`, 'i')
  ];

  for (const pattern of titlePatterns) {
    if (pattern.test(cleanHtml)) {
      console.log('[MAZA Tistory] Deduplicated title from body content.');
      cleanHtml = cleanHtml.replace(pattern, '').trim();
      break;
    }
  }

  // [FIX] 티스토리 "임시 저장된 글이 있습니다" 팝업 자동 취소
  const cancelDraftBtn = document.querySelector('.btn_layer.btn_cancel, .layer_post .btn_cancel') as HTMLElement;
  if (cancelDraftBtn) {
    console.log('[MAZA Tistory] Draft recovery popup detected. Dismissing...');
    cancelDraftBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // 1. 제목 입력 (최대 5초 대기 후 없으면 목록 페이지인지 확인)
  const titleEl = await waitForElement(SELECTORS.title, 5000);
  if (!titleEl) {
    console.log('[MAZA Tistory] Title not found. Checking if we are on a list page...');
    // [FIX] More robust button detection for list pages
    const listWriteBtn = await waitForElement(SELECTORS.writeBtn, 3000);
    if (listWriteBtn) {
      console.log('[MAZA Tistory] List page detected. Clicking Write button...');
      (listWriteBtn as HTMLElement).click();
      return { ok: true, status: 'NAVIGATING_TO_EDITOR' };
    }
    
    // [I5] 만약 목록 버튼도 없으면 현재 페이지가 에디터인지 한 번 더 강제 탐색
    const forceEditor = document.querySelector('#editor-root, #tinymce, .CodeMirror');
    if (forceEditor) {
      console.log('[MAZA Tistory] Force editor detected but title missing. Continuing anyway...');
    } else {
      console.error('[MAZA Tistory] Title element not found after timeout.');
      return { ok: false, error: 'TITLE_NOT_FOUND' };
    }
  }

  if (titleEl) {
    if (titleEl.tagName === 'TEXTAREA' || titleEl.tagName === 'INPUT') {
      (titleEl as any).value = title;
    } else {
      titleEl.innerHTML = title;
    }
    titleEl.dispatchEvent(new Event('input', { bubbles: true }));
    titleEl.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('[MAZA Tistory] Title injected.');
  }

  // 2. 본문 주입
  const editorSelectors = [
    SELECTORS.monacoInput,
    '#editor-root div[contenteditable="true"]',
    'div[contenteditable="true"]',
    '#tinymce',
    'body#tinymce',
    'iframe[id*="editor"]',
    'iframe[id*="tistory"]',
    '#tinymce_ifr',
    '.content_editable',
    '[contenteditable="true"]',
    'textarea.tf_tit',
    '.CodeMirror-code'
  ];

  let injected = false;
  // [I6] Try multiple times to handle async editor loading
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const selector of editorSelectors) {
      const el = findAnywhere(selector) as any;
      if (!el) continue;

      console.log(`[MAZA Tistory] Attempting injection via: ${selector} (Attempt ${attempt + 1})`);

      try {
        // 1. If it's an iframe, try to inject into its body
        if (el.tagName === 'IFRAME') {
          const doc = el.contentDocument || el.contentWindow?.document;
          if (doc && doc.body) {
            try {
              doc.body.focus();
              doc.execCommand('selectAll', false, null);
              const success = doc.execCommand('insertHTML', false, cleanHtml);
              if (success) {
                console.log('[MAZA Tistory] Injected iframe successfully using execCommand');
                injected = true;
              } else {
                throw new Error('execCommand inside iframe returned false');
              }
            } catch (iframeErr) {
              console.warn('[MAZA Tistory] execCommand inside iframe failed, falling back to innerHTML:', iframeErr);
              doc.body.innerHTML = cleanHtml;
              injected = true;
            }
            doc.body.dispatchEvent(new Event('input', { bubbles: true }));
            doc.body.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } 
        // 2. If it's a textarea or input
        else if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
          el.value = cleanHtml;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          injected = true;
        } 
        // 3. Normal contenteditable (ProseMirror / React state synchronization support)
        else {
          try {
            el.focus();
            document.execCommand('selectAll', false, null);
            const success = document.execCommand('insertHTML', false, cleanHtml);
            if (success) {
              console.log('[MAZA Tistory] Injected successfully using document.execCommand(insertHTML)');
              injected = true;
            } else {
              throw new Error('execCommand returned false');
            }
          } catch (execErr) {
            console.warn('[MAZA Tistory] execCommand failed, falling back to innerHTML:', execErr);
            el.innerHTML = cleanHtml;
            injected = true;
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } catch (e) {
        console.warn(`[MAZA Tistory] Injection failed for ${selector}:`, e);
      }

      if (injected) break;
    }
    if (injected) break;
    await new Promise(r => setTimeout(r, 1500)); // Wait for editor to stabilize
  }

  // Final Fallback: Search for ANY iframe if nothing found yet
  if (!injected) {
    console.log('[MAZA Tistory] No specific editor found. Searching for any valid iframe...');
    const allIframes = document.querySelectorAll('iframe');
    for (const ifr of Array.from(allIframes)) {
      try {
        const doc = ifr.contentDocument || ifr.contentWindow?.document;
        if (doc && doc.body && (doc.body.contentEditable === 'true' || doc.designMode === 'on' || doc.body.classList.contains('mce-content-body'))) {
          doc.body.innerHTML = cleanHtml;
          injected = true;
          console.log('[MAZA Tistory] Injected via fallback iframe detection.');
          break;
        }
      } catch (e) {}
    }
  }

  // 3. 해시태그 추출 및 본문 정제
  // HTML 태그 외부의 텍스트에서만 해시태그를 찾기 위해 단순화된 방식 사용
  const plainText = cleanHtml.replace(/<[^>]*>?/gm, ' ');
  const hashtagRegex = /#([a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣_]+)/g;
  const foundTags: string[] = [];
  let match;
  while ((match = hashtagRegex.exec(plainText)) !== null) {
    const tag = match[1];
    // hex color 코드(예: ffffff, 1e293b)나 toc 등은 제외
    const isHex = /^[0-9a-fA-F]{3,6}$/.test(tag);
    if (!isHex && tag.toLowerCase() !== 'toc' && !foundTags.includes(tag)) {
      foundTags.push(tag);
    }
  }

  // 본문 하단의 해시태그 뭉치 제거 (HTML 속성이 손상되지 않도록 안전하게 치환)
  if (foundTags.length > 0) {
    console.log('[MAZA Tistory] Found hashtags:', foundTags);
    const lastPart = cleanHtml.slice(-1000);
    let cleanedLastPart = lastPart;
    
    // 찾은 실제 해시태그들만 안전하게 제거 (앞에 띄어쓰기나 > 가 있는 경우만)
    for (const tag of foundTags) {
      const tagRegex = new RegExp(`(?<=>|\\s)#${tag}(?=<|\\s|$)`, 'g');
      cleanedLastPart = cleanedLastPart.replace(tagRegex, '');
    }
    // 빈 p 태그 정리
    cleanedLastPart = cleanedLastPart.replace(/<p>(?:\s|&nbsp;)*<\/p>/g, '');
    
    cleanHtml = cleanHtml.slice(0, -1000) + cleanedLastPart;
  }

  // 4. 태그 주입
  if (foundTags.length > 0) {
    const tagInput = await waitForElement(SELECTORS.tagInput, 3000);
    if (tagInput) {
      console.log('[MAZA Tistory] Injecting tags to native field...');
      const tagString = foundTags.join(',');
      if (tagInput.tagName === 'INPUT' || tagInput.tagName === 'TEXTAREA') {
        (tagInput as any).value = tagString;
      } else {
        tagInput.innerText = tagString;
      }
      tagInput.dispatchEvent(new Event('input', { bubbles: true }));
      tagInput.dispatchEvent(new Event('change', { bubbles: true }));
      // 티스토리는 콤마나 엔터를 쳐야 등록되는 경우가 많음
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: ',', keyCode: 188, bubbles: true }));
      tagInput.dispatchEvent(new KeyboardEvent('keyup', { key: ',', keyCode: 188, bubbles: true }));
    }
  }

  if (!injected) {
    console.error('[MAZA Tistory] No editor found among selectors.');
    return { ok: false, error: 'EDITOR_NOT_FOUND' };
  }

  // 3. 자동 발행 (Autopilot)
  console.log('[MAZA Tistory] Triggering Publish Flow...');
  
  // 발행 레이어 열기 (또는 페이지 완료 버튼)
  let layerOpened = false;
  for (let i = 0; i < 3; i++) {
    layerOpened = await clickAnywhere(SELECTORS.publishBtn);
    if (!layerOpened) {
      const fallbackBtn = findByTextAnywhere('완료') || findByTextAnywhere('발행');
      if (fallbackBtn) {
        layerOpened = await clickAnywhere(fallbackBtn);
      }
    }
    if (layerOpened) break;
    await new Promise(r => setTimeout(r, 1000));
  }

  if (!layerOpened) {
    console.warn('[MAZA Tistory] Could not find publish button, stopping at injection.');
    return { ok: true, status: 'INJECTED_ONLY' };
  }

  // 발행 확정 버튼 대기 및 클릭 (레이어가 있는 경우)
  await new Promise(r => setTimeout(r, 1500));
  
  let confirmed = false;
  for (let i = 0; i < 3; i++) {
    confirmed = await clickAnywhere(SELECTORS.confirmBtn);
    if (!confirmed) {
      const fallbackConfirm = findByTextAnywhere('발행') || findByTextAnywhere('확인');
      if (fallbackConfirm) {
        confirmed = await clickAnywhere(fallbackConfirm);
      }
    }
    
    if (confirmed) {
      console.log('[MAZA Tistory] Publish confirmed. Waiting for navigation...');
      await new Promise(r => setTimeout(r, 2000));
      // 만약 여전히 같은 URL이면 한 번 더 클릭 시도 (티스토리 간헐적 무시 대응)
      // [I3] 여전히 에디터 URL이면 한 번 더 클릭 시도 (발행 성공 시 보통 목록으로 리다이렉트됨)
      if (window.location.href.includes('/manage/post/write') || window.location.href.includes('/manage/page/write')) {
        console.log('[MAZA Tistory] Still on editor page, retrying final click...');
        continue; 
      }
      break;
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  
  return { ok: true, status: 'PUBLISHED', published_url: window.location.href };
}
