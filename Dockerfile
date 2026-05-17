# ============================================================
# MazaStudio — Cloud Run Dockerfile
# Stage 1: Build (프론트엔드 빌드)
# Stage 2: Runtime (서버만 실행, dist 정적파일 서빙)
# ============================================================

# ── Stage 1: Frontend Build ───────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
RUN apk add --no-cache rsync

# 패키지 파일 복사 및 의존성 설치 (캐시 최적화)
COPY package*.json ./
RUN npm install --prefer-offline

# 소스 코드 복사
COPY . .

# 프로덕션 빌드 (VITE_* 환경변수는 빌드 시 주입)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_CLOUDFLARE_WORKER_URL
ARG VITE_SENTRY_DSN
RUN npm run build

# ── Stage 2: Runtime ─────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

# 서버 실행에 필요한 파일만 복사
COPY package*.json ./
RUN npm install --omit=dev --prefer-offline

# 서버 소스 복사 (컴파일된 JS 버전)
COPY --from=builder /app/dist-server ./

# 빌드된 프론트엔드 복사
COPY --from=builder /app/dist ./dist

# src/lib/ 의존성 (컴파일된 파일이 dist-server/src/lib에 있을 경우)
# 서버 실행 (Cloud Run은 PORT 환경변수를 주입함, 기본값 8080)
EXPOSE 8080

# HEALTHCHECK (Cloud Run 환경에서는 wget이 localhost:PORT로 찔러야 함)
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:$PORT/api/health || exit 1

CMD ["node", "server/index.js"]
