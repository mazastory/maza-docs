function injectToMainWorld(data) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        try {
          let content = '';
          let isMonaco = false;
          let isCodeMirror = false;
          
          if (window.monaco && window.monaco.editor && window.monaco.editor.getModels().length > 0) {
            isMonaco = true;
            content = window.monaco.editor.getModels()[0].getValue();
          } else if (document.querySelector('.CodeMirror')) {
            isCodeMirror = true;
            content = document.querySelector('.CodeMirror').CodeMirror.getValue();
          } else {
            throw new Error("에디터(Monaco/CodeMirror)를 찾을 수 없습니다.");
          }

          const headIndex = content.indexOf("<head>");
          if (headIndex === -1) throw new Error("<head> 태그를 찾을 수 없습니다.");

          const newContent = content.slice(0, headIndex + 6) + "\\n" + ${JSON.stringify(data.html)} + content.slice(headIndex + 6);

          if (isMonaco) {
            window.monaco.editor.getModels()[0].setValue(newContent);
          } else if (isCodeMirror) {
            document.querySelector('.CodeMirror').CodeMirror.setValue(newContent);
          }

          // 저장 버튼 클릭
          const saveBtn = document.querySelector('.btn_apply') || document.querySelector('#btn_save') || document.querySelector('button.apply');
          if (saveBtn) saveBtn.click();

          document.dispatchEvent(new CustomEvent('MAZA_INJECT_SUCCESS'));
        } catch (e) {
          document.dispatchEvent(new CustomEvent('MAZA_INJECT_ERROR', { detail: e.message }));
        }
      })();
    `;
    
    document.addEventListener('MAZA_INJECT_SUCCESS', () => resolve({ok: true}), {once: true});
    document.addEventListener('MAZA_INJECT_ERROR', (e) => reject(new Error(e.detail)), {once: true});
    
    document.body.appendChild(script);
    script.remove();
  });
}
