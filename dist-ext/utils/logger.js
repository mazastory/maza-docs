/**
 * MAZA OS — utils/logger.ts
 *
 * 모든 실행 과정을 기록하고 사이드바/서버로 전송합니다.
 */
export function log(scope, message, data) {
    const timestamp = new Date().toISOString().split('T')[1].split('Z')[0];
    const formattedMsg = `[${timestamp}] [${scope}] ${message}`;
    console.log(formattedMsg, data || '');
    // 사이드바 및 백그라운드로 로그 전송 (실시간 관제용)
    try {
        chrome.runtime.sendMessage({
            type: 'TASK_LOG',
            scope,
            message: formattedMsg,
            data
        }).catch(() => { });
    }
    catch (e) { }
}
export function error(scope, message, data) {
    console.error(`[${scope}] ❌ ${message}`, data || '');
}
//# sourceMappingURL=logger.js.map