# 🧟 무한 잠듬(Zombie Lock) 방지 가이드라인

본 문서는 Maza Studio 스케줄러 시스템에서 발생했던 치명적인 "무한 잠듬(Zombie Lock)" 버그의 원인과 해결책, 그리고 향후 재발 방지를 위한 강력한 코딩 규칙을 기록한 문서입니다.

## ⚠️ 문제 개요 (The Problem)

Maza Studio의 스케줄러(`pollCycle.ts`)는 다중 워커 환경에서 중복 처리를 막기 위해, 데이터베이스의 행(row) 기반 낙관적 동시성 제어(Optimistic Concurrency Control)를 사용합니다.

```typescript
// 잠금 획득 (Lock Acquisition)
.update({ worker_locked: true, worker_locked_at: new Date().toISOString() })
```

작업이 성공하든, 실패(Failed)하든, 대기(Pending) 상태로 전이하든, 상태(Status)가 변할 때는 **반드시 해당 잠금을 수동으로 해제(Release)** 해야 합니다.
만약 해제 로직이 누락된 상태에서 `status`만 변경된다면, 해당 글은 `worker_locked: true`인 상태로 데이터베이스에 방치됩니다. 
이를 큐 폴러(Queue Poller)가 영원히 건너뛰게 되면서 글 생성이 무한정 멈추는 **무한 잠듬(Zombie Lock)** 현상이 발생합니다.

## 🚫 치명적 안티 패턴 (What NOT to do)

과거에는 API 라우터나 워커 내부에서 다음과 같이 `status`만 달랑 업데이트하는 코드가 산재해 있었습니다.

```typescript
// ❌ 절대 금지: 상태만 바꾸고 잠금은 방치함 (Zombie Lock 유발)
await supabaseAdmin
  .from('scheduled_posts')
  .update({ status: PostStatus.FAILED, last_error: 'Error' })
  .eq('id', taskId);
```

## ✅ 올바른 패턴 (What to do)

모든 데이터베이스 상태 전이 쿼리는 **무조건** 다음 세 개의 필드를 포함하여 잠금을 초기화해야 합니다.

```typescript
// ✅ 정답: 상태 전환 시 잠금도 완벽히 해제함
await supabaseAdmin
  .from('scheduled_posts')
  .update({ 
    status: PostStatus.FAILED,
    last_error: 'Error',
    worker_locked: false,      // [CRITICAL] 락 해제
    worker_locked_at: null,    // [CRITICAL] 시간 초기화
    started_at: null           // [CRITICAL] 시작 시간 초기화 (scheduled_posts 전용)
  })
  .eq('id', taskId);
```

## 🛡️ 시스템 단위 방어벽 (System-level Defenses)

1. **상태 전이 유틸리티 사용 권장**
   직접 `.update()` 쿼리를 작성하는 것보다, `server/db/postService.ts`에 정의된 `updateScheduledPostStatusById` 함수를 사용하는 것이 가장 안전합니다. 해당 유틸리티 내부에는 락 해제 로직이 이미 캡슐화되어 있습니다.

2. **`ts-morph` 기반 정적 검증 (2026.07.08 패치)**
   시스템 내의 27개 파일에 존재하던 취약 코드는 AST(추상 구문 트리) 스캐너를 통해 일괄 수정 및 검증되었습니다. 새로운 코드를 작성할 때는 항상 이 문서의 규칙을 준수해야 합니다.

3. **`AGENTS.md` (AI 코어 룰) 각인**
   본 규칙은 AI 에이전트의 뇌 구조 역할을 하는 `AGENTS.md`에도 **[CRITICAL] Global Lock Release Rule** 이라는 이름으로 하드코딩되어 있습니다. AI가 코드를 작성할 때 이 규칙을 어기지 않도록 감시합니다.
