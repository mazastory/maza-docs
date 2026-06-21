# Maza Studio 버그 리포트

> 발생한 버그와 수정 내역을 기록합니다. 동일한 에러가 재발하지 않도록 원인과 방어 로직을 명시합니다.

---

## [BUG-001] 즉시 발행이 작동하지 않는 현상 (publishing 고착 상태)

**발생일:** 2026-06-01  
**심각도:** 🔴 Critical  
**영향:** 즉시 발행 버튼 클릭 후 발행이 영구적으로 멈추는 현상

### 증상
- 사용자가 "즉시 발행" 버튼을 클릭해도 발행이 되지 않음
- 서버 로그에는 "Task assigned to extension" 로그가 찍히지만 발행이 완료되지 않음
- 두 번째로 "즉시 발행"을 클릭하면 "Existing active schedule found. Skipping duplicate schedule creation." 로그만 나오고 중단됨
- DB에서 해당 태스크는 `publishing` 상태로 무기한 고착됨

### 근본 원인 (4가지 복합 버그)

#### 원인 1: Stuck task 복구 기준 시간이 너무 길었음 (30분)
- **위치:** `server/routes/tasks.ts` → `GET /api/tasks/next`
- **문제:** `publishing` 상태가 30분 이상 지난 태스크만 정리 대상으로 판단
- **결과:** `force_publish` 태스크가 Extension에서 실패(타임아웃 등)하여 3분 만에 고착되어도, 30분 동안 아무런 정리가 이루어지지 않음

#### 원인 2: Stuck task 복구 시 `failed`로 처리 (재시도 불가)
- **위치:** `server/routes/tasks.ts` → stuck task cleanup 블록
- **문제:** 고착된 태스크를 `failed` 상태로 업데이트 → 사용자가 재시도할 수 없음
- **결과:** 영구적으로 발행 실패 상태가 됨

#### 원인 3: W-05 간격 계산에 `PUBLISHING` 상태 포함
- **위치:** `server/routes/tasks.ts` → `buildW05Delay()` 함수
- **문제:** 최근 발행된 글 목록 조회 시 `PUBLISHED`, `VERIFYING`, `PUBLISHING` 세 가지 상태 모두 포함
- **결과:** 고착된 `publishing` 태스크가 "최근에 발행한 글"로 오인되어, 다음 태스크에 불필요한 W-05 대기 시간이 붙음

#### 원인 4: 중복 스케줄 감지 시 `publish_at` 기준으로 3분 체크 (잘못된 필드)
- **위치:** `server/routes/platforms.ts` → `POST /publish-post`
- **문제:** `activeSchedule.publish_at` (발행 예약 시각)을 기준으로 3분 체크
- **결과:** `publish_at`이 이미 과거 시간이면 즉시 `isStuck = true`가 되거나, 반대로 미래 시간이면 절대 stuck으로 판단되지 않음. 실제 처리 시작 시각인 `started_at`을 써야 정확함

### 수정 내역

| 파일 | 수정 내용 |
|------|----------|
| `server/routes/tasks.ts` | Stuck 판단 기준: `force_publish` 태스크는 **3분**, 일반 태스크는 **30분** 으로 분리 |
| `server/routes/tasks.ts` | Stuck 태스크 복구 시 `failed` → `ready_to_publish`로 변경 (재시도 가능하도록) |
| `server/routes/tasks.ts` | `buildW05Delay()` 쿼리에서 `PUBLISHING` 상태 제외 (`PUBLISHED`, `VERIFYING`만 포함) |
| `server/routes/platforms.ts` | 중복 스케줄 감지 시 `publish_at` → `started_at` 기준으로 3분 체크로 변경 |

### 재발 방지 포인트
> ⚠️ **주의:** W-05 간격 계산 쿼리를 수정할 때 `status` 필터에 `PUBLISHING`을 추가하지 말 것.  
> ⚠️ **주의:** Stuck task 복구 시 반드시 `ready_to_publish`로 복구할 것. `failed`로 처리하면 사용자 재시도 불가.  
> ⚠️ **주의:** `publish_at`은 "예약된 발행 시각", `started_at`은 "Extension이 처리 시작한 시각". Stuck 판단은 항상 `started_at` 기준.

---

## [BUG-002] 저작권 footer 이후에 본문 내용이 추가로 출력되는 현상

**발생일:** 2026-06-01  
**심각도:** 🟠 High  
**영향:** 티스토리 발행된 글에서 `© 2026 ... ALL RIGHTS RESERVED.` 이후에 추가 본문 내용(HOW-TO GUIDE 등)이 또 나타나는 레이아웃 오염

### 증상
- 티스토리 발행 글을 보면 footer 저작권 문구 (`© 2026 ZEROWORK.TISTORY.COM. ALL RIGHTS RESERVED.`) 이후에
- `HOW-TO GUIDE` 레이블과 추가 본문 텍스트, 이미지 등이 또 나타남
- 마치 글 내용이 두 번 렌더링되는 것처럼 보임

### 근본 원인

AI(Gemini)가 `content1` 또는 `content2` 필드 텍스트를 생성할 때, **텍스트 끝부분에 footer 형식의 문구를 자체적으로 포함**시키는 현상 발생.

예를 들어 AI가 content2 필드로 다음과 같은 텍스트를 생성:
```
...이렇게 활용하면 효과적입니다.

© 2026 ZEROWORK.TISTORY.COM. ALL RIGHTS RESERVED.

HOW-TO GUIDE

다음은 실전 활용 방법입니다...
```

이 텍스트가 `formatBody()` 함수에서 그대로 `<p>` 태그로 렌더링되면:
1. 저작권 문구가 본문 중간에 출력됨
2. 그 이후 내용(`HOW-TO GUIDE`, 추가 본문)도 함께 출력됨
3. 템플릿의 실제 `footerHtml()`이 그 뒤에 또 붙어서 footer가 두 번 나타남

### 수정 내역

| 파일 | 수정 내용 |
|------|----------|
| `server/lib/rendererAgent.ts` | `stripAIFooterArtifacts()` 함수 추가: `©`, `copyright`, `면책조항:`, `---` 수평선 이후 내용을 자동 제거 |
| `server/lib/rendererAgent.ts` | `formatBody()` 함수에서 `stripAIFooterArtifacts()` 선행 호출 적용 |
| `server/lib/rendererAgent.ts` | `sanitizeRenderData()` 함수 추가: `applyHTMLTemplate()` 진입 전 모든 텍스트 필드(content1, content2, intro, outro, experienceNote, summary, insightBox, definitionSection.content)에 자동 정리 적용 |

### 제거 대상 패턴 (정규식)
```
© YYYY [텍스트] ALL RIGHTS RESERVED.
copyright © YYYY ...
**면책 조항:** ...
면책 조항: ...
--- (수평선) 이후 모든 내용
```

### 재발 방지 포인트
> ⚠️ **주의:** AI 프롬프트에 "저작권 문구, 면책 조항, 수평선(---) 같은 footer 요소를 content 필드에 포함하지 말 것"을 명시적으로 지시해야 함.  
> ✅ **방어 로직:** `stripAIFooterArtifacts()`와 `sanitizeRenderData()`가 이미 방어하고 있으므로, 새로운 텍스트 필드 추가 시 반드시 `sanitizeRenderData()`의 `textFields` 배열에 포함시킬 것.

---

## [BUG-003] 테이블 레이아웃이 세로로 찌그러지는 현상

**발생일:** 2026-06-01  
**심각도:** 🟡 Medium  
**영향:** 티스토리 발행 글의 비교표(Table)가 정상적으로 렌더링되지 않고 글자가 세로로 한 줄씩 출력됨

### 증상
- 비교표에서 3개 열(Column)이 있어야 하는데, 글자가 세로로 한 글자씩 나열됨
- 테이블 행(row)이 비정상적으로 많은 열을 가짐

### 근본 원인

AI가 `comparisonData.rows` 필드를 2차원 배열로 주어야 하는데, 1차원 배열로 길게 풀어서 전달하는 경우 발생.

**정상:** `[["항목A", "내용A", "평가A"], ["항목B", "내용B", "평가B"]]`  
**비정상:** `["항목A", "내용A", "평가A", "항목B", "내용B", "평가B"]`

비정상 데이터가 오면 1개의 `<tr>` 안에 6개의 `<td>`가 생성되어 레이아웃이 붕괴됨.

### 수정 내역

| 파일 | 수정 내용 |
|------|----------|
| `server/lib/rendererAgent.ts` | `normalizeRows()` 함수 추가: 1차원 배열로 온 row를 헤더 개수 기준으로 자동 chunk |
| `server/lib/rendererAgent.ts` | 모든 템플릿(A~E)의 테이블 렌더링에 `normalizeRows()` 적용 |

### 재발 방지 포인트
> ✅ **방어 로직:** `normalizeRows()`가 이미 방어하고 있음.  
> ⚠️ **주의:** 새로운 테이블 렌더링 코드 추가 시 반드시 `normalizeRows(headers, rows)` 를 통해 rows를 정규화할 것. `rows`를 직접 `.map()`하지 말 것.

---

## [BUG-004] 스피드 모드 무시 및 W-05 대기열 강제 적용 (발행 지연 버그)

**발생일:** 2026-06-21  
**심각도:** 🔴 Critical  
**영향:** 사용자가 설정한 '빠른 예약 모드(Speed Mode)'가 무시되고, 티스토리 예약 팝업이 10분마다 뜨는 대신 2~3시간 단위로 지연되어 발행 프로세스가 마비됨.

### 증상
- 사용자는 `autopilot_rules.publishMode = 'speed'`로 설정하여 글 생성은 즉시 완료되고, 10분마다 크롬 익스텐션이 팝업되어 예약만 걸어두길 원했음.
- 그러나 AI 워커(`publishWorker.ts`)와 스케줄러(`promoteOnHold.ts`, `taskDelayHelper.ts`, `hunter.ts`)가 스피드 모드를 인지하지 못하고 일괄적으로 W-05 규약(2시간~3시간 간격)을 강제 적용.
- 결과적으로 AI 생성 자체가 2시간 뒤로 밀리고, 익스텐션도 2시간 뒤에나 뜨는 심각한 병목 현상 발생.
- 또한 익스텐션에서 티스토리 '예약' 라디오 버튼 클릭 로직이 고장나 '즉시 발행'으로 우회됨.

### 근본 원인
1. **W-05의 강제성 오해:** AI 에이전트가 코드를 수정하면서 어뷰징 방지를 명목으로 유저의 '스피드 모드' 의도를 무시하고 `getW05IntervalSeconds` 간격을 무조건 적용해버림.
2. **React 이벤트 누락:** 티스토리 예약 탭을 활성화하는 DOM 클릭 이벤트 로직이 삭제되어, 익스텐션이 예약 날짜를 입력하려 해도 화면이 넘어가지 않음.

### 수정 내역

| 파일 | 수정 내용 |
|------|----------|
| `server/workers/publishWorker.ts` | `getRequiredW05WaitSeconds` 호출 시 `isSpeedMode`를 확인하여 대기시간을 0으로 처리 (AI 즉시 생성) |
| `server/lib/schedulerService/promoteOnHold.ts` | `isSpeedMode`일 경우 AI가 대기 없이 바로 글을 쓰도록 `publish_at`을 `Date.now()`로 즉시 할당 |
| `server/lib/intervalErrorCleanup.ts` | `isSpeedMode`일 경우 에러를 즉시 해제하고 바로 `publish_at`을 갱신하도록 우회 추가 |
| `server/routes/hunter.ts`, `engine.ts` | 시리즈 배차 시 `isSpeedMode`면 `intervalMs`를 무시하고 즉시 `Date.now()`로 할당 |
| `server/lib/taskOrchestrator.ts` | **(핵심)** 익스텐션에 넘겨줄 때 티스토리 실제 예약 시간(`target_publish_at`)을 히스토리의 '마지막 예약/발행 시간 + 유저가 선택한 예약 간격'으로 동적 계산. 단, 계산된 시간이 **이미 과거라면 (즉, 쿨타임 충족) 뒤로 미루지 않고 즉시 발행(`Date.now()`)** 하도록 강제. (반대로 미래라면 최소 45분 버퍼를 보장하여 예약 룰 통과) |
| `extension/platforms/tistory/workflow/publishLayer.ts` | 예약 라디오 버튼을 강제로 찾아 클릭하고, 날짜/시간 input 폼을 React 환경에 맞게 `value` setter 및 `dispatchEvent`로 입력하도록 복구 |

### 재발 방지 포인트
> 🚨 **경고 (절대 수정 금지):** `AGENTS.md`의 **[6. User-Choice Publishing & Series Rules]** 섹션에 스피드 모드의 절대 보장 원칙을 명시했습니다. 미래의 어떠한 AI 에이전트도 어뷰징 방지나 안전을 이유로 이 아키텍처(AI 무제한 직행 -> 익스텐션 10분 배차 -> 예약 시간 동적 계산)를 훼손해서는 안 됩니다.

---

*마지막 업데이트: 2026-06-21*
