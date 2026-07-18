# 🛠️ MazaStudio 앱 상태 유지 가이드 (Autopilot v8.1)

이 문서는 MazaStudio의 안정적인 구동을 위해 유저(관리자)와 AI가 통일된 언어로 소통하기 위한 **표준 점검 명령문** 및 **가이드**입니다.

## ① 터미널 자동 점검 (`maza_health_check.sh`)
```bash
bash /Users/m/Downloads/mazastudio/maza_health_check.sh
```
**언제 실행하면 좋나요?**
* 코드 수정 후 배포 전 (필수)
* 시스템 에러나 런타임 오류가 갑자기 발생했을 때
* 새 기능을 추가하기 전, 시스템의 기준선(Baseline)을 확인하고 싶을 때

---

## ② AI에게 복붙할 표준 점검 명령문 (프롬프트)
오류 발생 시 혹은 정기 점검 시, **아래 문장 중 하나를 그대로 복사해서 AI에게 전송**하세요.

### 🔹 종합 점검 (코드 + 설계)
```text
MazaStudio 전체 점검 요청:
1. maza_health_check.sh 실행해서 결과 알려줘
2. CRITICAL_FIXES.md에 등록된 고정 버그 항목이 현재 코드에서 다시 발생하지 않는지 확인해줘
3. server/lib/aiClient.ts의 모델 Fallback 체인이 AGENTS.md 규약과 일치하는지 확인해줘
4. 스키마(schema.sql)와 실제 코드(engine.ts, QueueManager.js)의 컬럼명이 일치하는지 비교해줘
```

### 🔹 배포 전 최종 점검
```text
MazaStudio 배포 전 최종 점검:
1. bash maza_health_check.sh 실행해줘
2. TypeScript 컴파일 오류 없는지 확인해줘
3. .env에 빈 값인 필수 키 없는지 확인해줘
4. extension/manifest.json host_permissions에 배포 도메인이 모두 포함됐는지 확인해줘
5. W-05 발행 간격 로직이 `server/lib/taskDelayHelper.ts`의 유저 설정(publishMode)에 맞게 동작하는지 확인해줘
```

### 🔹 AI 엔진만 빠르게 점검
```text
MazaStudio AI 엔진 점검:
1. server/lib/aiClient.ts에서 폐기 모델명(gemini-1.5, gemini-2.5-flash-preview, gemini-3-flash-latest, gemini-3.1-pro-latest) 사용 여부 검색해줘
2. Fallback 체인 순서 (Primary→1차→2차)가 KI 문서(AI Model Registry)와 일치하는지 확인해줘
3. Quota(429) 에러 발생 시 무한 루프에 빠지지 않고 Key Rotation이 제대로 작동하는지 확인해줘
```

### 🔹 Supabase DB 점검 (SQL Editor에서 실행)
```sql
-- 테이블 존재 여부 확인
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE '%'
ORDER BY table_name;

-- topic_clusters(시리즈) 컬럼 확인
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'topic_clusters' ORDER BY ordinal_position;

-- RLS 활성화 여부 확인
SELECT schemaname, tablename, rowsecurity
FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%';
```

---

## ③ 점검 스크립트 파일 위치 및 역할

`/Users/m/Downloads/mazastudio/` 루트 폴더 기준:

* `maza_health_check.sh`: 매번 실행할 자동 점검 쉘 스크립트 (가장 중요)
* `CRITICAL_FIXES.md`: 재발 방지 버그 목록 (수정 작업 전 항상 먼저 확인)
* `MAINTENANCE_GUIDE.md`: 이 문서 (명령어 및 가이드 모음)
* `schema.sql`: DB 스키마 + 마이그레이션 기준
* `supabase_security_fixes.sql`: 기본 보안 수정 SQL
* `supabase_security_patch2.sql`: 추가 보안 수정 패치 SQL
