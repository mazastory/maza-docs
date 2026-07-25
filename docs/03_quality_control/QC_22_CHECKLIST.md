# 애드센스 승인 및 SEO 무결성 체크리스트 22선 (Maza QC 22)

> Maza Studio의 완전 자동화 생성 파이프라인에서 블로그 품질을 구글 애드센스 승인 100% 기준으로 보장하기 위한 22가지 핵심 검수 규칙입니다. 모든 AI 에이전트는 이 22선을 반드시 숙지하고 준수합니다.

## 핵심 콘텐츠 및 구조 무결성 (Content & Structure Integrity)

1. **[CRITICAL] 1 도메인 1 카테고리 원칙 (Topical Authority)**: 모든 루트/서브 도메인은 잡블로그를 배제하고 단일 카테고리를 유지하여 전문성을 입증해야 함.
2. **[CRITICAL] Content Quality & Volume (Thin Content Check)**: 최종 렌더링된 글의 순수 텍스트(공백 제외)가 1,300자 이상을 충족해야 함.
3. **[CRITICAL] Image Inclusion**: 최종 렌더링 HTML에 실제 `<img...>` 태그가 1개 이상 (Auto-Fix 시 최소 3장) 포함되어야 함.
4. **[CRITICAL] V2 Validation Score**: 자체 품질 검증 엔진에서 종합 V2 스코어 >= 70을 유지해야 함.
5. **[CRITICAL] SEO Score**: 메타 태그, 헤딩 구조 등을 평가하는 SEO 스코어 >= 70을 유지해야 함.
6. **[CRITICAL] Credibility & Citations (출처 표기)**: 신뢰할 수 있는 외부 아웃바운드 링크 또는 명확한 위키백과/신뢰 출처 표기가 포함되어야 함.
7. **[CRITICAL] Site Navigation (빈 카테고리 누락 방지)**: `metadata.category` 할당 및 사이트 메뉴(GNB) 구조가 텅 비지 않도록 정상화.
8. **[CRITICAL] Trust & YMYL Pages**: 신뢰도를 위한 Privacy Policy(개인정보처리방침), Terms, About/Contact 페이지가 필수로 존재해야 함.

## 기술적 SEO 및 봇 최적화 (Technical SEO & Crawlability)

9. **[CRITICAL] Technical SEO & Mobile**: 로딩 속도 및 모바일 Core Web Vitals 최적화(LCP, CLS 등).
10. **[CRITICAL] HTTP 리다이렉트 301 사용**: 중복 색인 방지를 위해 302(임시)를 금지하고, 301(영구 이동)을 사용.
11. **[CRITICAL] 404 페이지 HTTP 상태코드 404 명시**: Astro SSR에서 빈 페이지 접근 시 Soft 404가 아닌 명확한 404 상태 코드 반환.
12. **[CRITICAL] 404 리다이렉트 URL 쿼리 파라미터 제거**: 무한 색인 크롤링 루프를 유발하는 쿼리 파라미터 달고 리다이렉트 되는 현상 차단.
13. **[CRITICAL] Sitemap lastmod 동적 now() 금지**: 크롤 버짓 낭비 방지를 위해 사이트맵 렌더링 시간(now)이 아닌 DB의 `publish_at`을 활용.
14. **[CRITICAL] Sitemap 카테고리/태그 누락 방지**: `sitemap.xml` 생성 시 개별 포스트뿐 아니라 카테고리/태그 아카이브 페이지도 포함.
15. **[CRITICAL] robots.txt 차단 경로 지정**: `/admin/`, `/api/` 등 불필요한 시스템 경로에 대한 구글 봇 크롤링 원천 차단.

## 정책 위반 및 AI 스팸 필터 회피 (Anti-Spam & Persona)

16. **[CRITICAL] Policy Violations**: 금지어, 성인물, 키워드 스터핑 원천 방지 및 우회 키워드 치환(Safety Swapped).
17. **[CRITICAL] Deceptive Persona (기만성 콘텐츠 방지)**: AI 프롬프트에 가짜 자격증(의사, 변호사 등) 기재 영구 금지. "공식 데이터에 따르면" 등 철저한 객관적 서술 강제.
18. **[CRITICAL] Negative Prompting Hallucination 방지**: 프롬프트 작성 시 "XX 금지어 쓰지 마" 식의 Negative Prompting 대신, "A를 위주로 작성해"라는 Positive 프롬프트 활용.
19. **[CRITICAL] Phrase-Based Filtering (사칭성 오작동 방지)**: '의사' 같은 단일 단어 차단이 아닌 '본인은 의사' 같은 문맥(구문) 기반 필터링 사용.
20. **[CRITICAL] Site Theming & Persona Diversity**: DB에 `metadata.tone/color` 등을 고유하게 유지하여 찍어낸 듯한 기계적(Cookie-cutter) 패턴 방지.
21. **[CRITICAL] Expired Domain Abuse Prevention (토픽 이식 금지)**: 기존 신뢰도 도용을 목적으로 방치된 낙장 도메인을 매입해 완전히 무관한 주제로 콘텐츠를 리라이팅 하는 행위 전면 금지.
22. **[CRITICAL] Human-like Jitter & Backdating (자연스러운 스케줄링)**: 대량 포스팅 시 단일 날짜에 글이 몰리지(Clumping) 않도록 과거 30~45일에 걸쳐 하루 2~3개씩, 시간(분/초)까지 랜덤하게 분산(Jitter) 배치하여 봇 탐지 회피.
