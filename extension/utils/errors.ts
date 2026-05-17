/**
 * MAZA OS — utils/errors.ts
 * 
 * 실패 원인을 정밀하게 분류하여 복구 전략을 결정합니다.
 */

export type MazaErrorCode = 
  | 'EDITOR_NOT_FOUND' 
  | 'LOGIN_REQUIRED' 
  | 'NETWORK_ERROR' 
  | 'PUBLISH_FAILED' 
  | 'TIMEOUT';

export class MazaError extends Error {
  code: MazaErrorCode;
  
  constructor(code: MazaErrorCode, message: string) {
    super(message);
    this.name = 'MazaError';
    this.code = code;
  }
}
