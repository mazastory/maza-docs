# 🚨 긴급 장애 해결 및 UX 개선 보고서 (Post-Mortem)
**일시:** 2026년 8월 3일
**작성자:** Maza Autopilot OS 에이전트

---

## 1. API 키 좀비락 (403/400 오판) 및 큐 동맥경화(Queue Starvation) 해결

### 🔴 문제 상황 (The Problem)
백그라운드에서 글을 자동 생성하는 `autoScheduler` 워커가 특정 에러(API Key 403 권한 에러, Gemini 400 이미지 정책 위반 등)에 직면했을 때, 해당 작업을 **실패(failed)** 처리하지 않고 **보류(on_hold)** 상태로 넘겨버리는 치명적인 버그가 존재했습니다.
이로 인해 워커가 작업을 쥐고 있는 상태(`worker_locked: true`)가 영구적으로 해제되지 않아(Zombie Lock), 전체 생성 큐가 멈춰버리는 **'동맥경화' 현상**이 발생했습니다. 아무리 재시작을 해도 락이 풀리지 않아 신규 글 생성이 완전히 중단되었습니다.

### 🟢 해결 방안 (The Solution)
- **명시적 Lock 해제:** `autoScheduler.ts`의 에러 핸들링 로직을 전면 수정하여, 어떤 예외가 발생하든 무조건 `worker_locked: false`, `started_at: null`로 락을 반환하도록 강제했습니다.
- **상태 전이 교정:** 403, 400 등의 API 에러를 더 이상 `on_hold`로 회피하지 않고 명확하게 `failed` 처리하여, 재시도(Retry) 사이클이 정상적으로 작동하게 만들었습니다.
- **안티 패턴 선언:** 이 문제를 향후 다른 에이전트가 반복하지 못하도록 `Zombie Queue Starvation Anti-Pattern` 지식(Knowledge Item)으로 등록했습니다.

---

## 2. Gemini 400 에러 (사람 포함 이미지 정책 위반) 우회 및 폴백(Fallback)

### 🔴 문제 상황 (The Problem)
Gemini 2.5 Flash 모델이 유저의 원본 이미지 중 '사람/얼굴'이 포함된 이미지를 분석할 때, Google의 엄격한 안전 정책에 의해 `400 Bad Request` 에러를 반환하며 글 생성을 튕겨내는 빈도가 잦았습니다.

### 🟢 해결 방안 (The Solution)
- **텍스트 전용 폴백(Text-Only Fallback) 엔진 도입:** `generateService.ts`에서 멀티모달(Vision) 요청이 400 에러로 실패할 경우, 에러를 내뱉고 죽는 대신 즉시 **"이미지를 제외한 텍스트 전용(Text-only)"** 모드로 프롬프트를 재구성하여 2차 재시도를 수행하도록 폭포수(Waterfall) 로직을 적용했습니다.
- 이제 이미지가 막히더라도 콘텐츠 생성이 중단되지 않고 유연하게 넘어갑니다.

---

## 3. Autopilot(자동 가동) 엔진 신규 유저 기본값(Default) 켜기 (UX 대혁신)

### 🔴 문제 상황 (The Problem)
신규 유저가 '마자 스튜디오'에서 도메인을 추가하고 세팅을 끝마쳤음에도 불구하고, 엔진 대기 상태(`campaign.active: false`)로 머물러 있어 글쓰기가 전혀 진행되지 않았습니다. 어디서 뭘 눌러야 할지 모르는 신규 유저는 **"왜 글이 안 써지지?"**라며 헤맬 수밖에 없는 치명적인 UX 허들이 존재했습니다.

### 🟢 해결 방안 (The Solution)
- **Autopilot OS 철학 구현:** `server/routes/sites.ts` 백엔드 로직을 수정하여, 신규 사이트가 추가(POST /api/sites 또는 PUT /upsert)될 때 무조건 **`campaign: { active: true, started_at: ... }`** 속성을 기본값으로 주입하도록 변경했습니다.
- 이제 유저가 셋업 마법사를 마치는 즉시 시스템이 20개의 백데이터 포스팅을 알아서 쏟아내기 시작합니다. 진정한 의미의 "오토파일럿(자율 주행)"이 완성되었습니다.
- 기존에 추가하셨던 대표님의 3개 사이트(`insightpilotpro.com` 등)도 강제로 엔진 스위치를 ON 시키는 스크립트를 즉각 실행하여 조치를 완료했습니다.
