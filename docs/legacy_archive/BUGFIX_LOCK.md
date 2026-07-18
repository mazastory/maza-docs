# BUGFIX_LOCK.md — 이 파일의 항목은 절대 되돌리지 않는다

이 문서는 개발 중 발생한 치명적인 버그(특히 무한 루프, 태스크 유실, 타임아웃 낭비 등)를 해결한 핵심 로직을 '고정(Lock)'하기 위해 작성되었습니다. 
이 파일에 명시된 규칙과 조건은 어떠한 이유로든(최적화, 리팩토링 등) 절대 임의로 되돌리거나 삭제해서는 안 됩니다.

---

## [고정] AuthProvider 토큰 중복 sync 방지
- **파일**: `src/components/AuthProvider.tsx`
- **조건**: 전역 변수 `globalLastToken === token` 이면 `return`
- **이유**: 동일한 토큰에 대해 반복적으로 동기화(`sync`)를 호출하면, 익스텐션에서 `Auth storage changed` 이벤트가 폭풍처럼 쏟아져 초기화에 20초 이상의 시간이 낭비됨.

## [고정] PublishFlow는 DELIVER 수신 후 시작
- **파일**: `extension/content/injector.ts` (PublishDriver)
- **조건**: 백그라운드 워커로부터 `DELIVER` 메시지를 수신한 콜백 안에서만 `taskId`를 부여받고 `runPublishFlow()`를 호출.
- **이유**: `READY` 신호를 보낸 직후 태스크가 아직 배달되지 않은 상태에서 자체적으로 시작해버리면 `unknown-task`로 실행되어, 발행이 성공해도 서버에 성공 보고를 할 수 없고 태스크가 무한 재할당됨.

## [고정] Validation에서 발행버튼 탐색 제거
- **파일**: `extension/content/injector.ts` (validatePublishState 로직 등)
- **조건**: 초기 Validation 단계에서는 발행 버튼 존재 여부를 미리 탐색하지 않음. 실제 버튼 클릭이 필요한 `openPublishLayer()` 단계에서만 탐색.
- **이유**: 버튼을 찾느라 11개 셀렉터를 순회하며 4초(4018ms) 이상을 낭비하는 병목을 제거하기 위함. 실제 주입 작업은 500ms 미만이 소요됨.

## [고정] chrome.alarms.onAlarm 단일 등록
- **파일**: `extension/background/background.ts` (및 번들되는 모듈들)
- **조건**: `chrome.alarms.onAlarm.addListener`는 반드시 모듈 초기화 과정에서 이중으로 등록되지 않도록 관리 (현재 `background.ts` 최상단 초기화 사이클에서만 1개 유지).
- **이유**: MV3 Service Worker가 절전 모드에서 복귀(Wake up)할 때 리스너가 유실되거나 중복 등록되면서 발생하는 `undefined` 참조 에러 및 타이머 충돌을 방지하기 위함.
