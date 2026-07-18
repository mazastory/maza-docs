# PRD - MAZA Studio

Version: 3.0 (Unified)

---

# Executive Summary
MAZA Studio is a Monetized Media Operating System.
The platform enables individuals and small teams to build, operate, and scale revenue-generating content properties through AI-assisted automation. 
The objective is revenue generation, not just content creation.

---

# Core Workflows (Autopilot Mode)

## 1. Niche & Keyword Discovery (NicheHunter)
- 사용자는 주제만 던져주고, 시스템이 트래픽을 유발할 수 있는 키워드 클러스터를 찾는다.

## 2. Content Generation (WriterAgent + ImageAgent)
- AI가 SEO 최적화된 블로그 포스팅을 자동 작성.
- 직장인을 위한 스피드 모드(예약 후 PC 종료)와 파워 유저를 위한 안전 모드(지연 발행) 등 사용자 설정 기반의 유연한 자동화 발행을 백그라운드 큐(`content-generation`)에서 진행.

## 3. Review & Autopilot Dashboard (SeriesCommander)
- **오토파일럿 타임라인 (SeriesCommander)**: 유저가 상태를 관제하는 메인 대시보드.
- 모든 예약(queued, ready_to_publish, scheduled) 상태를 통합 뷰로 보여준다.
- 컴포넌트는 단일 API(`server/routes/dashboard.ts`)를 호출해 데이터를 가져오며, DB에 직접 접근하지 않는다.

## 4. Automated Publishing (PublisherAgent + Extension)
- 티스토리 오픈 API의 한계와 계정 블락 리스크를 우회하기 위해 **크롬 익스텐션(CRXLauncher)** 기반 브라우저 자동화 발행 방식을 지원한다.
- `publishWorker` 큐가 익스텐션과 연동되어 100% 휴먼라이크(Human-like)하게 포스팅을 등록한다.

---

# Product Principles
- **No Direct DB Access in UI**: 프론트엔드는 항상 백엔드 API를 거쳐야 한다.
- **Constitutional Compliance**: 모든 제품 결정과 구현은 `MASTER_CONSTITUTION.md`, `TRD.md`, `AGENTS.md`의 핵심 규약과 어긋나지 않아야 한다.
- **Natural Schedule**: 애드센스 심사를 통과하기 위해 기계적인 대량 발행이 아닌, 3~4시간 간격의 유기적 패턴(Organic Pattern)을 준수한다. (단, 사용자가 스피드 모드를 선택한 경우 AI 생성과 익스텐션 제어는 즉시/10분 간격으로 수행하되, 실제 발행 예약 시간(`target_publish_at`)을 동적으로 2~3시간 간격으로 할당하여 플랫폼 안전성을 지능적으로 보장한다.)
- **Pure Image**: 텍스트 워터마크가 들어간 스톡 이미지는 애드센스 품질(Spam)에 치명적이므로 사용을 금한다.
