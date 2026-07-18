# Maza Autopilot OS - Infrastructure Stabilization Walkthrough

이 문서는 티스토리 인프라 주입 및 자동화 파이프라인의 안정성 확보를 위한 업데이트 내용을 요약합니다.

## 1. 주요 변경 사항

### [Extension] 인프라 주입 로직 및 UX 고도화
- **중복 주입 방지 (FIX-27)**: `background.ts` 내 `processVal` 함수에 정규식(Regex)을 도입하여 구형 마커와 신형 마커를 모두 탐지하고 제거한 후 새 코드를 주입합니다.
- **탭 포커스 자동 복귀 (FIX-29)**: `focusWebAppTab` 기능을 추가하여, 티스토리 탭에서 주입 작업이 끝나면 유저가 기다릴 필요 없이 자동으로 MazaStudio 탭으로 화면을 전환해 줍니다.
- **MAIN World 브릿지**: CSP 제약을 우회하기 위해 `chrome.scripting.executeScript`를 통해 에디터(CodeMirror/Monaco)에 직접 접근합니다.

### [WebApp] Setup 페이지 인터랙션 개선
- **성공 모달 유지 (FIX-28)**: 주입 성공 후 2.5초 뒤 자동으로 사라지던 로직을 제거하고, 유저가 "확인 (창 닫기)" 버튼을 눌러야 닫히도록 변경하여 작업 완료 여부를 명확히 인지하게 했습니다.
- **상태 동기화**: `MAZA_INFRA_PROGRESS` 신호를 통해 `SUCCESS`뿐만 아니라 `ALREADY_INJECTED` 상태도 정확히 수신하여 UI에 반영합니다.

### [Connection] 프로덕션(mazastudio.kr) 연결 이슈 해결
- **신호 체계 정렬**: 웹앱(`AutopilotStage`)과 익스텐션(`sync_token`) 간의 메시지 규격을 `MAZA_PONG_EXTENSION`으로 통일하여 프로덕션 도메인에서도 'CONNECTED' 상태가 정상적으로 표시되도록 수정했습니다.
- **다이나믹 대시보드**: 익스텐션 사이드바의 'Dashboard' 버튼이 현재 환경(로컬/프로덕션)을 감지하여 적절한 URL로 연결되도록 개선했습니다.

### [UX] 수동 발행 지원 (복사 + 이동)
- **원클릭 수동 발행**: `PostMapper` 및 `AutopilotStage` 모니터링 카드에 'Copy & Publish' 버튼을 추가했습니다. 클릭 시 가장 최신 생성된 포스트의 HTML을 자동으로 복사하고, 해당 블로그의 글쓰기 관리 페이지를 새 탭으로 열어줍니다.
- **스마트 카피**: `smartCopy` 라이브러리를 연동하여 티스토리 서식에 최적화된 HTML이 클립보드에 담기도록 처리했습니다.

### [Build] 자동화된 빌드 및 압축 파이프라인
- **빌드 스크립트 고도화**: `build-ext.mjs`에 자동 압축 로직을 추가했습니다. 이제 빌드 시 자동으로 최신 익스텐션을 압축하여 `public/maza-extension.zip`으로 제공합니다.
- **최신본 동기화**: 유저가 웹앱에서 익스텐션을 다운로드할 때 항상 가장 최신의 기능과 아이콘이 포함된 버전을 받을 수 있도록 보장했습니다.

### [Branding] 프리미엄 익스텐션 아이콘 적용
- **AI 기반 로고 생성**: MAZA Studio의 정체성을 담은 미래지향적이고 세련된 'M' 로고를 AI로 생성하여 적용했습니다.
- **다중 사이즈 최적화**: Chrome 익스텐션 규격에 맞춰 16x16, 32x32, 48x48, 128x128 사이즈의 PNG 아이콘을 생성하고 `manifest.json`에 등록했습니다.
- **액션 아이콘 동기화**: 브라우저 툴바에서도 프리미엄 아이콘이 노출되도록 `default_icon` 설정을 완료했습니다.

## 2. 검증 결과 (Validation)

### 자동 주입 테스트
- **시나리오**: 이미 인프라가 주입된 블로그에 다시 "자동 주입" 실행
- **결과**: `ALREADY_INJECTED`가 정상 감지되며, 코드가 중복으로 쌓이지 않고 기존 코드가 유지됨. 완료 후 탭이 자동으로 복귀됨.

### 모델 폴백 테스트
- **시나리오**: 상위 AI 모델(Preview) 장애 모사
- **결과**: `aiClient.ts`가 에러를 감지하고 300초간 해당 모델을 격리(Quarantine)한 후 하위 모델로 자동 전환하여 작업을 완수함.

## 3. 향후 유지보수 가이드
- 인프라 주입 코드를 변경할 때는 반드시 `server/index.ts`의 `html` 생성 부분과 `background.ts`의 `processVal` 정규식을 함께 업데이트해야 합니다.
- 익스텐션 배포 시 `node build-ext.mjs` 명령어를 통해 최신 빌드를 생성하고 `dist-ext` 폴더를 배포하십시오.

---
**Status**: 🟢 ALL SYSTEMS STABLE
**Version**: 8.4 (2026-05-16)
