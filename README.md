# Maza Docs

Maza Studio 및 관련 생태계의 내부 정책, 제품 전략, 문제 해결 가이드(CRITICAL_FIXES) 등을 관리하는 중앙 문서 저장소입니다.

## 시스템 아키텍처 및 배포 현황
- **버전 관리 (GitHub)**: 모든 소스 코드 및 문서는 `mazastory7@gmail.com` (Organization: `mazastory`) 중앙 계정에서 관리됩니다.
  - `mazastory/maza-studio`
  - `mazastory/maza-docs`
  - `mazastory/maza-blog`
- **배포 인프라 (Netlify)**: 과거 사용되었던 Cloud Run, Vercel 등은 모두 폐기되었으며, 현재 프론트엔드/백엔드 모두 **Netlify**를 통해 통합 배포 및 관리됩니다.
- **주요 연동 방식**: 티스토리 등 외부 블로그와의 통신은 서버사이드 API 직접 통신 대신, 유저의 브라우저 컨텍스트를 활용하는 **Maza Extension(Chrome 확장프로그램)**을 통해 이루어집니다.

## 문서 디렉토리 구조
- `PRODUCT_STRATEGY.md`: 제품의 핵심 포지셔닝, 가격 정책, 타겟 고객 등 비즈니스 전략
- `CRITICAL_FIXES.md`: 과거 발생했던 주요 장애 원인 및 영구적인 해결책 기록 (절대 같은 버그 반복 금지)
- `AGENTS.md`: AI 에이전트 아키텍처 및 프롬프트 관리
- `docs/EXTENSION_GUIDE.md`: Maza Extension의 구조 및 Playwright 테스트 환경 가이드
- `docs/MAZA_BRIDGE_GUIDE.md`: 익스텐션과 외부 플랫폼 간의 브릿지 및 발행 프로세스 가이드

> **주의**: 본 저장소의 코드를 수정하거나 새로운 배포 인프라를 고려할 때는 항상 기존 `CRITICAL_FIXES.md`의 규칙들을 어기지 않도록 확인하세요.
