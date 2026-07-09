# 티스토리 페이지(Page) 발행 버그 — 완전 해결 기록
> 작성일: 2026-06-12  
> 증상 → 원인 분석 → 수정 내역 → 재발 방지 원칙

---

## 1. 증상 (Symptoms)

- "개인정보처리방침" 등 법적 페이지를 **페이지 관리(pages)**에 발행 요청 시 글이 생성되지 않음
- 로그에 `Task finished: FAILED` 또는 `message channel closed` 출력 후 종료
- 가끔 글 관리(posts)에 잘못 발행되는 현상 발생
- 익스텐션 콘솔에 `[Duplicate Guard] Task execution already in progress. Skipping deliverTask` 출력

---

## 2. 근본 원인 체인 (Root Cause Chain)

### 원인 1: 잘못된 티스토리 페이지 에디터 URL

| 시도한 URL | 결과 |
|-----------|------|
| `/manage/pages` | ✅ 존재하지만 **목록 페이지** — 에디터 아님 |
| `/manage/newpage` | ❌ 404 — 존재하지 않는 엔드포인트 |
| `/manage/newpost/?type=page` | ❌ 글(post) 에디터로 리다이렉트됨 |
| `/manage/page` (단수) | ✅ **실제 페이지 에디터** — 정답 |

> **핵심:** 티스토리는 글과 페이지의 에디터 URL이 완전히 다름  
> - 글 에디터: `/manage/newpost`  
> - 페이지 에디터: `/manage/page` (단수, new/write 없음)

### 원인 2: 목록 페이지에서의 SPA 이동 → 메시지 채널 단절

```
[흐름]
탭 열림 (/manage/pages 목록)
  → injector.js READY 전송
  → background: task 전달 (RUN_TASK)
  → injector.js: handleTask() → injectContent() → prepareEditor()
  → prepareEditor(): 에디터 없음 → "새 페이지 쓰기" 버튼 클릭
  → SPA 이동 → /manage/page 에디터로 이동
  → [!] content script 교체 → 메시지 채널 즉시 끊김
  → background: 'message channel closed' 에러 → FAILED 처리
  → 새 content script READY 전송
  → background: "NO TASK for tab" — task 이미 실패로 처리됨
```

### 원인 3: Self-Deadlock (자기 교착) 버그

```
executeTask()
  └─ tryStartTaskExecution() → executingTaskId = task.id 설정 (락 획득)
  └─ 탭 생성 후 READY 수신
  └─ deliverTask() 호출
       └─ isTaskExecutionInProgress() === true (자기가 건 락)
       └─ "Duplicate Guard: already in progress" → 전달 차단 ❌
```

**수정:** `deliverTask`의 가드를 "동일 탭이면 허용"으로 변경
```typescript
if (isTaskExecutionInProgress() && getExecutingTaskTabId() !== tabId) {
  // 다른 탭 실행 중일 때만 차단
}
```

### 원인 4: 성급한 메모리 삭제 (Race Condition)

```
background.ts의 CONTENT_SCRIPT_READY 핸들러:
  task 전달 전에 lastImmediateTask = null 실행
  → 전달 실패 후 다음 READY 시 task 없음
```

### 원인 5: 전달 실패 후 복구 불가

```
deliverTask catch 블록:
  task는 메모리에 유지했지만
  _deliveredTasks Set에서 제거 안 함
  → 다음 READY 시 "이미 전달됨"으로 오인하여 재전달 차단
```

---

## 3. 수정 내역 (Fixes Applied)

### Fix 1: 페이지 에디터 URL 전면 교정

```typescript
// server/index.ts, taskRouter.ts (2곳) 수정
// Before:
? `https://${domain}/manage/pages`    // ❌ 목록 페이지
? `https://${domain}/manage/newpage`  // ❌ 404

// After:
? `https://${domain}/manage/page`     // ✅ 실제 에디터
```

### Fix 2: isTistoryWritePage 정규식 갱신

```typescript
// extension/content/injector.ts
export function isTistoryWritePage(url: string) {
  return /\/(?:manage\/(?:newpost|newpage|page$|pages?\/write|...)|...)/.test(url);
  //                              ^^^^^^ /manage/page 추가
}
```

### Fix 3: Self-Deadlock 해제

```typescript
// extension/background/execution/taskRouter.ts
export function deliverTask(task, tabId, proactive = false) {
  if (isTaskExecutionInProgress() && getExecutingTaskTabId() !== tabId) {
    // 다른 탭이면 차단, 같은 탭이면 통과
    return;
  }
  // ...
}
```

### Fix 4: 성급한 메모리 삭제 제거

```typescript
// extension/background/background.ts - CONTENT_SCRIPT_READY 핸들러
// 제거: (globalThis as any).lastImmediateTask = null;
// 제거: clearLastImmediateTask().catch(() => {});
// task 전달 완료(성공/실패) 시점에만 정리
```

### Fix 5: 전달 실패 시 deliveredSet 롤백

```typescript
// extension/background/execution/taskRouter.ts
}).catch((err) => {
  log('SYSTEM', `Delivery failed. Task kept in memory.`);
  // 재시도 가능하도록 Set에서 제거
  const deliveredSet = (globalThis as any)._deliveredTasks;
  if (deliveredSet) deliveredSet.delete(task.id);
});
```

### Fix 6: 무한 새로고침 루프 방지

```typescript
// extension/content/injector.ts
// currentUrl === taskUrl 일 때는 강제 이동하지 않음
const currentUrlBase = currentUrl.split('?')[0].split('#')[0];
const taskUrlBase = task.url.split('?')[0].split('#')[0];
if (currentUrlBase !== taskUrlBase) {
  window.location.href = task.url;
  return { status: "NAVIGATING_TO_EDITOR" };
}
// 같은 URL이면 그대로 injectContent() 진행
```

---

## 4. 수정된 파일 목록

| 파일 | 변경 내용 |
|------|-----------|
| `server/index.ts` | 페이지 publishUrl → `/manage/page` |
| `extension/background/execution/taskRouter.ts` | URL 2곳 수정, deliverTask Self-Deadlock 해제, 전달 실패 롤백 |
| `extension/background/background.ts` | READY 핸들러에서 성급한 task 메모리 삭제 제거 |
| `extension/content/injector.ts` | isTistoryWritePage 정규식 갱신, 무한 새로고침 방지 |
| `extension/platforms/tistory/workflow/editor.ts` | isPageManage 정규식 갱신 |
| `extension/background/tabManager.ts` | isPageRedirect 조건 갱신 |

---

## 5. 재발 방지 원칙 (Never Again Rules)

### Rule 1: 티스토리 URL 진실의 표 (Source of Truth)

| 목적 | 올바른 URL |
|------|-----------|
| 글(post) 에디터 | `/manage/newpost` |
| 페이지(page) 에디터 | `/manage/page` ← **단수, 이것만 사용** |
| 스킨 에디터 | `/manage/design/skin/edit` |
| 글 목록 | `/manage/posts` |
| 페이지 목록 | `/manage/pages` ← **에디터 아님, task URL로 절대 사용 금지** |

> ⚠️ `/manage/pages` (복수)는 목록 페이지, `/manage/page` (단수)는 에디터. 헷갈리지 말 것.

### Rule 2: Task URL은 반드시 에디터 직행 URL이어야 함

```
❌ 금지: 목록 페이지 URL을 task.url로 설정
         → prepareEditor()가 버튼 클릭 → SPA 이동 → 채널 단절

✅ 필수: task.url은 항상 최종 에디터 URL로 설정
         → injector가 에디터에서 바로 injectContent() 실행
```

### Rule 3: chrome.tabs.sendMessage는 탭 이동 중 반드시 실패함

```
탭이 이동(navigate)하는 순간:
  - content script 언로드 → 메시지 채널 즉시 종료
  - chrome.runtime.sendMessage 응답 없음 → 'message channel closed'
  
이것은 에러가 아니라 정상 동작임.
처리 방법:
  1. content script가 이동 전 NAVIGATING_TO_EDITOR를 동기적으로 반환
  2. background가 다음 READY 신호를 기다림
  3. 새 페이지에서 READY → task 재전달
```

### Rule 4: Duplicate Guard는 탭 기준으로

```typescript
// ❌ 잘못된 가드 — task 실행 중이면 무조건 차단 (Self-Deadlock 유발)
if (isTaskExecutionInProgress()) return;

// ✅ 올바른 가드 — 다른 탭에 대해서만 차단
if (isTaskExecutionInProgress() && getExecutingTaskTabId() !== tabId) return;
```

### Rule 5: 메모리 정리는 task 완료 시점에만

```
❌ READY 신호 수신 시 lastImmediateTask = null → Race condition
✅ deliverTask 성공 응답 후 clearLastImmediateTask() → 안전
✅ 전달 실패 시 _deliveredTasks.delete(task.id) → 재시도 가능
```

---

## 6. 디버깅 체크리스트 (미래 유사 버그 대응)

페이지 발행이 안 될 때 확인 순서:

1. **task.url 확인**: `/manage/page` (단수)인지? 목록 URL 아닌지?
2. **메시지 채널 에러**: `message channel closed` → 탭 이동 감지 → NAVIGATING_TO_EDITOR 처리 확인
3. **Duplicate Guard 로그**: `Task execution already in progress` → `getExecutingTaskTabId()` 비교 로직 확인
4. **READY 후 NO TASK**: `lastImmediateTask`가 READY 수신 시 지워졌는지 확인
5. **재전달 차단**: `_deliveredTasks` Set에서 실패한 task가 제거됐는지 확인

### Fix 7: 에디터 오인 클릭 (SPA 라우팅 충돌) 해결 (2026-06-13)
- **원인**: `editor.ts`에서 에디터 감지 대기 전, URL에 `/write`나 `/newpost`가 없으면 목록 페이지로 간주하여 강제로 "새 글/페이지 쓰기" 버튼을 찾는 로직이 존재함. `/manage/page`는 에디터임에도 `/write` 등이 포함되지 않아, 코드가 현재 페이지를 목록 페이지로 오해하고 버튼을 찾아 클릭하는 문제가 발생.
- **결과**: 에디터 내부의 다른 요소(또는 헤더의 버튼)가 잘못 눌려 원치 않는 SPA 라우팅이 발생, content script 교체 및 메시지 채널 단절.
- **수정**: 해당 조건문에 `!/\/manage\/page\/?(?:\?|#|$)/.test(window.location.href)` 를 추가하여, URL이 정확히 페이지 에디터인 경우 버튼 클릭 스킵 로직 적용.
