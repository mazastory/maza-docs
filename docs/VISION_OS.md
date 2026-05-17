# MAZA 100점 아키텍처 설계안 (VISION OS)

## 1. 목표
- MAZA는 단순 크롬 익스텐션이 아니라 **"AI 기반 블로그 운영 워크스페이스(Blog Operation OS)"**를 지향한다.

## 2. 핵심 원칙
1. **Extension 최소화**: Dumb Bridge로 기능 축소.
2. **Server 중심 구조**: AI 로직, 상태 관리, 오케스트레이션을 서버가 담당.
3. **Task 기반 자동화**: Polling 방식을 통한 안정적인 작업 수행.
4. **플랫폼 완전 분리**: Adapter Pattern 도입.
5. **안정성 최우선**: MV3 친화적 Stateless 구조.

## 3. 구조적 혁신
### 🏢 Dashboard (Workspace)
- **UI Concept**: Arc Browser + Linear + Notion.
- **핵심 페이지**: Projects, Blogs, Schedules, SEO, Logs, AI Assistant.

### 💉 Extension (Dumb Bridge)
- **역할**: DOM 제어, 로그인 유지, 입력, 업로드, 발행, 결과 반환.
- **제거 항목**: WebSocket Persistence, Queue Manager, Workflow Engine, Reconnect Hell.

### 🧠 Server (Command Center)
- **역할**: AI 생성, Task 생성/관리, 예약 발행, SEO 자동화, 상태/로그 관리.
- **기술 스택**: Fastify, PostgreSQL, Prisma, Redis(BullMQ).

### 🔌 Platform Adapters
- **구조**: Tistory, Wordpress, Blogspot 어댑터 독립화.
- **Selector Registry**: 중앙 집중식 셀렉터 관리.

## 4. 핵심 UX/UI
- **디자인**: Dark UI 기반, Minimal, 실용적 밀도.
- **페르소나**: "Agent" 느낌 강조 (MAZA is generating..., MAZA is optimizing SEO...).

---
> **"MAZA는 AI 블로그 생성기가 아니라, AI 블로그 운영 OS다."**
