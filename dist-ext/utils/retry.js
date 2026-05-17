/**
 * MAZA OS — utils/retry.ts
 *
 * 일시적인 오류(네트워크 불안정, DOM 렌더링 지연 등)를 스스로 극복합니다.
 */
import { log } from './logger.js';
export async function withRetry(fn, count = 3, delayMs = 2000) {
    let lastError;
    for (let i = 0; i < count; i++) {
        try {
            return await fn();
        }
        catch (err) {
            lastError = err;
            log('RETRY', `Attempt ${i + 1}/${count} failed. Retrying in ${delayMs}ms...`);
            await new Promise(r => setTimeout(r, delayMs));
        }
    }
    throw lastError;
}
//# sourceMappingURL=retry.js.map