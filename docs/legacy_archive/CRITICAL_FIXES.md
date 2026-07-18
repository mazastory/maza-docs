# MAZA Studio - Critical Fixes & Regression Memo (2026)

이 문서는 개발 중 반복적으로 발생하는 버그나 재발 방지가 필요한 핵심 로직을 기록합니다. 
에이전트는 코드 수정 시 이 문서를 먼저 확인하여 기존의 해결책을 훼손하지 않도록 주의해야 합니다.

---

## 1. 익스텐션 & 티스토리 주입 관련 (Content Injection)

### [FIX-01] 티스토리 제목 입력칸 감지 로직
- **문제**: 티스토리 에디터 버전에 따라 "제목을 입력하세요." (점 있음)와 "제목을 입력하세요" (점 없음)가 혼용됨.
- **해결**: `querySelector` 선택 시 두 가지 패턴(`input[placeholder="..."]`)을 모두 포함해야 함.
- **파일**: `extension/content_tistory.js`

### [FIX-02] 블록 에디터 (Non-Iframe) 대응
- **문제**: 최신 티스토리 에디터는 iframe을 사용하지 않고 `div[contenteditable="true"]`를 직접 사용함.
- **해결**: `iframe`이 없을 경우 `.content_editable` 또는 `[contenteditable="true"]`를 찾아 직접 DOM 주입을 시도하는 폴백 로직 필수.
- **파일**: `extension/content_tistory.js`

---

## 2. 서버 사이드 검증 관련 (Verification)

### [FIX-03] GA4 측정 ID 검증 (Infra Verification)
- **문제**: GA4 아이디(`G-XXXX`)가 HTML 소스 내에서 따옴표(`'G-...'`)에 감싸여 있거나 공백이 포함되어 검증에 실패하는 현상.
- **해결**: `ga_id.trim()`을 수행하고, 단순 매칭 외에도 따옴표 포함 패턴 등 유연한 문자열 검사를 수행해야 함.
- **파일**: `server/routes/verify.ts`

---

## 3. UI/UX 흐름 (Logical Flow)

## 1. One-click Injection (Zero-Jump Protocol)
- **Problem**: Multi-step manual process for infra setup (Refresh -> Start -> Confirm -> Find -> Apply).
- **Fix**: Remove all `alert()` and `confirm()` in extension scripts. Automate "HTML Edit" navigation and "Apply" button clicks. Use non-blocking toasts for feedback.
- **Reference**: Conversation 44baa813 (2026-05-13)

### [FIX-04] 구글 인프라 셋업 순서
- **문제**: 인증 코드 주입 전 인증 확인 버튼이 노출되어 유저가 혼란을 느낌.
- **해결**: `Setup.tsx`에서 **[익스텐션 자동 주입]** 섹션을 상단에 배치하고, **[실시간 적용 확인]** 및 **[최종 승인]** 버튼을 하단에 배치하여 논리적 동선 확보.
- **파일**: `src/pages/Setup.tsx`

### [FIX-05] GA4 측정 ID 검증 - 비동기 로딩 문제 (PERMANENT FIX)
- **근본 원인**: 티스토리는 GA4 스크립트를 **JavaScript 비동기 방식**으로 로드하기 때문에, 서버가 HTML 소스를 정적으로 가져올 때 GA4 코드가 포함되지 않음. 이것은 "코드가 없어서"가 아니라 "가져오는 방식의 한계"임.
- **절대 하면 안 되는 것**: GA4 미발견 시 빨간 에러 표시 (사용자 혼란 유발). GA4 ID를 직접 HTML에서 찾으려는 시도.
- **올바른 처리**: GA4 미발견 시 노란 경고(warning) 메시지만 표시 + "애널리틱스에서 직접 확인" 안내.
- **파일**: `server/routes/verify.ts`, `src/pages/Setup.tsx`

---
*최종 업데이트: 2026-05-13*

---

## 4. AI 글 작성 API 관련 (Gemini Model Registry)

### [FIX-06] Gemini AI 모델명 오류 → 글 작성 불가 (PERMANENT FIX)
- **근본 원인**: Google이 2026-05-16 기준 모델 가용성을 지속적으로 변경 중임. 폐기된 모델명을 사용하면 API에서 `404 Not Found`를 반환하여 글 작성이 전혀 되지 않음.
- **절대 사용 금지 모델 (404 에러 반환 - 2026-05-16 갱신)**:
  - `gemini-2.0-flash` ❌ (최근 404 에러 리포트됨)
  - `gemini-1.5-flash` / `gemini-1.5-pro` ❌
  - `gemini-2.5-flash-preview` ❌
  - `gemini-3-flash-latest` ❌
  - `gemini-3.1-flash-lite-latest` / `gemini-3.1-pro-latest` ❌
- **현재 유효한 모델 (2026-05-16 최종 확인)**:
  - `gemini-2.5-flash` ✅ **(기본 Primary — 사용자 권장)**
  - `gemini-3.1-pro-preview` ✅ (1차 Fallback / 고품질 추론용)
  - `gemini-2.5-flash` ✅ (2차 Fallback)
  - `gemini-2.5-pro` ✅ (최종 Fallback)
- **최종 확정 폴백 체인** (`aiClient.ts` 내 callAI, callAIStream 공통):
  ```
  gemini-2.5-flash → gemini-3.1-pro-preview → gemini-2.5-flash → gemini-2.5-pro → 종료(throw)
  ```
- **핵심 규칙**: `server/lib/aiClient.ts` 내 **모든 위치**를 동시에 업데이트해야 함.
- **파일**: `server/lib/aiClient.ts`
- **참조 KI**: `/Users/m/.gemini/antigravity/knowledge/ai-model-registry/artifacts/model-registry.md`

### [FIX-07] 인프라 코드(GA4/GSC) 주입 데이터 매핑 오류 (PERMANENT FIX)
- **근본 원인**: 익스텐션 사이드 패널에서 서버 API(`api/sites`) 데이터를 가져올 때, DB 스키마 필드명(`ga_measurement_id`, `sc_verification`) 대신 잘못된 필드명(`ga4_id`, `gsc_tag`)을 사용하여 주입할 코드가 `undefined`로 전달됨.
- **해결**: 사이드 패널(`side_panel.js`)의 데이터 매핑 로직을 DB 스키마와 100% 일치하도록 수정함.
- **파일**: `extension/side_panel.js`, `supabase/schema.sql`
- **핵심 규칙**: 모든 인프라 관련 데이터는 반드시 `sites` 테이블의 표준 필드명을 따르며, 익스텐션 내에서 임의로 필드명을 변경하지 말 것.

### [FIX-08] 익스텐션 업데이트 후 통신 두절 (Extension context invalidated) (PERMANENT FIX)
- **근본 원인**: `background.js` 등 익스텐션 코드를 수정하고 `chrome://extensions`에서 새로고침을 하면 기존 백그라운드 워커는 파기되고 새로 생성됨. 그러나 이미 열려 있던 웹페이지(`localhost:5174` 등)에 주입되어 있던 `content_sync.js`는 파기된 예전 워커를 계속 바라보고 있어, `chrome.runtime.sendMessage` 호출 시 조용히 실패함 ("Extension context invalidated" 에러 발생).
- **문제 증상**: 웹앱에서 "티스토리 자동 연동" 버튼을 아무리 눌러도 익스텐션 쪽으로 메시지가 가지 않아 **새 창이 열리지 않고 완전히 무반응**이 됨.
- **절대 명심할 것**: 코드 에러나 데이터 매핑 에러(`FIX-07`)가 아님. 익스텐션 업데이트 직후 작동 불능 현상이 발생하면 무조건 **현재 열려있는 웹앱 페이지(localhost)를 F5로 강력 새로고침**하여 컨텍스트를 다시 연결해야 함.
- **파일**: `extension/content_sync.js`

### [FIX-09] Zero-Jump 1-Click 자동 인프라 주입 최적화 (2026-05-13)
- **근본 원인**: 기존 인프라 주입 과정에서 티스토리 페이지 진입 후에도 플로팅 바 클릭, 확인창 등 여러 번의 수동 조작이 필요하여 "완전 자동화" 경험을 저해함.
- **해결**: 
  1. `auto_infra_running` 플래그를 도입하여 웹앱에서 트리거된 경우 티스토리 내 플로팅 바 노출을 억제하고 즉시 주입 단계로 진입.
  2. `background.js` 내의 `injectInfraScript`가 HTML 편집기 로딩 및 "적용" 버튼 클릭까지 자율적으로 수행하도록 강화.
  3. 모든 수동 `alert()` 및 `confirm()`을 비차단 토스트(`showToast`)로 대체.
  4. 웹앱(`Setup.tsx`)에 실시간 진행률(Progress Bar)을 표시하여 사용자에게 진행 상태를 투명하게 제공.
- **파일**: `extension/background.js`, `extension/content_tistory.js`, `src/pages/Setup.tsx`
- **핵심 규칙**: 자동 주입 중에는 사용자의 추가 클릭을 요구하지 말 것. 모든 과정은 12초 내외로 "무개입" 완료되어야 함.

### [FIX-10] 인프라 주입 진행률 데이터 유실 → "수동 주입 필요" 모달 항상 표시 (2026-05-13)
- **근본 원인**: `infra_setup.js`의 `_notifyWebAppTabs(messageType)` 함수가 **첫 번째 인자만 수신**하여 두 번째 인자로 전달되는 `{ step, domain, detail }` 데이터가 완전히 유실됨. 결과적으로 `content_sync.js`를 통해 `Setup.tsx`로 전달되는 `MAZA_INFRA_PROGRESS` 메시지에 `step`이 항상 `undefined`여서 진행률 바가 영원히 0%에 머묾. 35초 타임아웃 도달 후 "수동 주입이 필요합니다" 모달이 항상 표시됨.
- **해결**:
  1. `_notifyWebAppTabs(messageType, data = {})` — 두 번째 인자를 받아 메시지 객체에 `...data`로 병합
  2. `content_sync.js`에서 `step`, `domain`, `detail` 전체 필드 릴레이
  3. `Setup.tsx` 타임아웃 35초 → 60초로 상향 (주입은 최대 30초+ 소요 가능)
- **추가 수정**:
  - `MessageBus.js`: `PUBLISH_POST` 핸들러에서 미정의 변수 `payload` → `message.payload`로 수정, `break` → `return true`
  - `popup.js`: `sendMessage` 콜백 내 `throw new Error()` → 직접 UI 복구 (콜백 내 throw는 외부 try-catch 도달 불가)
  - 레거시 `tistory-injector.js`, `maza-bridge.js` 삭제 (manifest 미로드, `alert()` 사용 위반)
- **파일**: `extension/background/infra_setup.js`, `extension/background/MessageBus.js`, `extension/content_sync.js`, `extension/popup.js`, `src/pages/Setup.tsx`
- **핵심 규칙**: `_notifyWebAppTabs`에 데이터를 전달할 때는 반드시 두 번째 인자로 객체를 전달할 것. 메시지 릴레이 체인의 모든 중간 노드에서 데이터 필드를 명시적으로 전달해야 함.

### [FIX-11] 익스텐션 안정성 강화 & 안티-크래시 프로토콜 (2026-05-13)
- **근본 원인**: 
  1. 에디터 탐지 실패 시 타임아웃 부재로 인한 무한 대기.
  2. Popup 요소 부재 시 Null 참조로 인한 JS 실행 중단.
  3. 자동 주입 시도 중 티스토리 DOM 미안정 상태로 인한 크래시.
  4. Iframe/Shadow DOM 내부에 숨겨진 에디터 탐지 실패.
- **해결**:
  - **PATCH 1**: `waitForEditor`에 10초 타임아웃 및 에러 UI 피드백 적용.
  - **PATCH 2**: `safeOnClick` 유틸리티 도입으로 Null 참조 크래시 원천 차단.
  - **PATCH 3**: 모든 메시지 통신에 `runtime.lastError` 검증 추가.
  - **PATCH 4**: 강제 자동 주입 제거 -> 사용자 승인 기반(Manual Trigger)으로 변경.
  - **PATCH 5**: 모든 iframe/Shadow DOM을 전수 조사하는 Deep Traversal 엔진 탑재.
- **파일**: `extension/content_main.js`, `extension/popup.js`, `extension/content/selectors.js`, `extension/content/dom_utils.js`, `extension/content/providers/TistoryProvider.js`
- **핵심 규칙**: 모든 에디터 탐지 및 주입은 타임아웃을 가져야 하며, 실패 시 사용자에게 시각적 피드백을 제공할 것. 자동화보다 안정성이 우선임.

---

## 5. MV3 Service Worker 라이프사이클 관련 (2026-05-13 야간 세션)

### [FIX-12] MV3 async 리스너 패턴 → "port closed" 연쇄 붕괴 (PERMANENT FIX)
- **근본 원인**: `chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {...})` 형태로 작성하면, 크롬은 async 함수가 반환한 Promise를 "응답 완료"로 간주하고 메시지 포트를 즉시 닫아버림. 이후 `sendResponse()`가 도착해도 포트가 없어 `The message port closed before a response was received` 에러 발생.
- **연쇄 피해**: MessageBus 응답 실패 → SW Sleep → Queue Crash → Detection 실패 → 시스템 전체 멈춤.
- **절대 사용 금지 패턴**:
  ```js
  // ❌ 절대 금지
  chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    const data = await something();
    sendResponse(data);
  });
  ```
- **반드시 사용해야 하는 패턴**:
  ```js
  // ✅ 필수 패턴
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    (async () => {
      const data = await something();
      sendResponse(data);
    })();
    return true; // ← 이 한 줄이 포트를 살린다
  });
  ```
- **파일**: `extension/background/MessageBus.js`
- **핵심 규칙**: `MessageBus.js`의 모든 `onMessage` 리스너는 반드시 IIFE 래퍼 + `return true` 구조를 유지할 것. 절대로 `async` 리스너를 직접 사용하지 말 것.

### [FIX-13] Tistory HTML 에디터 감지 실패 (Shadow DOM / Iframe) 및 무한 대기 (2026-05-15)
- **근본 원인**: `domActions.ts`의 `injectInfra` 로직에서 HTML 편집기 버튼과 에디터 요소(`.CodeMirror`)를 찾을 때 `document.querySelector`를 사용했음. 티스토리의 HTML 에디터 구조상 복잡한 래퍼나 Shadow DOM 구조 내부에 에디터가 렌더링될 경우, 기본 DOM 탐색으로는 요소를 찾을 수 없어 5분간의 무한 루프("가동 중...")에 빠지는 현상 발생.
- **해결**:
  1. `document.querySelector`를 Shadow DOM 및 Iframe 내부까지 재귀적으로 탐색하는 커스텀 유틸리티인 `findAnywhere` 및 `findAnywhereAll`로 원복.
  2. 로그인 리다이렉트 발생 시 최대 5분(300초)까지 사용자의 수동 로그인을 대기하도록 폴링 로직 유지.
  3. 로그인 직후 주소표시줄의 `#/source/html` 해시가 날아가 스킨 편집 화면에 머무르더라도, `htmlBtn`을 실시간으로 감지하여 자동 클릭해 HTML 뷰로 진입하도록 보강.
- **파일**: `extension/content/domActions.ts`, `server/index.ts`
- **핵심 규칙**: 티스토리나 외부 플랫폼의 DOM 요소를 탐색할 때는 절대로 순수 `document.querySelector`에 의존하지 말 것. 반드시 `findAnywhere` 등 딥 트래버셜(Deep Traversal)이 적용된 엔진을 거쳐야 함.

---

### [FIX-13] MessageBus 중복 초기화 → 리스너 중첩 등록 (PERMANENT FIX)
- **근본 원인**: MV3 Service Worker는 Sleep 후 Wakeup을 반복함. 이때 `background.js`가 재실행되면 `MAZA_MESSAGE_BUS.init()`이 여러 번 호출되어 동일한 `onMessage` 리스너가 중첩 등록됨. 이로 인해 하나의 메시지에 여러 `sendResponse`가 호출되어 예측 불가한 에러 발생.
- **해결**: 전역 플래그(`self.__MAZA_MB_INITIALIZED__`)로 중복 초기화를 차단.
  ```js
  // ✅ MessageBus.js 내부
  if (self.__MAZA_MB_INITIALIZED__) return;
  self.__MAZA_MB_INITIALIZED__ = true;
  // ... 리스너 등록
  ```
- **파일**: `extension/background/MessageBus.js`
- **핵심 규칙**: SW Wakeup 시에도 리스너가 중복 등록되지 않도록 반드시 초기화 가드를 유지할 것.

---

### [FIX-14] QueueManager.fetchAndSync 메서드 누락 → SW Crash (PERMANENT FIX)
- **근본 원인**: `MessageBus.js`의 `REFRESH_POSTS` 핸들러가 `self.MAZA_QUEUE.fetchAndSync()`를 호출하는데, `QueueManager.js`에 해당 메서드가 존재하지 않았음. 결과적으로 `TypeError: self.MAZA_QUEUE.fetchAndSync is not a function` 에러로 SW가 즉시 사망.
- **주의**: `if (self.MAZA_QUEUE)` 체크만으로는 부족함. 객체가 존재해도 메서드는 없을 수 있음.
- **해결**:
  1. `QueueManager.js`에 `fetchAndSync` 메서드 추가 (`restoreFromStorage` + `getStatus` 조합).
  2. `MessageBus.js`에서 메서드 호출 전 `typeof` 존재 여부 확인:
  ```js
  // ✅ MessageBus.js 방어적 호출 패턴
  if (typeof self.MAZA_QUEUE?.fetchAndSync !== 'function') {
    sendResponse({ success: false, error: 'QUEUE_METHOD_MISSING' });
    return;
  }
  const posts = await self.MAZA_QUEUE.fetchAndSync();
  ```
- **파일**: `extension/background/QueueManager.js`, `extension/background/MessageBus.js`
- **핵심 규칙**: `background.js`의 `importScripts` 순서는 반드시 `QueueManager.js` → `MessageBus.js` 순서를 유지할 것. 의존 대상 모듈이 항상 먼저 로드되어야 함.

---

### [FIX-15] 인프라 주입 성공 신호 규격 불일치 → 무한 로딩 (PERMANENT FIX)
- **근본 원인**: `infra_setup.js`가 성공 시 `MAZA_INFRA_PROGRESS { step: 'SUCCESS' }` 신호만 보냄. 반면 웹앱 `Setup.tsx`의 모달을 닫는 조건은 별도의 `MAZA_INFRA_INJECTED` 메시지 타입을 기다리고 있었음. 두 신호가 불일치하여 주입이 완료되어도 웹앱의 스피너는 영원히 돌고, 60초 후 "수동 주입 필요" 모달로 전락.
- **해결**:
  1. `infra_setup.js`의 `reportSuccess()` 함수에서 `MAZA_INFRA_INJECTED` 신호를 명시적으로 추가 발송.
  2. `Setup.tsx` 리스너에서 `MAZA_INFRA_PROGRESS` 단계가 `SUCCESS`에 도달하면 즉시 모달 전환 처리:
  ```tsx
  // ✅ Setup.tsx 핵심 리스너
  if (step === 'SUCCESS' || step === 'ALREADY_INJECTED') {
    setInjectModalState('success');
    handleSetupComplete();
  }
  ```
- **파일**: `extension/background/infra_setup.js`, `src/pages/Setup.tsx`
- **핵심 규칙**: 익스텐션(배경)에서 웹앱으로 보내는 신호 타입과 웹앱에서 수신하는 타입을 항상 일치시킬 것. 신규 신호 추가 시 이 문서에 양쪽 코드 위치를 함께 기록할 것.

---

### [FIX-16] 사이드바 자동 오픈 및 로그인 세션 자동 추적 (2026-05-13)
- **배경**: 유저가 매번 사이드바를 수동으로 열고, 로그인 버튼을 누르는 경험이 반복됨. "Autopilot OS"라는 철학에 위배.
- **해결**:
  1. **사이드바 자동 오픈**: `infra_setup.js` 실행 시 `chrome.storage.local`의 `maza_auto_open_panel` 설정값을 확인하여 `chrome.sidePanel.open({ tabId })` 호출. `side_panel.html`에 체크박스 UI 추가.
  2. **로그인 세션 자동 추적**: 미로그인 상태에서 2~5초마다 웹앱 탭(`localhost`, `mazastudio.kr`)의 localStorage를 스캔하여 Supabase 인증 토큰 자동 추출. 토큰 발견 시 `chrome.storage.local`에 저장 후 `init()` 재호출.
  3. **Supabase 토큰 키 패턴**: `key.includes('auth-token') || key.startsWith('sb-')` — 두 패턴 모두 체크해야 `localhost` 개발환경과 실서버 환경 모두 대응 가능.
- **파일**: `extension/side_panel.js`, `extension/side_panel.html`, `extension/background/infra_setup.js`
- **핵심 규칙**: 
  - `chrome.sidePanel.open()`은 유저 제스처(클릭) 직후 또는 `tabId`를 명시해야 정상 작동. 배경에서 임의 호출 시 차단될 수 있음.
  - 로그인 자동 추적 타이머(`MAZA_AUTH_TIMER`)는 로그인 성공 즉시 반드시 해제할 것.

---

### [FIX-17] GSC 메타 태그 중첩 주입 오류 (PERMANENT FIX)
- **근본 원인**: 유저가 구글 서치콘솔에서 복사한 전체 메타 태그(`<meta name="google-site-verification" content="XXX"/>`)를 입력 필드에 붙여넣을 경우, `infra_setup.js`가 이를 그대로 주입하여 HTML 내에 `content="<meta .../>"` 형태의 이중 중첩 태그가 생성됨.
- **해결**: 주입 전 정규식으로 `content` 값만 추출:
  ```js
  // ✅ infra_setup.js
  let scVal = payload.sc_verification || '';
  if (scVal.includes('content=')) {
    const match = scVal.match(/content=["']([^"']+)["']/);
    if (match) scVal = match[1]; // 값만 추출
  }
  ```
- **파일**: `extension/background/infra_setup.js`
- **핵심 규칙**: 인프라 코드 주입 시 항상 입력값을 정규식으로 sanitize할 것. 유저 입력은 항상 태그 전체가 들어올 수 있다고 가정해야 함.

---

### [FIX-18] 전역 Autopilot Stage & 실시간 WebSocket 관제 (2026-05-15)
- **근본 원인**: 
  1. 각 페이지마다 `AutopilotStage`를 수동 배치하여 코드 중복 및 UI 일관성 결여.
  2. 15초 주기 HTTP 폴링 방식의 관제로 인한 서버 부하 및 실시간성 저하.
- **해결**:
  1. `AutopilotStage`를 `Layout.tsx` 하단에 고정 배치(Z-index 100)하여 모든 페이지에서 영속적으로 접근 가능하게 변경.
  2. HTTP 폴링을 폐기하고 `websocketServer.ts`를 통한 10초 주기 Push 방식(`SYSTEM_HEALTH_UPDATE`)으로 전환.
  3. `Orchestrator.tsx` 등 주요 대시보드가 WebSocket 이벤트를 수신하여 즉각적인 지표 업데이트 수행.
- **파일**: `src/components/AutopilotStage.tsx`, `src/components/Layout.tsx`, `server/lib/websocketServer.ts`, `src/pages/Orchestrator.tsx`
- **핵심 규칙**: 시스템 관제 UI는 개별 페이지가 아닌 전역 레이아웃에서 관리하며, 모든 헬스체크 데이터는 WebSockets를 통한 Push 모델을 지향할 것.

---

## 6. Cloud Run 배포 파이프라인 관련 (2026-05-15 배포 안정화 세션)

> **배경**: 이날 세션에서 빌드 성공(이미지 푸시까지 완료)에도 불구하고 Cloud Run 컨테이너가 PORT=8080을 열지 못해 계속 사망하는 현상이 반복되었다. 총 5개의 독립적인 원인이 순차적으로 발견되었으며, 모두 해결 후 최종 배포에 성공하였다.

### [FIX-19] ESM 임포트 확장자 누락 → ERR_MODULE_NOT_FOUND (PERMANENT FIX)
- **근본 원인**: Node.js ESM 모드(`"type": "module"`)에서는 상대 경로 임포트 시 반드시 `.js` 확장자를 명시해야 함. TypeScript 컴파일 후 JS 파일로 변환되더라도 확장자가 없으면 런타임에서 모듈을 찾지 못함.
  ```
  Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/app/server/lib/aiClient'
      imported from /app/server/routes/generate.js
  ```
- **범인**: `sed` 스크립트를 홑따옴표(`'`) 임포트만 처리하도록 작성하여, 쌍따옴표(`"`)로 작성된 임포트(예: `google.ts`, `auth.ts` 등)가 교정에서 누락됨.
- **해결**: `perl` 을 사용한 두 가지 따옴표 패턴 통합 처리:
  ```bash
  # ✅ 홑따옴표 + 쌍따옴표 모두 처리
  find server -name "*.ts" -exec perl -i -pe \
    "s/from (['\"])([\.\/][^'\"]+)(['\"])/from \$1\$2.js\$3/g" {} +
  # ✅ 중복 확장자(.js.js) 제거
  find server -name "*.ts" -exec perl -i -pe "s/\.js\.js/\.js/g" {} +
  ```
- **추가 함정**: `perl` 스크립트가 이미 `.js`가 붙어 있던 경로에도 다시 붙여 `.js.js`를 만들 수 있음. 반드시 중복 제거 단계를 순서대로 실행해야 함.
- **폴더 참조 함정**: `server/workers` 같은 폴더를 임포트하던 곳은 `../workers`→`../workers.js`로 잘못 변환됨. 이 경우 `../workers/index.js`로 수동 교정 필요.
- **파일**: `server/` 전체 (특히 `server/routes/orchestrator.ts`, `server/routes/google.ts`, `server/index.ts`)
- **핵심 규칙**: 서버 코드에 새 파일을 추가하거나 임포트를 작성할 때는 **반드시 처음부터** 상대 경로에 `.js` 확장자를 붙여 작성할 것. 폴더 인덱스 임포트는 `./폴더명/index.js` 형태로 명시.

---

### [FIX-20] 배치 `sed` 스크립트의 따옴표 처리 누락
- **근본 원인**: macOS 기본 `sed`는 정규식 처리 방식이 GNU `sed`와 달라 복잡한 패턴에서 예상치 못하게 동작하지 않는 경우가 있음.
- **절대 금지**: macOS에서 `sed -i '' 's/from "\(.*\)"/from "\1.js"/g'` 방식은 macOS `sed`의 캡처 그룹 처리 방식 차이로 실패할 수 있음.
- **올바른 도구**: 파일 내 텍스트 대량 치환은 `perl -i -pe "s/패턴/치환/g"` 를 사용할 것.
- **핵심 규칙**: macOS 환경에서 복잡한 정규식 batch 처리 시 `sed` 대신 `perl`을 기본 도구로 채택할 것.

---

### [FIX-21] Supabase Realtime WebSocket 크래시 — Node.js 20 환경 (PERMANENT FIX)
- **근본 원인**: Supabase JS SDK v2는 클라이언트를 초기화할 때 Realtime 연결을 위한 WebSocket 인스턴스를 즉시 생성하려 함. Node.js 20에는 네이티브 WebSocket이 없어(Node.js 22부터 지원), 아래와 같은 에러로 서버가 **임포트 단계에서 즉시 종료**됨:
  ```
  Error: Node.js 20 detected without native WebSocket support.
  Suggested solution: install "ws" package and provide it via the transport option
  ```
- **피해 경로**: `supabaseServer.ts` (또는 `auth.ts`) 임포트 → `createClient()` 호출 → WebSocket 인스턴스 생성 시도 → 크래시 → `exit(1)` → 포트 8080 미오픈 → Cloud Run 헬스체크 실패.
- **해결 (supabaseServer.ts)**: `ws` 패키지를 transport로 직접 주입:
  ```typescript
  import ws from "ws";
  
  createClient(url, key, {
    realtime: { transport: ws as any },  // ← as any로 타입 충돌 우회
    auth: { persistSession: false, autoRefreshToken: false }
  });
  ```
- **해결 (auth.ts)**: JWT 검증만 하면 되므로 Realtime 자체를 비활성화:
  ```typescript
  const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { transport: class FakeWS { constructor() {} } as any },
    auth: { persistSession: false, autoRefreshToken: false }
  });
  ```
- **타입 에러 주의**: `ws`의 타입이 Supabase의 `WebSocketLikeConstructor`와 불일치하여 TypeScript 컴파일 에러 발생 → `ws as any`로 캐스팅하여 해결.
- **파일**: `server/lib/supabaseServer.ts`, `server/middleware/auth.ts`
- **핵심 규칙**: 
  1. 서버 사이드에서 `createClient`를 호출할 때는 **반드시** `realtime` 옵션을 지정할 것.
  2. JWT 검증 전용 클라이언트(auth middleware)는 Realtime이 불필요하므로 항상 비활성화할 것.
  3. 서버 배포 대상 환경의 Node.js 버전을 항상 확인하고, v20 이하라면 `ws` 패키지 주입이 필수.

---

### [FIX-22] Cloud Run 헬스체크 포트 하드코딩 → 컨테이너 타임아웃 (PERMANENT FIX)
- **근본 원인**: `Dockerfile`의 `HEALTHCHECK`가 `localhost:3001`로 하드코딩되어 있었음. Cloud Run은 `PORT` 환경변수(기본 8080)를 주입하는데, 서버가 다른 포트를 열거나 헬스체크가 다른 포트를 바라볼 경우 프로브(probe)가 항상 실패함.
- **해결**: `Dockerfile`에서 포트를 환경변수로 동적 처리:
  ```dockerfile
  EXPOSE 8080
  HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:$PORT/api/health || exit 1
  CMD ["node", "server/index.js"]
  ```
- **서버 코드**: `server/index.ts`가 `process.env.PORT || 3001`로 포트를 수신하도록 반드시 확인할 것.
- **파일**: `Dockerfile`, `server/index.ts`
- **핵심 규칙**: Cloud Run 배포 시 절대로 포트를 하드코딩하지 말 것. 항상 `process.env.PORT`를 읽어야 하며, `Dockerfile`의 `HEALTHCHECK`도 `$PORT`를 사용해야 함.

---

### [FIX-23] cloudbuild.yaml Artifact Registry 저장소 경로 오류
- **근본 원인**: `cloudbuild.yaml`에서 이미지 경로가 잘못 설정되어 `docker push`가 실패하거나 Cloud Run이 이미지를 찾지 못하는 현상 발생.
- **올바른 경로 형식**:
  ```
  asia-northeast1-docker.pkg.dev/[PROJECT_ID]/cloud-run-source-deploy/maza
  ```
- **파일**: `cloudbuild.yaml`
- **핵심 규칙**: `cloudbuild.yaml`의 이미지 경로는 `gcloud artifacts repositories list` 로 실제 저장소를 반드시 확인 후 기재할 것. `gcr.io/` 와 `docker.pkg.dev/` 를 혼용하지 말 것.

---

### [FIX-24] Cloud Build 자동 트리거가 Buildpack으로 실행 → 대시보드 상시 실패 표시 (PERMANENT FIX)
- **근본 원인**: Cloud Run 서비스 최초 연동 시 GCP가 자동으로 생성하는 GitHub 푸시 트리거(`rmgpgab-maza-...`)가 Buildpack(`gcr.io/k8s-skaffold/pack`) 방식으로 설정되어 있었음. `cloudbuild.yaml`을 수동으로 작성한 이후에도 해당 트리거는 그대로 구형 방식을 사용하고 있어, `main` 브랜치에 `git push`할 때마다 Buildpack 빌드가 자동 실행되어 **항상 Step 9에서 실패**.
- **증상**: 수동 `gcloud builds submit --config cloudbuild.yaml` 은 SUCCESS인데, 대시보드에는 빨간 FAILURE가 표시되어 혼란 유발.
- **해결**: 트리거의 빌드 방식을 `cloudbuild.yaml`로 변경하고, Supabase 환경변수를 substitutions로 주입:
  ```bash
  gcloud builds triggers import --project=mazastory --source=<(
    gcloud builds triggers describe [TRIGGER_NAME] --project=mazastory --format=json | python3 -c "
  import sys, json
  d = json.load(sys.stdin)
  d.pop('build', None)          # Buildpack 설정 제거
  d['filename'] = 'cloudbuild.yaml'
  d['substitutions'] = {
    '_VITE_SUPABASE_URL': '...',
    '_VITE_SUPABASE_ANON_KEY': '...'
  }
  print(json.dumps(d))
  ")
  ```
- **확인 방법**: `gcloud builds triggers describe [TRIGGER_NAME] --project=mazastory --format="value(filename)"` 결과가 `cloudbuild.yaml`이면 정상.
- **파일**: GCP Cloud Build 트리거 설정 (콘솔 또는 `gcloud` CLI)
- **핵심 규칙**:
  1. Cloud Run 서비스를 처음 연결할 때 GCP가 자동 생성한 트리거는 항상 Buildpack으로 설정되어 있음. **반드시 수동으로 `cloudbuild.yaml` 방식으로 변경**해야 함.
  2. 이후 `main` 브랜치 푸시만으로 빌드→푸시→배포 전 과정이 자동 실행되므로, 수동 `gcloud builds submit` 은 긴급 상황 외에는 불필요.
  3. substitutions(`_VITE_SUPABASE_URL` 등)은 트리거에 영구 등록해두어 매번 수동 입력할 필요가 없도록 관리할 것.

---

### [FIX-25] Cloud Build 트리거 + service_account → 로그 버킷 정책 오류 (PERMANENT FIX)
- **근본 원인**: GCP 자동 생성 트리거에는 `service_account`가 지정되어 있음. 이 경우 GCP 정책에 따라 **`cloudbuild.yaml`에 반드시 로깅 옵션이 함께 명시**되어야 하며, 그렇지 않으면 빌드가 아예 실행조차 되지 않음.
- **에러 메시지**:
  ```
  if 'build.service_account' is specified, the build must either
  (a) specify 'build.logs_bucket',
  (b) use the REGIONAL_USER_OWNED_BUCKET build.options.default_logs_bucket_behavior option, or
  (c) use either CLOUD_LOGGING_ONLY / NONE logging options: invalid argument
  ```
- **증상**: 빌드 0단계(Steps: 0개)에서 즉시 FAILURE. 로그 자체가 없어 Cloud Console의 빌드 로그 탭도 비어있음.
- **해결**: `cloudbuild.yaml`에 `options.logging: CLOUD_LOGGING_ONLY` 추가:
  ```yaml
  # cloudbuild.yaml 최하단에 추가
  options:
    logging: CLOUD_LOGGING_ONLY
  ```
- **파일**: `cloudbuild.yaml`
- **핵심 규칙**:
  1. GCP 자동 생성 트리거는 항상 `service_account`가 지정되어 있으므로, **`cloudbuild.yaml`에는 반드시 `options.logging: CLOUD_LOGGING_ONLY`를 포함**해야 함.
  2. 이 옵션이 없으면 Buildpack → `cloudbuild.yaml`로 트리거를 교체해도 동일하게 FAILURE가 발생함.
  3. FIX-24(트리거 방식 교체)와 FIX-25(로깅 옵션 추가)는 **반드시 함께** 적용해야 자동 배포가 정상 작동함.

---
*최종 업데이트: 2026-05-15 (Cloud Run 자동 배포 파이프라인 완전 안정화 — 총 7개 장애물 제거, 자동 트리거 SUCCESS 확인)*

---

### [FIX-26] 서치콘솔/GA4 메타데이터 주입 불가 — 4중 복합 버그 (PERMANENT FIX) (2026-05-16)

- **근본 원인**: `startAutoInfra` 함수에서 4개의 독립적인 버그가 복합 작용하여 서치콘솔/GA4 코드가 티스토리에 주입되지 않고, DB에도 저장되지 않는 완전 무력화 현상 발생.

#### BUG-1: `handleSetupComplete()` 빈 인자 호출 → DB 저장 누락 (치명)
- **증상**: `startAutoInfra` 성공 후 DB의 `sc_verification`, `ga_measurement_id` 필드가 `undefined` (빈값)으로 덮어쓰여짐.
- **원인**: `handleSetupComplete()`를 인자 없이 호출하면 `finalData`가 `{}` + `autoData`(가비 비어 있을 수 있음)로만 구성. sc/ga 값이 전달되지 않아 DB에 `undefined` 저장.
- **해결**: `startAutoInfra` 시작 시 `handleSetupComplete(payload)`로 전체 payload를 먼저 저장 후 주입 시작.

#### BUG-2: `startAutoInfra` payload에 `autoData` 미포함 → 최신 sc/ga 누락 (치명)
- **증상**: `handleAutoSetup`으로 취득한 최신 sc/ga 토큰이 주입 html에 반영되지 않고 DB의 구버전 값이 사용됨.
- **원인**: `autoData.sc_verification`을 사용하지 않고 `site?.sc_verification || panelData.sc_verification`만 참조.
- **해결**: `autoData`를 최우선으로 사용: `autoData.sc_verification || site?.sc_verification || panelData.sc_verification || ''`

#### BUG-3: 빈 sc/ga 값으로 빈 메타태그 주입 (중)
- **증상**: `clean_sc` 또는 `clean_ga`가 빈 문자열인데도 `<meta content="" />`, `gtag('config','')` 형태의 무효 코드가 주입됨.
- **원인**: 서버에서 빈값 검증 없이 html 문자열 생성. 홑따옴표(`content='XXX'`) 패턴과 `google-site-verification=` 접두사도 미처리.
- **해결**: 각 값이 있는 경우에만 해당 코드 블록을 html에 포함. 홑따옴표/접두사 패턴도 정규식으로 처리. 둘 다 빈값이면 400 에러 반환.

#### BUG-4: 서버 `result.success` = 큐 등록 완료 ≠ 주입 완료 → 조기 성공 표시 (중)
- **증상**: 실제 익스텐션이 티스토리에 주입하기 전에 웹앱이 "주입 성공" 모달을 표시.
- **원인**: `/api/extension/infra-inject` 응답 `success:true`는 "Redis 큐에 작업 등록됨"을 의미. 실제 주입은 익스텐션 폴링 후 실행됨.
- **해결**: 서버 `success` 응답 시 진행률 30%로 유지하고 실제 `MAZA_INFRA_PROGRESS` 신호를 기다림. 60초 타임아웃 후 manual 모드 전환.

- **파일**: `src/pages/Setup.tsx` (startAutoInfra 함수), `server/index.ts` (POST /api/extension/infra-inject), `extension/background/background.ts` (executeTask)
- **핵심 규칙**: 
  1. `handleSetupComplete()`는 반드시 sc/ga 값을 포함한 완전한 payload로 호출할 것.
  2. 자동 취득 데이터(`autoData`)는 저장된 데이터(`site`, `panelData`)보다 우선순위가 높음.
  3. 서버 응답 성공 = 작업 큐 등록 완료이지 실제 실행 완료가 아님. UI는 실제 신호를 기다려야 함.
  4. 주입 html 생성 시 빈값 검증은 필수. 빈 메타태그는 오히려 SEO에 해가 될 수 있음.
  5. **DB 저장(saveInfraData)과 완료 처리(handleSetupComplete+navigate)를 반드시 분리**할 것. 주입 전에는 저장만, 주입 성공 신호 수신 후에만 navigate.
  6. **`background.ts`의 INFRA_INJECT 처리 후 반드시 `relayToWebApp(MAZA_INFRA_PROGRESS)`를 호출**할 것. 이 신호가 없으면 웹앱은 주입 성공/실패를 영원히 모름.

---

### [FIX-27] 티스토리 인프라 중복 주입 (Duplicate Injection) 방지 정규식 (2026-05-16)
- **근본 원인**: 과거에 주입된 "마커 없는(레거시) 코드"와 최신 버전의 "마커(`<!-- Maza Infra -->`) 있는 코드"가 혼재되어 탐지 로직이 단순 문자열 비교(`indexOf`)에 의존할 때 중복 주입이 발생함.
- **증상**: 티스토리 HTML 에디터 내에 `Maza Infra` 주석 블록이 여러 개 생성되어 스킨이 지저분해지거나 오작동 유발 가능성 증가.
- **해결**: `background.ts`의 `processVal` 로직에서 구버전(레거시) 패턴 2가지와 신규 마커 블록 패턴을 모두 찾아 깨끗하게 삭제(replace)한 뒤, 오직 한 벌의 최신 코드만 삽입하는 다층 정규식 클린업 로직 적용. 새 코드와 기존 코드가 완벽히 일치하면 불필요한 저장을 생략하고 `ALREADY_INJECTED` 상태 반환.
- **파일**: `extension/background/background.ts`
- **핵심 규칙**: 코드 주입 엔진을 업데이트할 때는 반드시 **기존 구버전 코드가 찌꺼기로 남아 있을 가능성**을 염두에 두고, 클린업(Clean-up) 정규식을 꼼꼼하게 작성하여 중복 삽입을 원천 차단해야 함. 확장 프로그램 로직 수정 후에는 반드시 `node build-ext.mjs`로 재빌드 필수.

---

### [FIX-28] 인프라 주입 완료 모달 "눈에 보이지 않게 즉시 사라짐" 현상 (2026-05-16)
- **근본 원인**: `Setup.tsx`에서 자동 주입 성공 후 뜨는 모달의 버튼 텍스트가 "확인했습니다 (다음으로 이동)"이었음. 클릭 시 `handleSetupComplete()`가 호출되는데, **필수 설정(GA4 등)이 누락되어 `is_setup_complete`가 `false`일 경우 페이지가 넘어가지 않음.** 결국 페이지는 그대로인데 팝업만 즉시 꺼져버려 유저가 버그나 에러로 오해("팝업이 눈에 보이지 않게 사라져")함.
- **해결**: 해당 버튼의 텍스트를 "확인 (창 닫기)"로 변경하여, 유저에게 다음 페이지로 즉시 강제 이동한다는 잘못된 기대를 주지 않도록 UI 피드백을 직관적으로 교정.
- **파일**: `src/pages/Setup.tsx`
- **핵심 규칙**: 모달의 닫기 버튼이 페이지 라우팅(Navigate)을 항상 수반하지 않는다면, 버튼 이름에 "이동"이나 "적용" 같은 오해를 유발하는 단어를 배제하고 "닫기"라는 명확한 행동 결과를 명시해야 유저 경험(UX)의 단절을 막을 수 있음.

---

### [FIX-29] 인프라 주입 완료 후 타 탭(티스토리) 방치 및 결과 인지 불가 (2026-05-16)
- **근본 원인**: 원클릭 주입 시 익스텐션이 티스토리 탭을 활성화하여 작업을 수행하지만, 작업 완료 후에도 포커스가 티스토리 탭에 그대로 남아 있었음. 사용자는 티스토리 화면만 보고 있으니 MazaStudio 웹앱 탭에 이미 출력된 "성공 팝업"을 보지 못하고 계속 기다리는(UX 단절) 현상 발생.
- **해결**: `background.ts`에 `focusWebAppTab()` 유틸리티를 구현. `INFRA_INJECT` 작업이 성공(`SUCCESS` / `ALREADY_INJECTED`)하면 즉시 웹앱 탭(`localhost` 또는 `mazastudio.kr`)을 찾아 `chrome.tabs.update`와 `chrome.windows.update`를 통해 화면을 최상단으로 복귀시킴.
- **파일**: `extension/background/background.ts`
- **핵심 규칙**: 외부 탭에서 자동화 작업이 수행되는 경우, 작업 종료 시 반드시 사용자를 **메인 관제 센터(WebApp)**로 복귀시켜 결과 피드백을 즉시 인지할 수 있도록 "포커스 체이닝"을 강제해야 함.

---

### [FIX-30] 티스토리 에디터 내용 중복 삽입 버그 (2026-05-26)
- **근본 원인**: `mainWorld.ts`에서 티스토리 에디터에 내용을 삽입할 때, 기존에 작성되어 있던 내용을 지우지 않고 `insertHTML`을 수행하여 재시도나 지연 발생 시 내용이 2번 중복해서 들어가는 현상 발생.
- **해결**: HTML 삽입 직전 `document.execCommand('selectAll')` 후 `document.execCommand('delete')`를 강제로 실행하여 에디터를 백지 상태로 만든 뒤 삽입하도록 수정.
- **파일**: `extension/content/mainWorld.ts`

---

### [FIX-31] 스톡 이미지 한글 텍스트 깨짐 및 무조건 오버레이 현상 (2026-05-26)
- **근본 원인**: `imageWorker.ts`가 이미지 처리 요청 시 항상 `title` 파라미터를 넘기고, `imageService.ts`가 이를 받아 Pexels 등 스톡 이미지에도 억지로 텍스트를 합성함. 이로 인해 한글 폰트 미지원으로 `ㅁㅁㅁㅁ` 글씨가 깨지거나 불필요하게 3장 모두 같은 텍스트가 박히는 현상 발생.
- **해결**: 스톡 이미지 요청 시 `title`을 배제하고 순수한 원본 화질을 유지하도록 분리. 스냅블로그(유저 업로드 사진)의 경우에만 `MAZA STUDIO` 등의 워터마크 로직을 적용.
- **파일**: `server/workers/imageWorker.ts`, `server/lib/imageService.ts`

---

### [FIX-32] 애드센스 기계적 자동화 패턴 감지 회피를 위한 5종 템플릿 엔진 (2026-05-26)
- **근본 원인**: 모든 블로그 포스팅이 완전히 동일한 CSS 레이아웃 구조(단일 템플릿)로 발행되어 구글 봇이 '기계 생성 콘텐츠'로 분류하여 애드센스 승인을 거절할 위험성 내포.
- **해결**: `rendererAgent.ts`를 개편하여 서로 다른 시각적 특성을 가진 5가지 템플릿(A: 뉴스레터, B: 매거진, C: 가이드북, D: Q&A, E: 리뷰/비교)을 구축. 포스트 키워드의 해시값을 기반으로 템플릿을 무작위 순환 적용하여 블로그 전체의 시각적 다양성을 확보함.
- **파일**: `server/lib/rendererAgent.ts`

## [2026-06-01] Maza Studio Pipeline & Scheduling Core Fixes

### 1. Extention Navigation Loop (Tistory Redirects)
**Problem**: The extension `background.ts` `executeTask` repeatedly reloaded the tab when publishing because it strictly expected the URL to contain `/manage/newpost` or `/manage/page`. Tistory automatically redirects to `/manage/post` or `/manage/post/write`, triggering an infinite refresh loop that resulted in a timeout.
**Fix**: Added a check to explicitly allow `/manage/post` and `/manage/page/write` as valid redirect paths for new posts.
**Rule**: NEVER strictly enforce Tistory's URL path without accounting for `/manage/post` redirects during the publish flow.

### 2. Duplicate Post Generation & Queue Enqueueing
**Problem**: Generating a new post would enqueue the job twice: once manually in `generate.ts` via `generateQueue.add()`, and once in `schedulerService.ts` via polling `scheduled_posts` (queued state). This bypassed slot limits and caused duplicate contents with identical titles.
**Fix**: `generate.ts` no longer directly calls `generateQueue.add()`. It strictly inserts a DB row, and delegates actual queueing to `SchedulerService.poll()`.
**Rule**: NEVER manually call `queue.add()` in the API routes for scheduled content. ALWAYS write to `scheduled_posts` and let `SchedulerService` handle the polling and enqueueing.

### 3. Missing Progress Bar & Virtual Posts
**Problem**: Posts stuck in `image_processing` or `validating` were "virtual posts" (no content body attached in the UI yet). Users saw a static "AI 본문 집필 중" text and thought the preview button was broken or missing.
**Fix**: Added a visual animated progress bar in `SeriesCommander.tsx` (10%, 45%, 75%, 90%) mapped to `queued`, `generating`, `image_processing`, and `validating`.
**Rule**: If a post is in any `generating` phase, explicitly render a progress bar so the user knows it hasn't stalled.

### 4. Stuck in Image Processing (Validation Worker Blindspot)
**Problem**: `aiWorker` updated the post status to `image_processing`. The subsequent `validationWorker` queried for scheduled posts to promote to `ready_to_publish`, but its `.in('status', ['generating', 'pending', 'validating'])` query lacked `image_processing`. Posts got permanently stuck.
**Fix**: Added `image_processing` to the `validationWorker` target status array.
**Rule**: Always ensure the state machine queries in BullMQ workers perfectly align with the preceding worker's output status.

### 5. Staggered Scheduling (W-05) UX Fix
**Problem**: If 5 posts were created, `generate.ts` assigned `publish_at: new Date()` to all of them because it inserted them as `queued`. The UI showed them all as "Immediate", and only staggered them *after* the first one published.
**Fix**: `generate.ts` now inserts posts as `on_hold`. `SchedulerService.promoteOnHoldTasks()` picks them up and pre-assigns the 3-hour staggered `publish_at` interval *before* moving them to `queued`.
**Rule**: All new bulk scheduled posts MUST enter as `on_hold` so they get correctly staggered time assignments before entering the processing queue.

---

## [2026-06-12] 티스토리 페이지(법적 페이지) 발행 — 5중 복합 버그 전면 해결 (PERMANENT FIX)

> 증상: "개인정보처리방침" 등 페이지 타입 발행 시 항상 FAILED, 간헐적으로 글 관리(posts)에 잘못 발행됨

### ⭐ 핵심 발견: 티스토리 URL 진실의 표 (절대 변경 금지)

| 목적 | 올바른 URL | 잘못된 URL |
|------|-----------|-----------|
| 글(post) 에디터 | `/manage/newpost` | - |
| **페이지(page) 에디터** | **`/manage/page` (단수)** | `/manage/pages` (목록), `/manage/newpage` (404), `/manage/newpost/?type=page` (글 에디터로 이동) |
| 글 목록 | `/manage/posts` | - |
| 페이지 목록 | `/manage/pages` (복수) | **task.url로 절대 사용 금지** |

### BUG-1: 잘못된 task URL (치명)
- **원인**: `task.url`이 `/manage/pages` (목록 페이지)로 설정되어 있었음
- **결과**: 탭이 목록 페이지에 열림 → `prepareEditor()`가 버튼 클릭 → SPA 이동 발생 → **content script 교체 → 메시지 채널 단절 → FAILED**
- **수정**: `server/index.ts`, `taskRouter.ts` (2곳) 모두 `/manage/page` (단수, 에디터 직행)으로 변경
- **규칙**: task.url은 반드시 에디터 직행 URL. 목록 페이지는 절대 사용 금지.

### BUG-2: Self-Deadlock (자기 교착) — deliverTask 차단 (치명)
- **원인**: `executeTask()`가 `tryStartTaskExecution(task.id)`로 락을 걸면, `deliverTask()`의 `isTaskExecutionInProgress()` 체크가 자기가 건 락을 발견하고 스스로 전달을 차단함
- **로그 증거**: `[Duplicate Guard] Task execution already in progress. Skipping deliverTask`
- **수정**: `deliverTask`의 가드를 "동일 탭이면 허용"으로 변경
  ```typescript
  if (isTaskExecutionInProgress() && getExecutingTaskTabId() !== tabId) {
    return; // 다른 탭 실행 중일 때만 차단
  }
  ```
- **파일**: `extension/background/execution/taskRouter.ts`

### BUG-3: 성급한 메모리 삭제 — Race Condition (치명)
- **원인**: `background.ts`의 `CONTENT_SCRIPT_READY` 핸들러가 task 전달 전에 `lastImmediateTask = null`을 실행
- **결과**: 전달 실패 후 다음 READY 시 task 없음 → `READY received but NO TASK for tab` 로그
- **수정**: task 전달 완료(성공/실패) 시점에만 정리, READY 핸들러에서 선제 삭제 제거
- **파일**: `extension/background/background.ts`

### BUG-4: 전달 실패 후 복구 불가 — deliveredSet 롤백 누락 (중)
- **원인**: `chrome.tabs.sendMessage` 실패 시 task는 메모리에 유지했지만 `_deliveredTasks` Set에서 제거하지 않음
- **결과**: 다음 READY 시 "이미 전달됨"으로 오인하여 재전달 차단
- **수정**: catch 블록에서 `deliveredSet.delete(task.id)` 추가로 재시도 가능하게 복구
- **파일**: `extension/background/execution/taskRouter.ts`

### BUG-5: 무한 새로고침 루프 (중)
- **원인**: `injector.ts`의 navigation 가드에서 `currentUrl === task.url` 일 때도 `window.location.href = task.url` 실행 → 제자리 새로고침 무한 반복
- **수정**: `currentUrlBase !== taskUrlBase`일 때만 이동, 같으면 `injectContent()` 진행
- **파일**: `extension/content/injector.ts`

### 수정된 파일 목록

| 파일 | 변경 내용 |
|------|-----------|
| `server/index.ts` | 페이지 publishUrl → `/manage/page` |
| `extension/background/execution/taskRouter.ts` | URL 2곳 수정, Self-Deadlock 해제, 전달 실패 롤백 |
| `extension/background/background.ts` | READY 핸들러 성급한 task 삭제 제거 |
| `extension/content/injector.ts` | isTistoryWritePage 정규식 갱신, 무한 새로고침 방지 |
| `extension/platforms/tistory/workflow/editor.ts` | isPageManage 정규식 갱신 |
| `extension/background/tabManager.ts` | isPageRedirect 조건 갱신 |

### 핵심 교훈 (다시는 반복하지 말 것)

1. **chrome.tabs.sendMessage는 탭 이동 중 반드시 실패한다** — content script가 교체되면 채널은 즉시 사망. 이것은 에러가 아니라 정상 동작. `NAVIGATING_TO_EDITOR`를 동기적으로 반환하여 백그라운드가 다음 READY를 기다리게 해야 함.
2. **task.url은 에디터 직행 URL** — 목록 페이지 URL을 task.url로 쓰는 순간 SPA 이동 → 채널 단절 → FAILED의 무한 사이클에 빠짐.
3. **isTaskExecutionInProgress 가드는 탭 기준** — `tabId` 비교 없이 무조건 차단하면 자기가 건 락에 자기가 막히는 Self-Deadlock 발생.
4. **READY 핸들러에서 절대로 task 메모리를 선제 삭제하지 말 것** — 전달이 완료된 후에 정리해야 재시도 가능.
5. **전달 실패 시 deliveredSet을 반드시 롤백** — 롤백 없으면 재시도 경로가 영구 차단됨.

*최종 업데이트: 2026-06-12 (티스토리 페이지 발행 5중 복합 버그 전면 해결 — 성공 확인)*

---

## [2026-06-13] 티스토리 인프라 주입(HTML 에디터 진입) 실패 — 4중 복합 버그 전면 해결 (PERMANENT FIX)

> 증상: "html 및 CSS 편집으로 인해 발생하는 문제는 직접 수정하셔야 합니다. 계속 진행하시겠습니까?" 경고창 후 에디터가 열리지 않아 무한 대기 / 타임아웃 발생 (에러: `HTML 에디터를 열 수 없습니다.`)
> 추가 증상: `RUN_TASK` 푸시 알림이 클라이언트(익스텐션)에서 처리되지 않아 자동 주입이 멈춤 (`Received unknown WS message type: RUN_TASK`)

### BUG-1: SPA Hydration(타이밍) 불일치로 인한 Dead Click (치명)
- **원인**: 티스토리 스킨 편집 페이지 렌더링 직후(Vue.js/React 등), 이벤트 리스너가 아직 부착되지 않은 상태에서 `injector`가 "HTML 편집" 버튼을 즉시 광클하여 클릭 이벤트가 무시됨.
- **결과**: 에디터가 열리지 않고 15초 타임아웃 발생.
- **수정**: 단순 클릭 대신 **`클릭 -> 4초 대기 -> 탐지 실패 시 재클릭`** 형태의 **재시도 루프(Retry Loop)** 적용. (최대 4회 반복)
- **파일**: `extension/platforms/tistory/infra.ts`

### BUG-2: 범용적인 textarea 감지로 인한 조기 성공 판정 오류 (치명)
- **원인**: `waitForElement` 대기 셀렉터에 `.concat(['textarea'])`가 포함되어 있어, 스킨 편집 화면 어딘가에 있는 숨겨진 일반 textarea(예: 검색창 등)가 발견되면 에디터 로딩 성공으로 착각.
- **결과**: 정작 실제 CodeMirror 에디터는 나타나지도 않았는데 Main World에 주입을 요청하다가 실패함. 문자열 콤마 조인 방식으로 `querySelector` 실행 시 에러 발생 가능성도 상존.
- **수정**: `'textarea'`를 대기 배열에서 제거하고, 콤마 문자열 대신 배열 자체를 넘겨 안전하게 매칭되도록 변경.
- **파일**: `extension/platforms/tistory/infra.ts`

### BUG-3: Native Confirm 다이얼로그 오작동 자동 취소 (치명)
- **원인**: "HTML 편집" 클릭 시 나타나는 네이티브 경고 다이얼로그(`"html 및 CSS 편집으로 인해 발생하는 문제는 직접 수정하셔야 합니다..."`)를 `mainWorld`에서 알 수 없는 다이얼로그로 판단하여 무조건 `false`(취소) 반환.
- **결과**: 유저가 클릭한 것과 동일한 효과(취소)가 발생하여 에디터 진입이 영구 차단됨.
- **수정**: 다이얼로그 검사 조건식에 `msg.includes('html 및 CSS 편집')` 조건을 화이트리스트로 추가하여 자동으로 `true`(확인)를 반환하도록 수정.
- **파일**: `extension/content/mainWorld/dialogs.ts`

### BUG-4: WebSocket 푸시 메시지 타입 불일치 (중)
- **원인**: 백엔드는 큐 등록 완료 시 `{ type: 'RUN_TASK' }`를 통해 즉각 실행을 지시하지만, 프론트 익스텐션의 WS 핸들러는 `{ type: 'DELIVER' }`만 기대하고 있었음.
- **결과**: `Received unknown WS message type: RUN_TASK` 로그가 뜨며 무시되고, 결국 최대 15초(또는 1분) 후의 HTTP 폴링을 기다려야만 작업이 시작됨 (실시간 반응성 파괴).
- **수정**: `wsClient.ts` 내 WS 핸들러가 `message.type === 'RUN_TASK'`도 동일하게 태스크를 픽업 및 실행하도록 변경.
- **파일**: `extension/background/connection/wsClient.ts`

### 핵심 교훈 (다시는 반복하지 말 것)
1. **SPA 환경에서의 즉시 클릭은 금물** — 렌더링과 이벤트 리스너 부착 사이의 공백(Hydration Delay)을 고려하여 반드시 Retry 로직이나 MutationObserver 기반의 확실한 대기가 필요함.
2. **범용 선택자 주의** — `textarea`, `div` 같이 너무 광범위한 선택자를 `waitForElement` 등에 넣으면 엉뚱한 요소를 잡고 성공으로 착각하여 치명적인 타이밍 버그를 낳음.
3. **네이티브 알림창 가로채기 갱신** — `alert()`, `confirm()`을 오버라이딩했다면 플랫폼의 UI 업데이트로 인한 새로운 문구들을 지속적으로 화이트리스트에 갱신해야 함.
4. **WebSocket 메시지 규격 검사** — 백엔드와 프론트엔드의 메시지 규격 불일치는 사일런트 실패(Silent Failure)로 이어지므로 `type` 값을 면밀히 교차 검증해야 함.

*최종 업데이트: 2026-06-13 (인프라 자동 주입 무한 대기 및 푸시 미수신 이슈 완전 해결)*

---

## [2026-06-13] 글 발행 30초 지연 — 2중 복합 버그 전면 해결 (PERMANENT FIX)

> 증상: 탭이 열리고 글이 준비된 후에도 "공개 발행" 버튼이 클릭되지 않고 약 25~30초를 대기함
> 로그: `Auth storage changed → throttled (5s cooldown)` 4~5회 반복, `Delivery failed: message channel closed before response`

### BUG-1: 토큰 Sync 연속 이벤트 → 5초 쿨다운 반복 히트 (중)
- **원인**: `chrome.storage.onChanged`가 `mazaToken`, `mazaUserEmail`, `mazaOrigin`이 동시에 변경될 때 이벤트가 연속으로 발생함. 매 이벤트마다 `resetPollingState()`를 호출하고 `refreshTransport('auth-change')`를 실행하지만, 내부적으로 폴링 5초 쿨다운에 걸려 실제 폴링이 스킵됨.
- **결과**: 토큰 sync 직후 즉시 태스크를 가져와야 하는데 최대 15초(5초 × 3회)를 낭비함.
- **수정**: `handleAuthStorageChange`에 **500ms 디바운스** 추가. 연속 이벤트를 하나로 합친 뒤 `pollingLoop(true)`(force=true)로 5초 쿨다운을 완전히 우회하도록 변경.
- **파일**: `extension/background/background.ts`

### BUG-2: 탭 로딩 중 task 전달 → `message channel closed` (치명)
- **원인**: `CONTENT_SCRIPT_READY`가 탭이 열리는 순간 injector.ts에 의해 즉시 발송됨. Background가 `deliverTask`로 즉시 `chrome.tabs.sendMessage(DELIVER)`를 시도하지만, 탭이 아직 완전히 로딩 중이어서 content script가 응답을 못 함.
- **결과**: 5회 재시도(모두 고정 300ms)를 마친 뒤 전달 실패로 처리됨. 이후 두 번째 `CONTENT_SCRIPT_READY`(탭 로딩 완료 후)가 와서야 전달 성공. 총 25초 낭비.
- **수정**: `deliverTask` 재시도 루프에서 전달 시도 전에 **탭 상태(`tab.status`)를 확인**하여 `complete`가 아니면 `waitForTabComplete()`를 호출하도록 추가. 또한 재시도 간격을 300ms 고정에서 지수 백오프(300→600→1200→2400→3000ms)로 변경하여 과도한 재시도 방지.
- **파일**: `extension/background/execution/taskRouter.ts` (`deliverTask` 함수)

### 핵심 교훈 (다시는 반복하지 말 것)
1. **Storage 변경 이벤트는 반드시 디바운스** — 여러 키가 동시에 바뀔 때 이벤트가 여러 번 발생하고, 각각이 폴링 쿨다운에 걸리면 의도치 않게 오랜 지연이 생김.
2. **탭 로딩 완료 전 메시지 전달 금지** — content script는 탭 로딩이 완전히 끝나야(`status: 'complete'`) 메시지를 받을 수 있음. `sendMessage` 전 항상 `waitForTabComplete()` 또는 탭 상태 확인 필수.
3. **고정 재시도 간격보다 지수 백오프** — 빠른 재시도가 `message channel closed`를 반복 유발할 수 있음. 지수 백오프로 탭 로딩 여유를 주면 불필요한 실패 횟수를 줄일 수 있음.

*최종 업데이트: 2026-06-13 (글 발행 30초 지연 2중 복합 버그 전면 해결)*

---

## [2026-06-14] ZeroIT 자동 구축 파이프라인 핵심 로직 & 재발 방지 (PERMANENT FIX)

> 관련 파일: `server/routes/zeroit.ts`, `server/lib/netlify.ts`, `server/lib/github.ts`
> UI 파일: `src/features/site/components/ZeroItFullPage.tsx`

---

### [FIX-ZEROIT-01] OAuth 쿠키 만료 시 진행 상황 초기화 문제

- **문제**: `github_connected`, `netlify_connected` 쿠키의 만료 시간이 1시간으로 설정되어 있어, 유저가 OAuth 인증을 마치고 장시간 작업하다 보면 쿠키가 만료되어 ZeroIT 화면이 1단계로 초기화됨.
- **해결**: 두 쿠키의 `maxAge`를 **30일(1000 * 60 * 60 * 24 * 30)** 로 연장.
- **핵심**: 토큰 자체는 DB(`user_metadata`)에 안전하게 저장되어 있으므로 쿠키는 단순히 UI 상태 표시용임. 만료되어도 보안 문제 없음.

```typescript
// 올바른 설정 (30일)
res.cookie('github_connected', 'true', { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: false });
res.cookie('netlify_connected', 'true', { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: false });
```

---

### [FIX-ZEROIT-02] Netlify 사이트가 보이지 않는 숨겨진 팀(Account)에 생성되는 문제

- **문제**: Netlify API로 사이트를 생성할 때 `account_slug`를 지정하지 않으면, Netlify가 UI에서 보이지 않는 초기 계정(예: 과거 개인 팀 `Grid`)에 사이트를 강제 배치함. 유저가 대시보드에서 사이트를 찾을 수 없음.
- **해결**: `createNetlifySite()` 함수 내에서 먼저 `/api/v1/accounts` API를 호출하여 유저의 활성 팀 목록을 조회한 뒤, 첫 번째 팀의 `slug`를 사이트 생성 페이로드에 명시적으로 포함시킴.
- **파일**: `server/lib/netlify.ts`

```typescript
// 반드시 account_slug를 명시해야 올바른 팀에 사이트가 생성됨
const accountsRes = await axios.get('https://api.netlify.com/api/v1/accounts', { ... });
const accountSlug = accountsRes.data[0]?.slug;
const payload = {
  name: siteName,
  // ...
  account_slug: accountSlug, // ← 이 줄이 없으면 숨겨진 팀에 생성됨!
};
```

---

### [FIX-ZEROIT-03] 동일 계정 중복 저장소 이름 충돌 방지

- **문제**: 유저가 같은 도메인으로 배포를 여러 번 시도하거나, 이전에 같은 이름의 저장소가 존재하면 GitHub에서 `Name already exists` 422 에러 발생.
- **해결**: 저장소 이름 생성 시 `Math.random().toString(36).substring(2, 6)`으로 4자리 무작위 접미사를 항상 붙임.

```typescript
// 올바른 패턴: repoName = "mysite-com-a1b2"
const randomSuffix = Math.random().toString(36).substring(2, 6);
const repoName = `${cleanDomain.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()}-${randomSuffix}`;
```

---

### [FIX-ZEROIT-04] Netlify 도메인 연결 시 `custom_domain must be unique` 에러

- **문제**: 유저의 도메인이 Netlify 시스템 내 다른 사이트(또는 삭제된 계정의 사이트)에 이미 등록되어 있으면 422 에러 발생. 전체 배포가 실패한 것처럼 보임.
- **해결**: `setNetlifyDomain()` 호출을 `try/catch`로 감싸고, 도메인 연결 실패는 **비치명(non-critical)** 으로 처리. 깃허브 저장소·넷리파이 호스팅 자체는 정상 생성됨. 유저에게는 별도 안내 화면을 통해 도메인을 수동으로 추가하도록 가이드.
- **핵심**: 도메인 연결 실패가 전체 파이프라인을 멈춰서는 안 됨. `continue` 처리 필수.

```typescript
try {
  await setNetlifyDomain(netlifyToken, siteId, cleanDomain);
} catch (e) {
  // 도메인 충돌이 있어도 배포는 계속 진행
  console.warn('Failed to set domain, continuing...', e);
}
```

---

### [FIX-ZEROIT-05] 배포 완료 후 maza-blog가 사이트 설정을 못 읽는 문제 (수정됨)

- **⚠️ 문서 오류 수정**: `sites` 테이블은 존재하지 않음. `maza-blog/src/lib/api.ts`는 `sites` 테이블에서 직접 읽어옴.
- **실제 해결**: ZeroIT 배포 시 `sites` 테이블 insert는 이미 수행됨 (5단계). 추가로 필요한 것은 **Netlify 환경변수에 Supabase 연결 정보 주입** — 없으면 maza-blog가 DB에 연결 못해 빈 화면.
- **파일**: `server/routes/zeroit.ts` - setNetlifyEnvVars() 호출

```typescript
// [FIX] Netlify 배포 환경변수에 Supabase 공용 키 주입 필수
await setNetlifyEnvVars(netlifyToken, siteId, {
  PUBLIC_SITE_DOMAIN: cleanDomain,
  SITE_DOMAIN: cleanDomain,
  PUBLIC_SUPABASE_URL: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
  PUBLIC_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
  MAZA_MANAGED: 'true'
});
```

---

### [FIX-ZEROIT-06] maza-blog SEO 필수 파일 자동 생성 구조

- **ads.txt**: `src/pages/ads.txt.ts` — Astro API Route로 `getSiteConfig()`의 `adsense_pub` 값을 읽어 동적 생성. 값이 없으면 404 반환.
- **sitemap.xml**: `@astrojs/sitemap` 플러그인 + `astro.config.mjs`에 `site` URL 설정으로 빌드 시 자동 생성.
- **rss.xml**: `src/pages/rss.xml.ts` — `getApprovedPosts()`로 게시글을 조회하여 표준 RSS 포맷으로 반환.
- **구글 사이트 인증 메타 태그**: `Layout.astro` — `siteConfig?.metadata?.google_site_verification` 값이 있을 때만 `<head>`에 자동 주입.
- **애드센스 스크립트**: `Layout.astro` — `siteConfig?.adsense_pub` 값이 있을 때만 자동 주입. (**이미 구현됨, 훼손 금지**)
- **RSS 자동검색 링크**: `Layout.astro` — `<link rel="alternate" type="application/rss+xml" href="/rss.xml">` 태그를 항상 주입.

> ⚠️ **주의**: `astro.config.mjs`는 `output: 'static'`으로 설정되어야 함. `server` 모드나 `vercel` 어댑터를 사용하면 `ads.txt`, `sitemap.xml` 정적 생성이 깨짐.

---

### [FIX-ZEROIT-07] ZeroIT 배포 환경변수 주입 규칙

Netlify에 환경변수를 주입할 때 반드시 아래 두 키를 **모두** 포함해야 함:

| 키 | 용도 |
|---|---|
| `PUBLIC_SITE_DOMAIN` | Astro `import.meta.env`에서 클라이언트 사이드에서 도메인 참조 |
| `SITE_DOMAIN` | Astro 서버 사이드(SSR) 및 `api.ts`의 `getSiteConfig()` 도메인 조회 |
| `MAZA_MANAGED` | Maza가 관리하는 사이트임을 표시하는 플래그 |

```typescript
await setNetlifyEnvVars(netlifyToken, siteId, {
  PUBLIC_SITE_DOMAIN: cleanDomain,  // PUBLIC_ 접두사 있어야 Astro 클라이언트에서 접근 가능
  SITE_DOMAIN: cleanDomain,
  MAZA_MANAGED: 'true'
});
```

---

### 핵심 교훈 (다시는 반복하지 말 것)
1. **Netlify 팀 명시는 필수** — `account_slug` 없이 생성하면 유저가 대시보드에서 사이트를 절대 찾을 수 없음.
2. **도메인 연결 실패는 비치명 처리** — 도메인 충돌 에러가 전체 배포를 막아서는 안 됨.
3. **쿠키 만료 주의** — OAuth 연동 상태를 쿠키로 관리할 때 유저 세션 길이를 충분히 고려한 만료 시간 설정 필수.
4. **sites 테이블 insert + Netlify 환경변수 주입 필수** — ZeroIT는 `sites` 테이블 insert와 함께 Netlify에 `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`를 반드시 주입해야 maza-blog가 정상 작동. (`sites` 테이블은 존재하지 않음)
5. **maza-blog는 `output: server`(SSR) 유지** — 도메인별 Supabase 데이터를 런타임에 조회하므로 SSR 필수. static 전환 불가.

*최종 업데이트: 2026-06-14 (ZeroIT 자동 구축 파이프라인 전면 완성 및 SEO 자동화 추가)*

---

## [2026-06-15] 챌린지 페이지 (ChallengePage) 진행 상태 무한 루프 & Tistory 페이지 발행 에러 해결 (PERMANENT FIX)

> 관련 파일: `src/features/challenge/pages/ChallengePage.tsx`, `server/index.ts`

### [FIX-CHALLENGE-01] 티스토리 페이지 에디터 진입 시 URL 리다이렉트 문제 (치명)
- **원인**: 백엔드가 `type === 'page'`일 때 `https://{domain}/manage/page`로 연결함. 그러나 티스토리는 이 URL을 `manage/page?returnURL=/manage/pages/write`로 리다이렉트시킴. 익스텐션의 정규식은 `page\b`에 반응하지만, `isListPage` 로직에서 `write` 문자열이 포함되어 리스트 페이지가 아닌 것으로 착각하고, 에디터를 찾지 못한 뒤 무한 대기에 빠짐.
- **결과**: 법적 문서(Phase 5) 자동 발행 시 에디터 로딩 화면에서 완전히 멈춰버림.
- **수정**: 서버에서 애초에 `https://{domain}/manage/pages/write` 다이렉트 에디터 URL로 보내도록 변경.
- **파일**: `server/index.ts`

### [FIX-CHALLENGE-02] Challenge Phase 강제 역진행 (무한 루프) (치명)
- **원인**: `ChallengePage.tsx`에서 특정 단계를 마칠 때(예: 니치 포스팅, 법적 문서), DB에서 사이트 정보를 다시 불러오는 과정(`fetchSites`)에서 로컬 DB 갱신 지연 또는 메타데이터 누락으로 인해 이전 단계로 강제 복귀함. 또한 UI 상에 Phase 4(법적 문서)와 Phase 5(전략 설계)의 순서가 로직(`autoDeterminePhase`)과 반대로 되어 있었음.
- **결과**: "다음 챌린지로 진행" 버튼을 눌러도 넘어가지 않거나 엉뚱한 단계로 루프백됨.
- **수정**:
  1. `autoDeterminePhase`의 순서를 Phase 4 (전략 설계) → Phase 5 (법적 문서)로 올바르게 재배치하고, 조건에 `!currentSite.metadata?.has_legal_docs` 검사를 추가함.
  2. 각 Phase의 `onComplete` 함수 안에서 `fetchApi('/api/sites/upsert')`를 통해 `has_niche_posts: true`, `has_legal_docs: true` 등 메타데이터를 백엔드에 즉시 갱신시킨 뒤 `setActivePhase`를 호출하도록 수정함.
- **파일**: `src/features/challenge/pages/ChallengePage.tsx`

### 핵심 교훈 (다시는 반복하지 말 것)
1. **의존적인 상태 업데이트 시 즉각 반영 보장** — 백엔드 데이터 수집 지연이 있는 경우(포스트 개수 등), 로컬 챌린지 상태를 관리하기 위해 즉각적인 완료 플래그(`has_xyz: true`)를 메타데이터에 심어 상태 전이를 부드럽게 해야 함.
2. **티스토리 다이렉트 URL 사용** — 티스토리 관리자 페이지의 리다이렉트는 URL 패턴을 변질시켜 정규식을 우회하므로, 처음부터 가장 종단점인 다이렉트 에디터 URL(`/manage/pages/write`, `/manage/newpost`)을 사용해야 함.

*최종 업데이트: 2026-06-15 (챌린지 페이지 진행 상태 루프 & 에디터 에러 전면 해결)*
