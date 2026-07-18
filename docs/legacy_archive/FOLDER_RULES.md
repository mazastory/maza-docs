# FOLDER_RULES.md

> **최종 업데이트**: 2026-06-13 — Feature-Sliced Design (FSD) 전환 완료

## 허용 폴더 구조 (FSD Architecture)

```
src/
├── features/                  ← 비즈니스 로직 (도메인별 격리)
│   ├── autopilot/             ← 관제탑, 대시보드, 자동화 파이프라인
│   ├── auth/                  ← 인증, AuthProvider, AuthGuard, 로그인
│   ├── admin/                 ← 관리자 기능 (AdminPromoWriter 등)
│   ├── challenge/             ← 챌린지 생성/스코어링
│   ├── scheduler/             ← 예약 발행 (SeriesCommander)
│   ├── setup/                 ← 초기 설정, 온보딩 흐름
│   ├── site/                  ← 사이트 관리 (MySite, 블로그 연결)
│   ├── tools/                 ← LegalGenerator, SEOAssetTool
│   └── writer/                ← AI 글쓰기 엔진 전체
│
├── components/                ← 공통 UI 껍데기만 (비즈니스 로직 절대 금지)
│   ├── layout/                ← Layout.tsx, MobileLayout.tsx, Footer.tsx
│   └── ui/                    ← ErrorBoundary, UpgradePaywall, WelcomeBackBanner 등
│
├── pages/                     ← 비기능성 독립 페이지 (Landing, FAQ, Pricing 등)
├── hooks/                     ← 공유 커스텀 훅
├── lib/                       ← 유틸리티, API 클라이언트, supabase 등
├── types/                     ← TypeScript 타입 / 인터페이스
└── constants/                 ← 상수, 네비게이션 정의 등
```

---

## Feature 폴더 내부 구조 규칙

각 `features/<name>/` 폴더는 반드시 다음 구조를 따른다:

```
features/<name>/
├── components/    ← 해당 기능의 UI 컴포넌트
├── pages/         ← 해당 기능의 페이지 컴포넌트 (라우트 진입점)
├── hooks/         ← 해당 기능 전용 커스텀 훅 (필요 시)
└── index.ts       ← ✅ 반드시 존재해야 함 (Public API 방화벽)
```

### `index.ts` 방화벽 원칙

- **외부에서는 반드시 `index.ts`를 통해서만** Feature에 접근한다.
- Feature 내부 파일을 외부에서 직접 import 하는 것은 **금지**한다.

```typescript
// ✅ 올바른 방식
import { SeriesCommander } from '../features/scheduler';

// ❌ 금지 (내부 구조 직접 접근)
import SeriesCommander from '../features/scheduler/components/SeriesCommander';
```

---

## 금지 폴더

절대 생성 금지

```
legacy/
archive/
backup/
old/
temp/
experimental/
sandbox/
test-copy/
debug-copy/
unused/
deprecated/
```

이들 폴더가 존재하면 즉시 삭제 또는 저장소 외부 이관

---

## 금지 파일명

파일명에 버전 또는 임시 표시 절대 금지

```
❌ xxx-v2.ts
❌ xxx-v3.ts
❌ xxx-copy.ts
❌ xxx-new.ts
❌ xxx-final.ts
❌ xxx-final-final.ts
❌ xxx-backup.ts
❌ xxx-old.ts
❌ xxx-test.ts (테스트 폴더 외부에서)
❌ xxx-experiment.ts
❌ xxx-temp.ts
```

---

## 신규 기능 추가 프로세스

### 단계 1: 어느 Feature 도메인인가?

새 기능이 필요할 때 먼저 기존 Feature 귀속 여부 확인

```
글쓰기/콘텐츠 관련   → features/writer/
예약/발행 관련       → features/scheduler/
대시보드/관제 관련   → features/autopilot/
인증/권한 관련       → features/auth/
초기 설정 관련       → features/setup/
사이트 관리 관련     → features/site/
챌린지 관련          → features/challenge/
관리자 전용 도구     → features/admin/
법률/SEO 도구        → features/tools/
공통 UI 껍데기       → components/layout/ or components/ui/
독립 페이지          → pages/
```

### 단계 2: 기존 Feature에 추가

- 해당 Feature의 `components/` 또는 `pages/`에 파일 추가
- `index.ts`에 Public API 추가

### 단계 3: 완전히 새로운 도메인이라면

- `src/features/<새도메인>/` 폴더 생성
- 내부에 `components/`, `pages/`, `index.ts` 생성
- `App.tsx`의 라우팅에 연결

---

## 폴더별 책임 요약

| 폴더 | 역할 | 비즈니스 로직 |
|------|------|:---:|
| `features/<name>/` | 특정 도메인의 모든 UI + 로직 | ✅ 허용 |
| `components/layout/` | 앱 공통 레이아웃 껍데기 | ❌ 금지 |
| `components/ui/` | 범용 공통 UI 조각 | ❌ 금지 |
| `pages/` | 독립적인 단순 페이지 | 최소한만 |
| `hooks/` | 여러 Feature가 공유하는 훅 | ✅ 허용 |
| `lib/` | API 클라이언트, supabase, 유틸 | ✅ 허용 |
| `types/` | TypeScript 타입 정의 | - |

---

## 체크리스트

신규 파일 생성 전 반드시 확인

```
☐ 어느 Feature 도메인에 속하는가?
☐ 기존 Feature에 추가 가능한가?
☐ Feature 외부에서 index.ts를 통해 import하고 있는가?
☐ components/ 폴더에 비즈니스 로직을 넣으려 하지는 않는가?
☐ 파일명에 -v2, -copy, -final 포함되지 않는가?
☐ 금지 폴더(legacy, archive, backup 등)를 생성하지 않는가?
```

모두 확인 후 신규 생성 진행


---

## 금지 폴더

절대 생성 금지

```
legacy/
archive/
backup/
old/
temp/
experimental/
sandbox/
test-copy/
debug-copy/
unused/
deprecated/
```

이들 폴더가 존재하면 즉시 삭제 또는 저장소 외부 이관

---

## 금지 파일명

파일명에 버전 또는 임시 표시 절대 금지

```
❌ xxx-v2.ts
❌ xxx-v3.ts
❌ xxx-copy.ts
❌ xxx-new.ts
❌ xxx-final.ts
❌ xxx-final-final.ts
❌ xxx-backup.ts
❌ xxx-old.ts
❌ xxx-test.ts (테스트 폴더 외부에서)
❌ xxx-experiment.ts
❌ xxx-temp.ts
```

### 올바른 명명 규칙

```
✅ publisherWorker.ts
✅ publisherWorkerV1.ts (유일한 예외: API 버전 관리)
✅ publisherWorkerEnhanced.ts (기능 개선 시 명확한 목적)
✅ publisherWorkerVerification.ts (기능 추가)
```

---

## 신규 기능 추가 프로세스

### 단계 1: 기존 폴더 확인

새 기능이 필요할 때 반드시 먼저 검토

```
services/ → 비즈니스 로직?
workers/ → 백그라운드 작업?
components/ → UI 컴포넌트?
lib/ → 유틸리티?
```

### 단계 2: 기존 파일 수정 검토

- 기존 파일에 기능 추가 가능?
  - YES → 수정
  - NO → 단계 3

### 단계 3: 신규 파일 생성

- 기존 폴더에 신규 파일 추가 (새 폴더 생성 금지)

예시:

```
// ✅ 올바른 방식
src/services/publisherWorker.ts (기존 파일 수정)

// ❌ 금지
src/services/publisherWorkerV2.ts
src/legacy/publisherWorker.ts
src/backup/publisherWorker.ts
```

---

## 폴더별 책임

### src/features/
- 주요 비즈니스 로직
- 도메인별 기능 구현

### src/components/
- UI 컴포넌트만
- 비즈니스 로직 금지

### src/services/
- 데이터 조작
- API 호출
- 외부 서비스 연동

### src/workers/
- 백그라운드 작업
- Queue 처리
- 스케줄 실행

### src/queues/
- Queue 정의
- BullMQ 설정

### src/lib/
- 유틸리티 함수
- 헬퍼 함수
- 공유 로직

### src/types/
- TypeScript 타입
- 인터페이스

### src/config/
- 설정 파일
- 환경 변수

---

## 체크리스트

신규 파일 생성 전 반드시 확인

```
☐ 기존 폴더(src/)에서 기능 추가 가능?
☐ 기존 파일 수정으로 해결 가능?
☐ 파일명에 -v2, -copy, -final 포함?
☐ 금지 폴더(legacy, archive, backup 등) 생성?
☐ 폴더 책임 범위 확인?
```

모두 확인 후 신규 생성 진행
