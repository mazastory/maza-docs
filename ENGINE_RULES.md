/**
 * =============================================
 * MAZA Studio - ENGINE RULES v1.0
 * =============================================
 * 이 문서는 AGENTS.md의 철학을 "강제 계약"으로 변환합니다.
 * 모든 규칙은 실제 코드 경로가 명시되어야 합니다.
 * 규칙을 어기는 코드는 PR 거절 대상입니다.
 * =============================================
 */

# ENGINE_RULES.md — Maza Autopilot OS 절대 규칙서
> 버전: 1.0 | 제정일: 2026-05-12
> 이 문서를 어기는 코드는 시스템에 병합할 수 없습니다.

---

## RULE-01: 모든 작업은 반드시 Queue를 통해야 한다

### 선언
직접 AI 호출(await callAI), 직접 발행 실행은 절대 금지합니다.

### 허용
```typescript
// ✅ 올바른 방식
await generateQueue.add('generate-post', { keyword, userId });
await publishQueue.add('publish-post', { postId, scheduledId });
```

### 금지
```typescript
// ❌ 금지 - Queue 우회
const result = await callAI(prompt); // 직접 실행
await WordPressAPI.post(domain, ...); // Worker 밖 직접 발행
```

### 예외 (명시적 허용만)
- `/api/generate/stream` 라우트: 스트리밍 UX를 위해 직접 AI 호출을 허용하되,
  반드시 `PostStatus.QUEUED`로 사전 DB 저장 후 실패 시 `PostStatus.FAILED` 전환을 강제한다.
  → 구현 파일: `server/routes/generate.ts` L158~

---

## RULE-02: 모든 Worker는 PostStatus Enum만 사용한다

### 선언
상태 문자열 리터럴을 Worker 코드에 직접 쓰는 것을 금지합니다.

### 유효한 상태 목록
→ 단일 정의 위치: `server/lib/postStatus.ts`

```
QUEUED → GENERATING → IMAGE_PROCESSING → VALIDATING
→ READY_TO_PUBLISH → PUBLISHING → VERIFYING → PUBLISHED
                                             → FAILED → DEAD
```

### 허용
```typescript
// ✅ Enum 사용
import { PostStatus } from '../lib/postStatus';
await supabase.from('ms_posts').update({ status: PostStatus.GENERATING });
```

### 금지
```typescript
// ❌ 금지 - 문자열 리터럴 직접 사용
await supabase.from('ms_posts').update({ status: 'generating' });
```

---

## RULE-03: Publish는 반드시 Verification을 통과해야 완료로 인정된다

### 선언
Extension의 "발행 성공" 보고만으로 PUBLISHED 처리를 금지합니다.
반드시 `VerificationAgent.verifyPost(url, title)` 통과 후 PUBLISHED 전환을 허용합니다.

### 검증 기준 (최소 조건)
- URL HTTP 200 응답
- 제목 텍스트 포함 확인
- 본문 길이 > 500자

### 구현 경로
→ `server/index.ts` - `/api/extension/mark-published` 엔드포인트
→ `server/lib/verificationAgent.ts`

### Failure Policy
- 검증 실패 → `PostStatus.FAILED_VERIFICATION`
- 3회 실패 → `PostStatus.DEAD` + 알림 발송

---

## RULE-04: Selector 하드코딩 금지

### 선언
Extension 콘텐츠 스크립트에서 CSS 선택자를 직접 사용하는 것을 금지합니다.

### 허용
```javascript
// ✅ Registry 사용
const titleEl = S.find(S.TISTORY.TITLE, 'T_TITLE');
```

### 금지
```javascript
// ❌ 금지 - 하드코딩
document.querySelector('.se-title-text');
document.querySelector('#post_title');
```

### 레지스트리 위치
→ `extension/content/selectors.js`

### 잔존 위반 파일 (수정 예정)
- `extension/content_naver.js` 일부 하드코딩 잔재

---

## RULE-05: Dead Job은 반드시 알림을 발생시킨다

### 선언
`PostStatus.DEAD` 상태로 전환 시 운영자에게 반드시 알림을 보냅니다.

### Dead 기준
→ `server/lib/postStatus.ts` - `FAILURE_POLICY.DEAD_AFTER_RETRIES = 3`

### 알림 채널
- 현재: `ms_events` 테이블 기록 (최소 보장)
- 향후: Slack webhook / 이메일

---

## RULE-06: Feedback Loop는 자동으로 실행되어야 한다

### 선언
`FeedbackEngine.syncPerformance()`는 반드시 자동 스케줄러에 의해 호출됩니다.
수동 호출에 의존하는 학습 루프는 학습 루프가 아닙니다.

### 구현 목표
→ cron: 매일 새벽 3시 `syncPerformance()` 자동 실행
→ GSC 미연결 사용자: 로컬 CTR 기반 임시 패턴 사용

### 현재 상태: ⚠️ 미구현 (Phase C 목표)

---

## RULE-07: 모든 시스템은 Observable 해야 한다

### 선언
어떤 Worker도 자신의 성공/실패를 기록하지 않고 종료할 수 없습니다.

### 필수 호출
모든 Worker의 try/catch 양쪽에서:
```typescript
await ObservabilityService.recordMetric(workerName, job.id, 'success'|'failed', startTime);
```

### 구현 위치
→ `server/lib/observabilityService.ts`
→ `server/workers/*.ts` (전체)

---

## 위반 감지 체크리스트 (PR 검토 시 사용)

```
[ ] status 문자열 리터럴이 Worker 코드에 직접 있는가? → 거절
[ ] Queue 없이 callAI를 직접 호출하는가? → 거절 (스트리밍 예외 제외)
[ ] querySelector가 content_script에 직접 있는가? → 거절
[ ] 발행 후 Verification 없이 PUBLISHED로 전환하는가? → 거절
[ ] Worker에 ObservabilityService.recordMetric이 없는가? → 거절
```

---

## RULE-08: 내비게이션 우선순위 규약 (Navigation Priority)

### 선언
상단바의 주요 메뉴는 반드시 유저의 수익화 워크플로우를 반영한 고정 순서를 유지해야 합니다.

### 고정 순서 (Pillar Paths)
1. `/knowledge` (지식 센터)
2. `/challenge` (애드센스 챌린지)
3. `/custom-lab` (마이커스텀)
4. `/niche-hunter` (니치 헌터)
5. `/mysite` (내 사이트)
6. `/mypage` (마이 페이지)

### 구현 위치
→ `src/components/Layout.tsx` 내 `mainPillarPaths` 정의부

---

## RULE-09: API Budget 투명성 프로토콜 (Observability)

### 선언
시스템 관제 대시보드는 반드시 실시간 API 사용량을 시각화하여 제공해야 합니다. 
특히, 효율성을 위해 HTTP 폴링이 아닌 **WebSocket Server-Push** 모델을 사용해야 합니다.

### 필수 지표
- 일일 생성 횟수 (Today's Generation Count)
- 시스템 한도 대비 사용률 (%)
- 과금 폭탄 방어(Anti-Billing-Bomb) 상태 표기

### 구현 위치
- `server/routes/health.ts` (지표 수집)
- `server/lib/websocketServer.ts` (10초 주기 브로드캐스트)
- `src/pages/Orchestrator.tsx` (WS 수신 및 렌더링)

---

## RULE-10: Global Command Center 영속성 규약 (UI Persistence)

### 선언
오토파일럿의 상태를 제어하고 관제하는 `AutopilotStage`는 반드시 전역 레이아웃에서 영속적으로 렌더링되어야 합니다.

### 구현 기준
- 위치: `Layout.tsx` 하단 (Floating)
- 상태: 미니 모드(Collapsed)와 확장 모드(Expanded)를 모두 지원
- 조건: 로그인한 모든 유저에게 노출 (Z-index 100 이상)

### 구현 위치
- `src/components/AutopilotStage.tsx`
- `src/components/Layout.tsx`

---

## 위반 감지 체크리스트 (PR 검토 시 사용)

```
[ ] status 문자열 리터럴이 Worker 코드에 직접 있는가? → 거절
[ ] Queue 없이 callAI를 직접 호출하는가? → 거절 (스트리밍 예외 제외)
[ ] querySelector가 content_script에 직접 있는가? → 거절
[ ] 발행 후 Verification 없이 PUBLISHED로 전환하는가? → 거절
[ ] Worker에 ObservabilityService.recordMetric이 없는가? → 거절
[ ] 상단바 메뉴 순서가 RULE-08을 위반하는가? → 거절
[ ] 오케스트레이터에 API 사용량 지표가 누락되었거나 폴링 방식을 쓰는가? → 거절
[ ] AutopilotStage가 특정 페이지에만 존재하거나 전역 레이아웃에서 누락되었는가? → 거절
```
