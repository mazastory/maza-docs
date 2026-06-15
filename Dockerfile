# ============================================================
# MazaDocs — Cloud Run Dockerfile
# Stage 1: Build (프론트엔드 빌드)
# Stage 2: Runtime (Nginx 정적 서빙)
# ============================================================

# ── Stage 1: Frontend Build ───────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --prefer-offline
COPY . .

RUN npm run build

# ── Stage 2: Runtime ─────────────────────────────────────
FROM nginx:alpine AS runtime

# Nginx 설정 최적화 및 Cloud Run 기본 포트인 8080 사용
COPY --from=builder /app/dist /usr/share/nginx/html
RUN sed -i 's/listen  *80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# SPA 라우팅 지원 설정 추가 (index.html 폴백)
RUN sed -i '/location \/ {/a \        try_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
