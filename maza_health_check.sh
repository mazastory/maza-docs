#!/bin/bash
# =============================================
# MazaStudio Master Health Check v1.0
# 사용법: bash maza_health_check.sh
# =============================================

set -uo pipefail

ROOT="/Users/m/Downloads/mazastudio"
PASS=0
FAIL=0
WARN=0

green()  { echo -e "\033[0;32m✅ $1\033[0m"; }
red()    { echo -e "\033[0;31m❌ $1\033[0m"; }
yellow() { echo -e "\033[0;33m⚠️  $1\033[0m"; }
header() { echo -e "\n\033[1;34m══════════════════════════════════════\033[0m"; echo -e "\033[1;34m  $1\033[0m"; echo -e "\033[1;34m══════════════════════════════════════\033[0m"; }

pass() { green "$1"; ((PASS++)); }
fail() { red "$1";  ((FAIL++)); }
warn() { yellow "$1"; ((WARN++)); }

cd "$ROOT"

# ─────────────────────────────────────
# [1] 폐기 AI 모델명 검사 (CRITICAL_FIXES FIX-06)
# ─────────────────────────────────────
header "[1] AI 모델 레지스트리 검사"

BANNED_MODELS=("gemini-1.5-flash" "gemini-1.5-pro" "gemini-2.5-flash-preview" "gemini-3-flash-latest" "gemini-2.0-flash-exp" "gemini-3.1-pro-latest" "gemini-3.1-flash-lite-latest")
for model in "${BANNED_MODELS[@]}"; do
  if grep -rq "\"$model\"" server/ extension/ 2>/dev/null; then
    fail "폐기 모델 발견: $model (server/ 내)"
  else
    pass "폐기 모델 없음: $model"
  fi
done

# ─────────────────────────────────────
# [2] 필수 환경변수 키 존재 확인 (.env 또는 .env.local)
# ─────────────────────────────────────
header "[2] 환경변수 키 확인"

ENV_FILE=".env"
[ -f ".env.local" ] && ENV_FILE=".env.local"

REQUIRED_VARS=("GEMINI_API_KEY" "VITE_SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY" "PEXELS_API_KEY")
for var in "${REQUIRED_VARS[@]}"; do
  if grep -q "^${var}=" "$ENV_FILE" 2>/dev/null; then
    val=$(grep "^${var}=" "$ENV_FILE" | cut -d'=' -f2)
    if [ -z "$val" ] || [ "$val" = '""' ] || [ "$val" = "''" ]; then
      fail "환경변수 비어 있음: $var"
    else
      pass "환경변수 설정됨: $var"
    fi
  else
    fail "환경변수 없음: $var (${ENV_FILE}에 추가 필요)"
  fi
done

# ─────────────────────────────────────
# [3] API Key 클라이언트 노출 검사
# ─────────────────────────────────────
header "[3] API Key 클라이언트 노출 검사"

if grep -rn "GEMINI_TEXT_API_KEY\|AIza" src/ 2>/dev/null | grep -v "//"; then
  fail "클라이언트 코드(src/)에 API Key 노출 의심"
else
  pass "API Key 클라이언트 노출 없음"
fi

# ─────────────────────────────────────
# [4] W-05 안전 프로토콜 (3시간 = 10800초)
# ─────────────────────────────────────
header "[4] W-05 안전 간격 검사 (10800초)"

if grep -q "interval_hours || 3" server/lib/engine.ts && grep -q "intervalHours \* 60 \* 60 \* 1000" server/lib/engine.ts; then
  pass "W-05: 3시간 강제 간격 확인 (server/lib/engine.ts)"
else
  fail "W-05: 3시간 보호 로직이 유실됨 (server/lib/engine.ts 확인 필요)"
fi

# ─────────────────────────────────────
# [5] ms_ai_cache 테이블명 통일 검사
# ─────────────────────────────────────
header "[5] DB 테이블명 일관성 검사"

if grep -rn "from('ai_cache')" server/ 2>/dev/null; then
  fail "구버전 테이블명 'ai_cache' 발견 — 'ms_ai_cache'로 수정 필요"
else
  pass "테이블명 일관성: ms_ai_cache 통일 확인"
fi

# ─────────────────────────────────────
# [6] CRITICAL_FIXES.md 존재 확인
# ─────────────────────────────────────
header "[6] CRITICAL_FIXES.md 무결성 확인"

if [ -f "CRITICAL_FIXES.md" ]; then
  pass "CRITICAL_FIXES.md 존재함"
  FIX_COUNT=$(grep -c "^### \[FIX-" CRITICAL_FIXES.md 2>/dev/null || echo 0)
  pass "등록된 FIX 항목: ${FIX_COUNT}건"
else
  fail "CRITICAL_FIXES.md 없음"
fi

# ─────────────────────────────────────
# [7] 익스텐션 manifest.json 유효성
# ─────────────────────────────────────
header "[7] Chrome 익스텐션 manifest.json 검사"

if python3 -c "import json; json.load(open('extension/manifest.json'))" 2>/dev/null; then
  pass "manifest.json: 유효한 JSON"
else
  fail "manifest.json: JSON 파싱 오류"
fi

if grep -q "run.app" extension/manifest.json; then
  pass "manifest.json: Cloud Run 도메인 포함"
else
  warn "manifest.json: *.run.app 도메인 없음 (프로덕션 배포 시 추가 필요)"
fi

# ─────────────────────────────────────
# [8] TypeScript 컴파일 오류 검사
# ─────────────────────────────────────
header "[8] TypeScript 컴파일 검사"

if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
  TS_ERRORS=$(npx tsc --noEmit 2>&1 | grep "error TS" | wc -l | tr -d ' ')
  fail "TypeScript 오류: ${TS_ERRORS}건"
  npx tsc --noEmit 2>&1 | grep "error TS" | head -5
else
  pass "TypeScript 컴파일 오류 없음"
fi

# ─────────────────────────────────────
# [9] 미사용/금지 패키지 검사
# ─────────────────────────────────────
header "[9] package.json 패키지 검사"

BANNED_PKGS=("playwright" "cypress")
for pkg in "${BANNED_PKGS[@]}"; do
  if grep -q "\"$pkg\"" package.json; then
    fail "미사용 무거운 패키지 발견: $pkg (제거 권장)"
  else
    pass "금지 패키지 없음: $pkg"
  fi
done

# ─────────────────────────────────────
# [10] 서버 Rate Limit 이벤트 status 명시 확인
# ─────────────────────────────────────
header "[10] Rate Limit 이벤트 status 명시 확인"

if grep -A5 "event_type: 'generate'" server/routes/generate.ts | grep -q "status: 'success'"; then
  pass "generate 이벤트에 status: 'success' 명시됨"
else
  fail "generate 이벤트에 status 미명시 — Rate Limit 카운팅 오류 가능"
fi

# ─────────────────────────────────────
# [11] 서버 시작 가능 여부 (문법 체크)
# ─────────────────────────────────────
header "[11] 서버 진입점 문법 검사"

if npx tsx --version >/dev/null 2>&1; then
  if npx tsx --check server/index.ts 2>&1 | grep -q "error"; then
    fail "server/index.ts: 문법 오류 감지"
  else
    pass "server/index.ts: 문법 정상"
  fi
else
  warn "tsx 미설치 — 서버 문법 검사 생략"
fi

# ─────────────────────────────────────
# 최종 결과
# ─────────────────────────────────────
echo ""
echo -e "\033[1;37m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m"
echo -e "\033[1;37m  MazaStudio Health Check 결과 요약\033[0m"
echo -e "\033[1;37m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m"
echo -e "  \033[0;32m✅ PASS: $PASS\033[0m"
echo -e "  \033[0;33m⚠️  WARN: $WARN\033[0m"
echo -e "  \033[0;31m❌ FAIL: $FAIL\033[0m"
echo ""

if [ "$FAIL" -eq 0 ] && [ "$WARN" -eq 0 ]; then
  echo -e "\033[1;32m  🚀 시스템 완전 정상 — 배포 가능 상태\033[0m"
elif [ "$FAIL" -eq 0 ]; then
  echo -e "\033[1;33m  ⚠️  경미한 경고만 있음 — 검토 후 배포\033[0m"
else
  echo -e "\033[1;31m  🚨 즉시 수정 필요 — 배포 보류\033[0m"
fi
echo ""
