/**
 * MAZA OS — utils/screenshot.ts
 * 
 * 실패의 순간을 기록하여 디버깅 지옥을 끝냅니다.
 */

export async function captureErrorState(): Promise<string | null> {
  // [B2] MV3에서는 Promise 형태 권장
  try {
    return await chrome.tabs.captureVisibleTab({ format: 'png' });
  } catch (e) {
    return null;
  }
}
