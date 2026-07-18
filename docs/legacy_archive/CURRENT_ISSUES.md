# 🐛 현재 이슈 & 수정 내역 (2026-06-27 업데이트)

---

## 🤖 룰북 (Agents.md 정책)

> **⚠️ 매우 중요: Maza Studio 개발 에이전트(AI) 전용 필수 준수 규칙**
>
> 1. **기존 완성된 UI 컴포넌트 강제 분리 금지**: 화면 개편이나 리팩토링 시, 기존에 잘 동작하던 고급 기능(예: `ScheduleBoard`, `SeriesCommander` 등)을 화면에서 임의로 연결 해제(Unimport)하거나 누락시키지 말 것. 반드시 기존 기능이 새로운 UI 어딘가에 포함되도록 유지해야 함.
> 2. **사용자 친화적 에러 메시지(UX)**: `failed_verification`, `quarantine` 같은 시스템 내부 상태 코드나 영단어를 화면에 날것으로 노출하지 말 것. 항상 사용자가 즉시 이해할 수 있는 친절한 한국어 텍스트와 툴팁(아이콘 등)을 활용하여 "왜 실패했는지, 어떻게 조치해야 하는지"를 표기할 것.
> 3. **어뷰징 제재(Quarantine) 로직 최적화**: 티스토리 등 외부 API 연동 시 단시간 실패에 대해 무조건적인 격리(Quarantine)를 피하고, 쿨타임(기본 3분 등)을 부여하여 스팸 공격으로 오인받지 않으면서도 유저가 수동 조치할 여유를 보장할 것.
> 4. **어드민(관리자) 제약 해제**: 어드민 계정의 경우 플랜의 큐 슬롯 제한 등에 걸리지 않도록 항상 글로벌/무제한 한도를 보장할 것. (무료 플랜 기본 할당 금지)
> 5. **무중단 릴레이 파이프라인 (불도저 큐 정책)**: 대량의 글을 순차 생성할 때 특정 건에서 에러가 발생하더라도 **절대 전체 큐를 멈추지 말 것**. 실패한 건은 상태만 `FAILED`로 마킹한 뒤 즉시 다음 순번의 글 생성을 진행하며, 백그라운드 서비스가 나중에 실패 건을 주워 담아 자동 재도전하도록 설계할 것.
> 6. **동적 API 쿨타임 적용**: 연속 생성 시 발생하는 API 과부하(Rate Limit) 방지를 위한 쿨타임(기본 1분 30초 등)은 소스코드에 하드코딩하지 말고 `.env` 환경변수로 빼내어 유연하게 조절 가능하도록 유지할 것.
> 7. **자동 이미지 지연 로딩(Lazy Loading) 의무화**: 고화질 원본 이미지 여러 장이 한꺼번에 렌더링을 막는 문제를 해결하기 위해, 모든 생성 템플릿(templates.ts)의 `<img>` 태그에는 반드시 `loading="lazy"` 속성을 부여해야 함.
> 8. **예약 스케줄 분산 배치 (일일 최대 제한)**: 다중 예약 글 생성 시 한 날짜에 집중적으로 몰리는 현상을 방지하기 위해, 사용자별/사이트별로 하루 적정 발행량(예: 5개)을 넘길 경우 다음 날로 일정을 자동 분산 재배치(Shift)하는 메커니즘을 준수할 것.

---

## ✅ 수정 완료된 이슈

### 1. `maza-blog` — `mazastory.com` 백지 현상 (Netlify)

**증상:** 커스텀 도메인(`mazastory.com`)과 Netlify 원본 도메인(`mazastory-6fm3.netlify.app`) 모두 완전히 빈 화면 (HTTP 200이지만 `content-length: 0`)

**원인 (2가지):**

1. `src/pages/index.astro` Featured Post 영역의 HTML 구조 오류  
   - `<div class="relative aspect-[16/9] ...">` 태그가 닫히지 않음  
   - 이로 인해 SSR 렌더링이 중단되어 빈 응답 반환

2. `src/lib/api.ts` / `src/lib/supabase.ts` 에러 처리 부재  
   - Netlify 환경변수(`PUBLIC_SUPABASE_URL` 등)가 없을 경우 `createClient(undefined, undefined)` → 서버 크래시  
   - `getApprovedPosts()` RPC 실패 시 `try-catch` 없어 전체 페이지 렌더링 실패

**수정 내용:**

| 파일 | 수정 내용 |
|------|-----------|
| `src/pages/index.astro` | 누락된 `</div>` 태그 복구 |
| `src/lib/supabase.ts` | 환경변수 없을 때 fallback placeholder 추가 |
| `src/lib/api.ts` | `getApprovedPosts()` 전체를 `try-catch`로 감싸 서버 크래시 방지 |
| `src/lib/api.ts` | `.sort()` 콜백 `a`, `b` 파라미터에 `: Post` 타입 명시 (TS 에러 수정) |

**배포:** `git push` → Netlify 자동 재배포 완료 ✅

---

### 2. `maza-studio` — TypeScript 컴파일 에러

#### 2-1. `src/features/writer/pages/NicheWriterPage.tsx`
- **에러:** `'React' refers to a UMD global, but the current file is a module`
- **원인:** `React.useState`를 사용하면서 `import React` 없음
- **수정:** 파일 최상단에 `import React from "react"` 추가

#### 2-2. `src/features/challenge/components/steps/StepTistoryRequired.tsx`
- **에러:** `'React' is declared but its value is never read`
- **원인:** JSX 자동 변환 환경에서 default React import 불필요
- **수정:** `import React, { ... }` → `import { ... }` (default 제거)

#### 2-3. `src/features/challenge/config/pipelineConfig.ts`
- **에러:** `'React' is declared but its value is never read`
- **원인:** `.ts` 파일(JSX 없음)에 React import 존재
- **수정:** `import React from 'react'` 라인 전체 제거

#### 2-4. `src/features/scheduler/components/SitePublishSettingsModal.tsx`
- **에러:** `'React' is declared but its value is never read`
- **원인:** 2-2와 동일
- **수정:** `import React, { useState, useEffect }` → `import { useState, useEffect }`

#### 2-5. `src/features/scheduler/handlers.ts` (L159)
- **에러:** `'post' is declared but its value is never read`
- **원인:** `handleReschedulePost`에서 `post`를 선언했으나 사용하지 않음
- **수정:** 변수명을 `_post`로 변경 (TypeScript 관례 - 사용하지 않음 명시)

---

### 3. `maza-studio` — 발행 설정 UX 개선

#### 3-1. 니치 포스팅 페이지 (NicheWriterPage)
- **변경 전:** 글 생성 시 '예약 발행 간격'을 숫자로 직접 입력해야 했음 (1~72시간)
- **변경 후:** 입력창 제거 → **"⚙️ 사이트 발행 설정"** 버튼으로 교체
  - 버튼 클릭 시 `SitePublishSettingsModal` 팝업 표시
  - 설정된 간격을 자동으로 백엔드에서 읽어와 예약 분배

#### 3-2. 백엔드 스케줄링 로직 (`scheduledGenerateService.ts`)
- **변경 전:** 프론트에서 `publishDelayHours`를 넘기지 않으면 무조건 **3시간 기본값** 적용
- **변경 후:** 우선순위 순서로 간격 결정:
  1. 프론트에서 명시적으로 넘긴 값 (있을 경우)
  2. **사이트 `metadata.publish_settings.custom_interval_minutes` 값** (설정 모달에서 저장된 값)
  3. `getW05IntervalMs()`로 플랜 기본값 반환

- `sites` 쿼리에 `adsense_status`, `metadata` 필드 추가하여 사이트별 커스텀 설정 읽기 가능

---

## ⚠️ 잠재적 이슈 (미수정)

### IDE 캐시 — PipelineWizard.tsx `Cannot find module` 에러

- **에러:** `Cannot find module '../components/steps/StepPlatformDomain'` 등 8개
- **실제 상황:** 파일 모두 정상 존재, `tsc --noEmit` 실행 시 해당 에러 **없음**
- **원인:** VSCode TypeScript Language Server 캐시 문제
- **해결:** `Cmd+Shift+P` → `TypeScript: Restart TS Server` 실행

---

## ✅ 2026-06-27 추가 수정 (Zero-IT / Tistory / Extension)

| 파일 | 수정 내용 |
|------|----------|
| `server/routes/zeroit.ts` | build-status Dead Route 수정 (export default 위치 이동) |
| `server/routes/zeroit.ts` | VITE_SITE_ID 환경변수 누락 추가 |
| `server/routes/zeroit.ts` | Netlify env API → `/accounts/{id}/env` POST 방식으로 교체 |
| `server/routes/zeroit.ts` | setup-infrastructure 응답에 site_name 추가 |
| `server/lib/netlify.ts` | setNetlifyEnvVars deprecated 처리 |
| `src/features/challenge/hooks/useMagicInjector.ts` | hasExtension deps [] 안정화 |
| `server/routes/verify.ts` | Tistory 서브도메인 파싱 Dead Code 제거 |
| `src/features/setup/components/SetupModals.tsx` | manual 상태 3단계 수동 가이드 + 스킨 편집기 링크 |
| `src/features/site/components/IntegrationHub.tsx` | adsenseStatus TS6133 수정 |
| `src/features/site/components/PostEditorModal.tsx` | res 미사용 변수 TS6133 수정 |
| `extension/background/background.ts` | forwardObservabilityLog + postObservabilityLog → sendObservabilityLog 통합 |
| `src/features/site/components/SiteCard.tsx` | 빌드 완료 시 토스트 알림 + "블로그 열기" 버튼 추가 |

---

## 📋 TypeScript 에러 현황 (tsc --noEmit 기준, 2026-06-27)

**서버:** 에러 0개 ✅  
**프론트엔드:** 에러 0개 ✅

---

## 🚀 발행 설정 아키텍처 (현재 기준)

```
사용자가 "⚙️ 사이트 발행 설정" 클릭
    ↓
SitePublishSettingsModal 팝업
    ↓
PATCH /api/sites/:siteId/publish-settings
    ↓ 저장
sites.metadata.publish_settings = {
  custom_interval_minutes: 180,  // 사용자가 설정한 분 단위 간격
  custom_daily_limit: 5          // 하루 최대 발행 수
}

글 생성 요청 시 (POST /api/generate)
    ↓
scheduledGenerateService.ts
    ↓
sites.metadata 읽어서 custom_interval_minutes 확인
    ↓
publishAtMs = lastPublishAtMs + intervalMs  // 플랫폼별 독립 계산
```

**플랫폼별 독립성:**  
티스토리 A의 예약이 워드프레스 B의 `publish_at`에 영향을 주지 않도록  
같은 `platform` 값을 가진 사이트끼리만 묶어서 `lastPublishAt` 계산

---

*최종 업데이트: 2026-06-18 04:08 KST*
