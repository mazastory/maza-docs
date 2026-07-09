# Extension Background Module Map

원본 소스는 `extension/`에 존재하므로, `dist-ext/`는 배포 결과물로만 취급한다.

## Module Roles

- `taskStore.ts`: 현재 실행 중인 작업, 탭 ID, 마지막 즉시 작업을 저장하는 상태 레지스트리.
- `wsClient.ts`: 서버 WebSocket에 붙어 실시간 작업 전달과 재연결을 담당하는 전송 계층.
- `pollingFallback.ts`: WebSocket이 없을 때 서버를 주기적으로 조회하는 HTTP 폴백 계층.
- `taskRouter.ts`: 작업을 탭에 전달하고, 실행 결과를 수집해 서버로 보고하는 실행 라우터.
- `contentExecutor.ts`: 탭의 MAIN world에서 스크립트를 주입하고 DOM 조작 함수를 실행하는 실행기.

## Build Notes

- `vite.config.ts`는 build sourcemap을 `false`로 두어 production 빌드에서 `.map` 산출물을 만들지 않도록 한다.
- 배포 전 확인 기준은 `dist-ext/manifest.json`이며, production 빌드에서는 localhost/127.0.0.1 권한이 제거되어야 한다.