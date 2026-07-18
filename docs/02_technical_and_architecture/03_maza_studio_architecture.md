# ARCHITECTURE.md

## System Constitution

Core principle: 모든 것이 명확하고 단순해야 한다.

---

## Single Source of Truth

**각 도메인마다 정확히 하나의 테이블만 사용**

```
Posts    → posts 테이블만
Images   → images 테이블만
Users    → users 테이블만
Jobs     → jobs 테이블만
```

중복 상태 저장 절대 금지.

예시:

```
❌ posts + published_posts
❌ posts.status + post_status 테이블
❌ images + image_cache
```

---

## Canonical Pipeline

모든 콘텐츠는 이 경로만 따른다.

```
Keyword Input
    ↓
Niche Hunter (시장 조사)
    ↓
Writer (콘텐츠 작성)
    ↓
Mapper (카테고리 구조화)
    ↓
Publish Queue (큐에 등록)
    ↓
Publisher (실제 발행)
    ↓
Done (Published 상태)
```

### 허용되지 않는 구조

이들 패턴은 절대 생성 금지:

```
❌ Writer → Publish (Mapper 스킵)
❌ Writer → Scheduler → Publish (Mapper 스킵)
❌ Publisher → Writer (역흐름)
❌ Writer → Writer (체이닝)
❌ Publish → Publish (중복 발행)
```

---

## Queue Policy

허용되는 Queue는 정확히 2개:

### 1. content-generation

Writer, ImageProcessor, Mapper 등이 사용

```
- Task: 콘텐츠 생성
- Handler: generationWorker
- Retry: 3회
```

### 2. content-publish

Publisher가 사용

```
- Task: 실제 블로그 발행
- Handler: publishWorker
- Retry: 2회 (블로그 API는 더 보수적)
```

### 신규 Queue 생성 금지

```
❌ publish-v2
❌ publish-fast
❌ publish-simple
❌ experimental-queue
❌ test-publish
❌ legacy-queue
```

---

## Worker Policy

허용되는 Worker는 정확히 2개:

### 1. generationWorker

책임:
- 콘텐츠 생성 태스크 처리
- 이미지 처리
- 카테고리 매핑

```typescript
// 허용
generationWorker.process(async (job) => {
  // AI 호출
  // 이미지 생성
  // 매핑 수행
});
```

### 2. publishWorker

책임:
- 블로그 발행
- 검증
- 상태 업데이트

```typescript
// 허용
publishWorker.process(async (job) => {
  // 블로그 API 호출
  // 검증
  // 상태 업데이트
});
```

### 신규 Worker 생성 금지

```
❌ simplePublishWorker
❌ publishWorkerV2
❌ verificationWorker (publishWorker 내부로 통합)
❌ schedulerWorker (SchedulerAgent이 담당)
```

---

## Scheduling Policy

예약은 SchedulerAgent만 담당:

```
예약 생성 요청
    ↓
SchedulerAgent.schedule(postId, scheduledTime)
    ↓
DB에 scheduled_at 저장
    ↓
내부 스케줄러가 시간 도달 시 content-publish 큐에 추가
    ↓
publishWorker 처리
```

### 허용

```typescript
// ✅ SchedulerAgent을 통한 예약
await schedulerAgent.schedule(postId, new Date('2026-06-04'));
```

### 금지

```typescript
// ❌ 다른 컴포넌트에서 예약 생성
// Writer, Mapper, Publisher가 예약 생성 금지
// UI에서 직접 스케줄 저장 금지
```

---

## Database Policy

모든 데이터 변경은 **Service Layer**를 통해서만 수행

### 허용 패턴

```
Component/Worker
    ↓
API/Service
    ↓
Repository
    ↓
Database
```

### 금지 패턴

```
❌ Component → Database (직접)
❌ Worker → Database (직접)
❌ API → Database (Service 우회)
```

### 구체적 예시

#### ✅ 올바른 방식

```typescript
// publishWorker.ts
const post = await publishService.publishPost(postId);

// publishService.ts
async publishPost(postId: string) {
  const post = await postRepository.getById(postId);
  // ... 발행 로직
  await postRepository.update(postId, { status: 'published' });
}

// postRepository.ts
async update(postId: string, data: any) {
  return supabase.from('posts').update(data).eq('id', postId);
}
```

#### ❌ 금지된 방식

```typescript
// publishWorker.ts - 직접 DB 접근
await supabase.from('posts').update({ status: 'published' }).eq('id', postId);

// Component - DB 직접 접근
const post = await supabase.from('posts').select('*').single();
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────┐
│         User Input                      │
│   (Keyword, Schedule, Target Blog)      │
└──────────────┬──────────────────────────┘
               ↓
┌──────────────────────────┐
│    NicheHunter Agent     │
│   (Market Research)      │
└──────────────┬───────────┘
               ↓
┌──────────────────────────┐
│    Writer Agent          │
│   (Content Generation)   │
└──────────────┬───────────┘
               ↓
┌──────────────────────────┐
│    Mapper Agent          │
│   (Structure Content)    │
└──────────────┬───────────┘
               ↓
         ┌─────────────────────────┐
         │   API: /api/publish     │
         │  (Schedule or Immediate)│
         └──────────┬──────────────┘
                    ↓
         ┌──────────────────────────┐
         │  content-generate Queue  │
         │  (if not ready)          │
         └──────────┬───────────────┘
                    ↓
         ┌──────────────────────────┐
         │  generationWorker        │
         │  (Final Prep)            │
         └──────────┬───────────────┘
                    ↓
    ┌───────────────────────────────────┐
    │  Post Status: READY_TO_PUBLISH    │
    │  (Service Layer Save)             │
    └───────────────┬───────────────────┘
                    ↓
    ┌───────────────────────────────────┐
    │  SchedulerAgent or Immediate      │
    │  content-publish Queue            │
    └───────────────┬───────────────────┘
                    ↓
    ┌───────────────────────────────────┐
    │  publishWorker                    │
    │  1. Call Blog API                 │
    │  2. Verify Publication            │
    │  3. Update Status                 │
    └───────────────┬───────────────────┘
                    ↓
    ┌───────────────────────────────────┐
    │  Post Status: PUBLISHED           │
    │  (Service Layer Save)             │
    └───────────────────────────────────┘
```

---

## State Transitions

유효한 상태 전환만 허용 (RULE-02 참조)

```
QUEUED
  ↓
GENERATING
  ↓
IMAGE_PROCESSING
  ↓
VALIDATING
  ↓
READY_TO_PUBLISH
  ↓
PUBLISHING
  ↓
VERIFYING
  ↓
PUBLISHED ✓

(실패 시)
  ↓
FAILED
  ↓
DEAD
```

### 금지된 상태 전환

```
❌ QUEUED → PUBLISHED (단계 스킵)
❌ PUBLISHING → GENERATING (역방향)
❌ PUBLISHED → QUEUED (재발행은 새 post 생성)
```

---

## Checklist for Architects

새로운 기능 추가 시 반드시 확인:

```
☐ 기존 Pipeline 단계 중 하나?
☐ 기존 Queue 사용?
☐ 기존 Worker 확장?
☐ Service Layer 거침?
☐ 새로운 상태 추가 필요?
  (필요하면 PostStatus enum 수정)
☐ 중복 저장소 생성?
```

모두 충족 후 구현 진행.
