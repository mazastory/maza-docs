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
  - `gemini-3-flash-preview` ✅ **(기본 Primary — 사용자 권장)**
  - `gemini-3.1-pro-preview` ✅ (1차 Fallback / 고품질 추론용)
  - `gemini-2.5-flash` ✅ (2차 Fallback)
  - `gemini-2.5-pro` ✅ (최종 Fallback)
- **최종 확정 폴백 체인** (`aiClient.ts` 내 callAI, callAIStream 공통):
  ```
  gemini-3-flash-preview → gemini-3.1-pro-preview → gemini-2.5-flash → gemini-2.5-pro → 종료(throw)
  ```
- **핵심 규칙**: `server/lib/aiClient.ts` 내 **모든 위치**를 동시에 업데이트해야 함.
- **파일**: `server/lib/aiClient.ts`
- **참조 KI**: `/Users/m/.gemini/antigravity/knowledge/ai-model-registry/artifacts/model-registry.md`

### [FIX-07] 인프라 코드(GA4/GSC) 주입 데이터 매핑 오류 (PERMANENT FIX)
- **근본 원인**: 익스텐션 사이드 패널에서 서버 API(`api/sites`) 데이터를 가져올 때, DB 스키마 필드명(`ga_measurement_id`, `sc_verification`) 대신 잘못된 필드명(`ga4_id`, `gsc_tag`)을 사용하여 주입할 코드가 `undefined`로 전달됨.
- **해결**: 사이드 패널(`side_panel.js`)의 데이터 매핑 로직을 DB 스키마와 100% 일치하도록 수정함.
- **파일**: `extension/side_panel.js`, `supabase/schema.sql`
- **핵심 규칙**: 모든 인프라 관련 데이터는 반드시 `ms_sites` 테이블의 표준 필드명을 따르며, 익스텐션 내에서 임의로 필드명을 변경하지 말 것.

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

## 7. 오토파일럿 발행 엔진 관련 (2026-06-01)

### [FIX-30] 즉시 발행 고착 (publishing stuck) — 4중 복합 버그 (PERMANENT FIX)

- **근본 원인**: 즉시 발행(force_publish) 버튼 클릭 후 Extension에서 실패하면, 태스크가 `publishing` 상태로 영구 고착되어 재시도되지 않는 현상. 4개의 독립적인 버그가 복합 작용.

#### BUG-30-1: Stuck 판단 기준이 30분으로 너무 길었음 (치명)
- **위치**: `server/routes/tasks.ts` → `GET /api/tasks/next` 내 Maintenance 블록
- **문제**: `publishing` 상태가 30분 이상된 태스크만 정리 대상으로 판단
- **결과**: `force_publish` 태스크가 Extension에서 3분 만에 타임아웃으로 실패해도, 30분 동안 아무런 복구가 이루어지지 않음
- **해결**: `force_publish: true`인 태스크는 **3분**, 일반 태스크는 **30분** 초과 시 복구

#### BUG-30-2: Stuck 태스크를 `failed`로 처리 (치명)
- **위치**: `server/routes/tasks.ts` → stuck task cleanup 블록
- **문제**: 고착된 태스크를 `failed` 상태로 업데이트 → 사용자가 재시도 불가
- **해결**: `ready_to_publish`로 복구 (`publish_at = now()`) → Extension 다음 폴링에서 자동 재시도

#### BUG-30-3: W-05 간격 계산에 `PUBLISHING` 상태 포함 (중)
- **위치**: `server/routes/tasks.ts` → `buildW05Delay()` 함수
- **문제**: 최근 발행 목록 조회 시 `PUBLISHED`, `VERIFYING`, `PUBLISHING` 모두 포함
- **결과**: 고착된 `publishing` 태스크가 "최근에 발행한 글"로 오인되어 다음 태스크에 불필요한 W-05 대기 시간 적용
- **해결**: W-05 계산 쿼리에서 `PUBLISHING` 상태 제외, `PUBLISHED`/`VERIFYING`만 포함

#### BUG-30-4: 중복 스케줄 감지 시 `publish_at`(잘못된 필드) 기준으로 3분 체크 (중)
- **위치**: `server/routes/platforms.ts` → `POST /publish-post` 내 `activeSchedule` 처리
- **문제**: `activeSchedule.publish_at` (발행 예약 시각)으로 3분 체크 → `publish_at`이 과거 시간이면 즉시 stuck으로 오판하거나 반대로 미래 시간이면 절대 stuck으로 판단 안 됨
- **해결**: `started_at` (실제 Extension이 처리 시작한 시각) 기준으로 3분 체크. `started_at`이 없으면 즉시 stuck으로 처리

- **파일**: `server/routes/tasks.ts`, `server/routes/platforms.ts`
- **핵심 규칙**:
  1. **절대 금지**: W-05 간격 계산 쿼리에 `PUBLISHING` 상태를 추가하지 말 것 — stuck task가 W-05 차단을 유발함
  2. **절대 금지**: Stuck 태스크를 `failed`로 처리하지 말 것 — 반드시 `ready_to_publish`로 복구해야 재시도 가능
  3. **필드 구분**: `publish_at`(예약 시각) vs `started_at`(처리 시작 시각). Stuck 판단은 항상 `started_at` 기준
  4. **force_publish 태스크**: 3분, 일반 태스크: 30분을 Stuck 기준으로 유지할 것

---

### [FIX-31] AI 생성 본문에 footer 아티팩트 삽입 → footer 이후 본문 재출력 (PERMANENT FIX) (2026-06-01)

- **근본 원인**: AI(Gemini)가 `content1`, `content2` 등 본문 필드를 생성할 때, 텍스트 끝부분에 `© 2026 ... ALL RIGHTS RESERVED.` 저작권 문구와 `HOW-TO GUIDE` 레이블, 추가 본문을 **직접 텍스트로 포함**시키는 현상 발생.
- **피해 경로**: AI 생성 content2 필드에 `© 2026 ZEROWORK.TISTORY.COM. ALL RIGHTS RESERVED.\n\nHOW-TO GUIDE\n\n다음은...` 삽입 → `formatBody()`가 이것을 `<p>` 태그로 그대로 렌더링 → 템플릿의 실제 `footerHtml()`이 그 뒤에 또 붙음 → footer가 두 번 나타나고 footer 사이에 추가 본문 노출
- **증상**: 티스토리 발행 글에서 `© 2026 ... ALL RIGHTS RESERVED.` 이후에 `HOW-TO GUIDE` 레이블과 추가 본문/이미지가 나타남

- **해결** (`server/lib/rendererAgent.ts`):
  1. `stripAIFooterArtifacts(text)` 함수 추가: `©`, `copyright`, `면책 조항:`, `---` 수평선 이후 내용을 정규식으로 탐지하여 해당 위치부터 이후 모든 텍스트 제거
  2. `sanitizeRenderData(data)` 함수 추가: `applyHTMLTemplate()` 진입 전 **모든 텍스트 필드**에 `stripAIFooterArtifacts` 일괄 적용
    - 대상 필드: `content1`, `content2`, `intro`, `outro`, `experienceNote`, `summary`, `insightBox`, `definitionSection.content`
  3. `formatBody()` 함수 내에서도 `stripAIFooterArtifacts` 선행 호출

- **파일**: `server/lib/rendererAgent.ts`
- **핵심 규칙**:
  1. **새 텍스트 필드 추가 시**: `sanitizeRenderData()`의 `textFields` 배열에 반드시 포함시킬 것
  2. **AI 프롬프트 작성 시**: "저작권 문구, 면책 조항, 수평선(---), HOW-TO GUIDE 같은 footer 요소를 content 필드에 포함하지 말 것"을 명시적으로 지시할 것
  3. `stripAIFooterArtifacts`의 패턴 목록은 AI 행동 패턴이 변경되면 업데이트할 것

---

### [FIX-32] AI 생성 비교표(Table) 데이터가 1차원 배열로 전달 → 레이아웃 붕괴 (PERMANENT FIX) (2026-06-01)

- **근본 원인**: AI가 `comparisonData.rows`를 2차원 배열 `[["A","B","C"],["D","E","F"]]`로 주어야 하는데, 1차원 배열 `["A","B","C","D","E","F"]`로 풀어서 전달하는 경우 발생
- **증상**: 3개 열짜리 비교표에 6~15개 열이 한 행(row)에 들어가 너비 부족으로 글자가 세로로 한 글자씩 출력됨 (레이아웃 완전 붕괴)

- **해결** (`server/lib/rendererAgent.ts`):
  - `normalizeRows(headers, rows)` 함수 추가: row 길이가 header 개수보다 많으면 header 개수 단위로 자동 chunk하여 새 행으로 분리
  - 모든 템플릿(A~E)의 테이블 렌더링에 `normalizeRows()` 적용

- **파일**: `server/lib/rendererAgent.ts`
- **핵심 규칙**:
  1. **절대 금지**: `data.comparisonData.rows.map()` 직접 호출 금지 — 반드시 `normalizeRows(headers, rows).map()`을 거칠 것
  2. 새로운 테이블 렌더링 코드 추가 시 `normalizeRows()`를 통해 rows를 정규화하는 것을 잊지 말 것

---
*최종 업데이트: 2026-06-01 (오토파일럿 발행 엔진 안정화 — 즉시 발행 고착, footer 재출력, 테이블 붕괴 수정)*


---

### [FIX-33] 발행 API 인터셉터가 썸네일 업로드/임시저장을 발행 성공으로 오판 (2026-06-01)

- **근본 원인**: `mainWorld.ts`의 fetch/XHR 인터셉터가 `method === 'POST' && isTistoryDomain` 조건으로 티스토리 도메인의 **모든 POST 요청**을 발행 성공으로 간주
- **증상**: 썸네일 이미지 업로드(`/upload`), 임시저장(`/autosave`) 등의 POST 요청 성공 시 `MAZA_PUBLISH_API_SUCCESS`가 조기 발사 → `PublishVerifier` 점수가 즉시 2.0 이상으로 올라 실제 발행 전에 발행 성공으로 오판할 수 있음
- **해결** (`extension/content/mainWorld.ts`):
  - fetch/XHR 인터셉터를 `/publish`, `/post/write`, `/entry/post`, `/manage/entry/post`, `/apis/post` 등 **실제 발행 전용 엔드포인트**로 한정
  - `/upload`, `/image`, `/attachment`, `/tempSave`, `/autosave`, `/draft` 포함 URL은 명시적으로 제외
- **핵심 규칙**: `isTistoryDomain && method === 'POST'` 조건만으로 발행 감지를 하면 안 됨. 반드시 발행 전용 URL 패턴을 명시해야 함.

---

### [FIX-34] 발행 레이어 열린 후 2차 태그 주입으로 태그 중복 등록 (2026-06-01)

- **근본 원인**: `publish.ts`에서 `tagManager.inject(foundTags)` 호출이 PUBLISH_LAYER 이전(1차)과 이후(2차) 총 2회 실행됨
- **증상**: 태그가 이미 1차에서 정상 등록되었음에도 2차 호출에서 동일 태그를 다시 입력 → 티스토리 에디터에 태그 중복 또는 비정상 입력 발생 가능
- **해결** (`extension/platforms/tistory/publish.ts`):
  - 2차 호출 시 태그 입력 필드가 이미 채워졌는지(`.value.trim().length > 0`) 체크
  - 비어있을 때만 2차 주입 시도 (1차 실패를 보수하는 용도로만 한정)
- **핵심 규칙**: `tagManager.inject()` 호출 전에 항상 태그 필드가 비어있는지 확인해야 함

---

### [FIX-35] 주제(홈주제) 드롭다운 fallback이 발행 레이어 밖의 버튼을 오클릭 (2026-06-01)

- **근본 원인**: `publish.ts`의 주제 드롭다운 fallback 탐색이 `document` 전체 범위에서 `.btn_select`, `[role="combobox"]`를 찾으며, `el.className?.includes('select')` 같은 지나치게 넓은 조건 사용
- **증상**: 발행 레이어 외부에 있는 다른 버튼이나 드롭다운을 주제 드롭다운으로 오인하여 클릭 → 예상치 못한 UI 변화 발생 가능
- **해결** (`extension/platforms/tistory/publish.ts`):
  - 탐색 root를 `modal`(발행 레이어 Element)로 제한 (`searchRoot = modal instanceof Element ? modal : document`)
  - 텍스트에 '주제'가 직접 포함된 요소만 선택 (class 기반 광범위 탐색 제거)
- **핵심 규칙**: 발행 레이어 내 요소 탐색은 항상 `modal` Element를 root로 사용해야 함. `document.querySelectorAll()` 직접 사용 금지.

