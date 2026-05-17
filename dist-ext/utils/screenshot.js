/**
 * MAZA OS — utils/screenshot.ts
 *
 * 실패의 순간을 기록하여 디버깅 지옥을 끝냅니다.
 */
export async function captureErrorState() {
    return new Promise((resolve) => {
        chrome.tabs.captureVisibleTab({ format: 'png' }, (dataUrl) => {
            resolve(dataUrl);
        });
    });
}
//# sourceMappingURL=screenshot.js.map