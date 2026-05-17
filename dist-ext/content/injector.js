"use strict";
(() => {
  // extension/platforms/tistory/selectors.ts
  var SELECTORS = {
    // 글쓰기 버튼 (관리자 페이지)
    writeBtn: 'a[href*="/manage/post/write"], a[href*="/manage/page/write"], a[href$="/manage/page"], a.btn_tistory.btn_write',
    // 에디터 모드 전환
    modeMenu: "#editor-mode-select",
    htmlMode: 'li[data-mode="html"]',
    // 에디터 내부 (Monaco) - [I2] minimap-input이 아닌 실제 편집 영역 .inputarea 타겟팅
    monacoEditor: ".monaco-editor",
    monacoInput: ".monaco-editor .inputarea",
    // 기본 필드
    title: '#post-title-field, input.tf_title, textarea.tf_tit, .tf_tit, [placeholder*="\uC81C\uBAA9"], .ph_tit',
    // 발행 버튼
    publishBtn: "#publish-layer-open, button.btn_publish, button.btn_done, .btn_done, .btn_publish",
    confirmBtn: "#publish-btn, button.btn_confirm, button.btn_done, .btn_confirm, .btn_done",
    // 태그 필드
    tagInput: '#post-tag-field, .tf_tag, [placeholder*="\uD0DC\uADF8"], .ph_tag, .tag_input'
  };

  // extension/utils/dom.ts
  function findAnywhere(selector, root = document) {
    const el = root.querySelector(selector);
    if (el) return el;
    const iframes = root.querySelectorAll("iframe, frame");
    for (const iframe of Array.from(iframes)) {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          const found = findAnywhere(selector, doc);
          if (found) return found;
        }
      } catch (e) {
      }
    }
    const allElements = root.querySelectorAll("*");
    for (const node of Array.from(allElements)) {
      if (node.shadowRoot) {
        const found = findAnywhere(selector, node.shadowRoot);
        if (found) return found;
      }
    }
    return null;
  }
  function findByTextAnywhere(text, root = document) {
    const all = root.querySelectorAll("button, a, div, span, p");
    for (const el of Array.from(all)) {
      if (el.textContent?.includes(text)) {
        return el;
      }
    }
    const iframes = root.querySelectorAll("iframe, frame");
    for (const iframe of Array.from(iframes)) {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          const found = findByTextAnywhere(text, doc);
          if (found) return found;
        }
      } catch (e) {
      }
    }
    return null;
  }
  async function clickAnywhere(target) {
    const el = typeof target === "string" ? findAnywhere(target) : target;
    if (el) {
      el.click();
      return true;
    }
    return false;
  }
  function notifyProgress(step, detail) {
    chrome.runtime.sendMessage({
      type: "MAZA_INFRA_PROGRESS",
      step,
      detail,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }).catch(() => {
    });
  }
  async function waitForElement(selector, timeout = 1e4) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = findAnywhere(selector);
      if (el) return el;
      await new Promise((r) => setTimeout(r, 1e3));
    }
    return null;
  }

  // extension/platforms/tistory/publish.ts
  async function injectContent(title, html) {
    console.log("[MAZA Tistory] Starting Full Autopilot Injection...");
    let cleanHtml = html.trim();
    const titleText = title.trim();
    const titlePatterns = [
      new RegExp(`^<h1[^>]*>\\s*${titleText}\\s*<\\/h1>`, "i"),
      new RegExp(`^<h2[^>]*>\\s*${titleText}\\s*<\\/h2>`, "i"),
      new RegExp(`^<p[^>]*>\\s*<b>\\s*${titleText}\\s*<\\/b>\\s*<\\/p>`, "i"),
      new RegExp(`^<b>\\s*${titleText}\\s*<\\/b>`, "i"),
      new RegExp(`^<strong>\\s*${titleText}\\s*<\\/strong>`, "i")
    ];
    for (const pattern of titlePatterns) {
      if (pattern.test(cleanHtml)) {
        console.log("[MAZA Tistory] Deduplicated title from body content.");
        cleanHtml = cleanHtml.replace(pattern, "").trim();
        break;
      }
    }
    const cancelDraftBtn = document.querySelector(".btn_layer.btn_cancel, .layer_post .btn_cancel");
    if (cancelDraftBtn) {
      console.log("[MAZA Tistory] Draft recovery popup detected. Dismissing...");
      cancelDraftBtn.click();
      await new Promise((r) => setTimeout(r, 1e3));
    }
    const titleEl = await waitForElement(SELECTORS.title, 5e3);
    if (!titleEl) {
      console.log("[MAZA Tistory] Title not found. Checking if we are on a list page...");
      const listWriteBtn = await waitForElement(SELECTORS.writeBtn, 3e3);
      if (listWriteBtn) {
        console.log("[MAZA Tistory] List page detected. Clicking Write button...");
        listWriteBtn.click();
        return { ok: true, status: "NAVIGATING_TO_EDITOR" };
      }
      const forceEditor = document.querySelector("#editor-root, #tinymce, .CodeMirror");
      if (forceEditor) {
        console.log("[MAZA Tistory] Force editor detected but title missing. Continuing anyway...");
      } else {
        console.error("[MAZA Tistory] Title element not found after timeout.");
        return { ok: false, error: "TITLE_NOT_FOUND" };
      }
    }
    if (titleEl) {
      if (titleEl.tagName === "TEXTAREA" || titleEl.tagName === "INPUT") {
        titleEl.value = title;
      } else {
        titleEl.innerHTML = title;
      }
      titleEl.dispatchEvent(new Event("input", { bubbles: true }));
      titleEl.dispatchEvent(new Event("change", { bubbles: true }));
      console.log("[MAZA Tistory] Title injected.");
    }
    const editorSelectors = [
      SELECTORS.monacoInput,
      '#editor-root div[contenteditable="true"]',
      'div[contenteditable="true"]',
      "#tinymce",
      "body#tinymce",
      'iframe[id*="editor"]',
      'iframe[id*="tistory"]',
      "#tinymce_ifr",
      ".content_editable",
      '[contenteditable="true"]',
      "textarea.tf_tit",
      ".CodeMirror-code"
    ];
    let injected = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      for (const selector of editorSelectors) {
        const el = findAnywhere(selector);
        if (!el) continue;
        console.log(`[MAZA Tistory] Attempting injection via: ${selector} (Attempt ${attempt + 1})`);
        try {
          if (el.tagName === "IFRAME") {
            const doc = el.contentDocument || el.contentWindow?.document;
            if (doc && doc.body) {
              try {
                doc.body.focus();
                doc.execCommand("selectAll", false, null);
                const success = doc.execCommand("insertHTML", false, cleanHtml);
                if (success) {
                  console.log("[MAZA Tistory] Injected iframe successfully using execCommand");
                  injected = true;
                } else {
                  throw new Error("execCommand inside iframe returned false");
                }
              } catch (iframeErr) {
                console.warn("[MAZA Tistory] execCommand inside iframe failed, falling back to innerHTML:", iframeErr);
                doc.body.innerHTML = cleanHtml;
                injected = true;
              }
              doc.body.dispatchEvent(new Event("input", { bubbles: true }));
              doc.body.dispatchEvent(new Event("change", { bubbles: true }));
            }
          } else if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
            el.value = cleanHtml;
            el.dispatchEvent(new Event("input", { bubbles: true }));
            el.dispatchEvent(new Event("change", { bubbles: true }));
            injected = true;
          } else {
            try {
              el.focus();
              document.execCommand("selectAll", false, null);
              const success = document.execCommand("insertHTML", false, cleanHtml);
              if (success) {
                console.log("[MAZA Tistory] Injected successfully using document.execCommand(insertHTML)");
                injected = true;
              } else {
                throw new Error("execCommand returned false");
              }
            } catch (execErr) {
              console.warn("[MAZA Tistory] execCommand failed, falling back to innerHTML:", execErr);
              el.innerHTML = cleanHtml;
              injected = true;
            }
            el.dispatchEvent(new Event("input", { bubbles: true }));
            el.dispatchEvent(new Event("change", { bubbles: true }));
          }
        } catch (e) {
          console.warn(`[MAZA Tistory] Injection failed for ${selector}:`, e);
        }
        if (injected) break;
      }
      if (injected) break;
      await new Promise((r) => setTimeout(r, 1500));
    }
    if (!injected) {
      console.log("[MAZA Tistory] No specific editor found. Searching for any valid iframe...");
      const allIframes = document.querySelectorAll("iframe");
      for (const ifr of Array.from(allIframes)) {
        try {
          const doc = ifr.contentDocument || ifr.contentWindow?.document;
          if (doc && doc.body && (doc.body.contentEditable === "true" || doc.designMode === "on" || doc.body.classList.contains("mce-content-body"))) {
            doc.body.innerHTML = cleanHtml;
            injected = true;
            console.log("[MAZA Tistory] Injected via fallback iframe detection.");
            break;
          }
        } catch (e) {
        }
      }
    }
    const plainText = cleanHtml.replace(/<[^>]*>?/gm, " ");
    const hashtagRegex = /#([a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣_]+)/g;
    const foundTags = [];
    let match;
    while ((match = hashtagRegex.exec(plainText)) !== null) {
      const tag = match[1];
      const isHex = /^[0-9a-fA-F]{3,6}$/.test(tag);
      if (!isHex && tag.toLowerCase() !== "toc" && !foundTags.includes(tag)) {
        foundTags.push(tag);
      }
    }
    if (foundTags.length > 0) {
      console.log("[MAZA Tistory] Found hashtags:", foundTags);
      const lastPart = cleanHtml.slice(-1e3);
      let cleanedLastPart = lastPart;
      for (const tag of foundTags) {
        const tagRegex = new RegExp(`(?<=>|\\s)#${tag}(?=<|\\s|$)`, "g");
        cleanedLastPart = cleanedLastPart.replace(tagRegex, "");
      }
      cleanedLastPart = cleanedLastPart.replace(/<p>(?:\s|&nbsp;)*<\/p>/g, "");
      cleanHtml = cleanHtml.slice(0, -1e3) + cleanedLastPart;
    }
    if (foundTags.length > 0) {
      const tagInput = await waitForElement(SELECTORS.tagInput, 3e3);
      if (tagInput) {
        console.log("[MAZA Tistory] Injecting tags to native field...");
        const tagString = foundTags.join(",");
        if (tagInput.tagName === "INPUT" || tagInput.tagName === "TEXTAREA") {
          tagInput.value = tagString;
        } else {
          tagInput.innerText = tagString;
        }
        tagInput.dispatchEvent(new Event("input", { bubbles: true }));
        tagInput.dispatchEvent(new Event("change", { bubbles: true }));
        tagInput.dispatchEvent(new KeyboardEvent("keydown", { key: ",", keyCode: 188, bubbles: true }));
        tagInput.dispatchEvent(new KeyboardEvent("keyup", { key: ",", keyCode: 188, bubbles: true }));
      }
    }
    if (!injected) {
      console.error("[MAZA Tistory] No editor found among selectors.");
      return { ok: false, error: "EDITOR_NOT_FOUND" };
    }
    console.log("[MAZA Tistory] Triggering Publish Flow...");
    let layerOpened = false;
    for (let i = 0; i < 3; i++) {
      layerOpened = await clickAnywhere(SELECTORS.publishBtn);
      if (!layerOpened) {
        const fallbackBtn = findByTextAnywhere("\uC644\uB8CC") || findByTextAnywhere("\uBC1C\uD589");
        if (fallbackBtn) {
          layerOpened = await clickAnywhere(fallbackBtn);
        }
      }
      if (layerOpened) break;
      await new Promise((r) => setTimeout(r, 1e3));
    }
    if (!layerOpened) {
      console.warn("[MAZA Tistory] Could not find publish button, stopping at injection.");
      return { ok: true, status: "INJECTED_ONLY" };
    }
    await new Promise((r) => setTimeout(r, 1500));
    let confirmed = false;
    for (let i = 0; i < 3; i++) {
      confirmed = await clickAnywhere(SELECTORS.confirmBtn);
      if (!confirmed) {
        const fallbackConfirm = findByTextAnywhere("\uBC1C\uD589") || findByTextAnywhere("\uD655\uC778");
        if (fallbackConfirm) {
          confirmed = await clickAnywhere(fallbackConfirm);
        }
      }
      if (confirmed) {
        console.log("[MAZA Tistory] Publish confirmed. Waiting for navigation...");
        await new Promise((r) => setTimeout(r, 2e3));
        if (window.location.href.includes("/manage/post/write") || window.location.href.includes("/manage/page/write")) {
          console.log("[MAZA Tistory] Still on editor page, retrying final click...");
          continue;
        }
        break;
      }
      await new Promise((r) => setTimeout(r, 1e3));
    }
    return { ok: true, status: "PUBLISHED", published_url: window.location.href };
  }

  // extension/platforms/tistory/infra.ts
  async function autoAcceptTistoryDialog() {
    await new Promise((resolve) => {
      chrome.runtime.sendMessage({
        type: "EXECUTE_MAIN_WORLD",
        funcId: "autoAcceptDialog"
      }, (res) => resolve(res));
    });
  }
  async function injectViaMainWorld(html) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        type: "EXECUTE_MAIN_WORLD",
        funcId: "injectInfra",
        args: [html]
      }, (res) => {
        resolve(res || { ok: false, error: "No response from background script" });
      });
    });
  }
  async function injectInfra(html) {
    try {
      console.log("[MAZA OS] Starting Infra Injection...");
      notifyProgress("STARTING");
      if (window.location.href.includes("/auth/login")) {
        throw new Error("\uD2F0\uC2A4\uD1A0\uB9AC\uC5D0 \uB85C\uADF8\uC778\uB418\uC5B4 \uC788\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uB85C\uADF8\uC778 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
      }
      const hasEditor = findAnywhere(".CodeMirror, .cm-editor, #htmlEditor");
      if (!hasEditor) {
        console.log("[MAZA OS] Editor not visible. Trying to navigate to HTML edit mode...");
        notifyProgress("BUTTON_CLICKED");
        await autoAcceptTistoryDialog();
        const htmlEditBtn = findByTextAnywhere("html \uD3B8\uC9D1") || findByTextAnywhere("HTML \uD3B8\uC9D1") || findAnywhere('[href*="source/html"], [data-tab="html"]');
        if (htmlEditBtn) {
          await clickAnywhere(htmlEditBtn);
          console.log("[MAZA OS] HTML edit button clicked.");
        }
        const appeared = await waitForElement(".CodeMirror, .cm-editor, textarea", 15e3);
        if (!appeared) {
          throw new Error("HTML \uC5D0\uB514\uD130\uB97C \uC5F4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC2A4\uD0A8 \uD3B8\uC9D1 \uD398\uC774\uC9C0\uC5D0\uC11C \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
        }
      }
      notifyProgress("EDITOR_READY");
      console.log("[MAZA OS] Injecting via MAIN World script...");
      const injectResult = await injectViaMainWorld(html);
      if (!injectResult.ok) {
        throw new Error(injectResult.error || "CodeMirror \uC8FC\uC785 \uC2E4\uD328");
      }
      if (injectResult.step === "ALREADY_INJECTED") {
        console.log("[MAZA OS] Infra already injected.");
        notifyProgress("ALREADY_INJECTED");
        return { ok: true, step: "ALREADY_INJECTED" };
      }
      notifyProgress("CODE_INJECTED");
      console.log("[MAZA OS] Code injected successfully. Clicking apply button...");
      await new Promise((r) => setTimeout(r, 800));
      const applyBtn = findByTextAnywhere("\uC801\uC6A9") || findByTextAnywhere("\uC800\uC7A5") || findAnywhere('button[type="submit"]');
      if (applyBtn) {
        notifyProgress("SAVE_CLICKED");
        await clickAnywhere(applyBtn);
        console.log("[MAZA OS] Apply button clicked.");
      } else {
        console.warn("[MAZA OS] Apply button not found. Manual save required.");
      }
      notifyProgress("SUCCESS");
      return { ok: true, step: "SUCCESS" };
    } catch (err) {
      console.error("[MAZA OS] Infra injection failed:", err);
      notifyProgress("ERROR", err.message);
      return { ok: false, error: err.message };
    }
  }

  // extension/content/injector.ts
  console.log("%c[MAZA OS] Tistory Injector Active!", "color: #8b5cf6; font-weight: bold; font-size: 14px;");
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log(`[MAZA OS] Message Received: ${msg.type}`);
    if (msg.type === "RUN_TASK") {
      handleTask(msg.task).then(sendResponse).catch((err) => sendResponse({ ok: false, error: err.message }));
      return true;
    }
  });
  var readyAttempts = 0;
  function announceReady() {
    if (readyAttempts++ > 10) {
      console.warn("[MAZA OS] Gave up sending READY signal after 10 attempts.");
      return;
    }
    console.log("[MAZA OS] Sending READY signal to background...");
    chrome.runtime.sendMessage({ type: "CONTENT_SCRIPT_READY" }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn("[MAZA OS] Background not ready yet, retrying in 1s...");
        setTimeout(announceReady, 1e3);
      } else {
        console.log("[MAZA OS] READY signal acknowledged by background.");
      }
    });
  }
  announceReady();
  async function handleTask(task) {
    console.log(`[MAZA OS] Received Task: ${task.type}`);
    if (task.platform === "tistory") {
      if (task.type === "PUBLISH_POST") {
        return injectContent(task.payload.title, task.payload.body || task.payload.html);
      }
      if (task.type === "INFRA_INJECT") {
        return injectInfra(task.payload.html);
      }
    }
    return { ok: false, error: "Unknown Task" };
  }
})();
//# sourceMappingURL=injector.js.map
