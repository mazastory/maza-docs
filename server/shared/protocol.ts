/**
 * Maza Bridge v3 — shared/protocol.ts
 * 서버 ↔ 익스텐션 간 메시지 프로토콜 정의
 */

// 서버 → 익스텐션
export const SERVER_EVENTS = {
  RUN_ACTION: 'RUN_ACTION',
  PING:       'PING',
};

// 익스텐션 → 서버
export const CLIENT_EVENTS = {
  EXTENSION_CONNECTED: 'EXTENSION_CONNECTED',
  ACTION_RESULT:       'ACTION_RESULT',
  ACTION_ERROR:        'ACTION_ERROR',
  PONG:                'PONG',
  PAGE_STATUS:         'PAGE_STATUS',
};

// DOM 액션 종류
export const DOM_ACTIONS = {
  INPUT_TITLE:    'INPUT_TITLE',
  INPUT_CONTENT:  'INPUT_CONTENT',
  CLICK_PUBLISH:  'CLICK_PUBLISH',
  EXTRACT_HTML:   'EXTRACT_HTML',
  DETECT_PLATFORM:'DETECT_PLATFORM',
  SCREENSHOT:     'SCREENSHOT',
};
