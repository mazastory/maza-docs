/**
 * MAZA OS — utils/errors.ts
 *
 * 실패 원인을 정밀하게 분류하여 복구 전략을 결정합니다.
 */
export class MazaError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.name = 'MazaError';
        this.code = code;
    }
}
//# sourceMappingURL=errors.js.map