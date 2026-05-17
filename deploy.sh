#!/bin/bash
# ============================================================
# MazaStudio — Cloud Run 배포 스크립트
# 사용법: ./deploy.sh [prod|staging]
# ============================================================

set -e  # 에러 발생 시 즉시 중단

ENV=${1:-prod}
PROJECT_ID="mazastory"      # ← GCP 프로젝트 ID로 변경
REGION="asia-northeast3"           # 서울 리전
SERVICE_NAME="mazastudio-server"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
TAG=$(date +%Y%m%d-%H%M%S)

echo "🚀 MazaStudio Cloud Run 배포 시작 (환경: ${ENV}, 태그: ${TAG})"

# 1. 프론트엔드 빌드 (환경변수 주입)
echo "📦 프론트엔드 빌드 중..."
npm run build

# 2. Docker 이미지 빌드
echo "🐳 Docker 이미지 빌드 중..."
gcloud builds submit \
  --tag "${IMAGE_NAME}:${TAG}" \
  --project "${PROJECT_ID}"

# 3. Cloud Run 배포
echo "☁️  Cloud Run 배포 중..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_NAME}:${TAG}" \
  --platform managed \
  --region "${REGION}" \
  --project "${PROJECT_ID}" \
  --allow-unauthenticated \
  --port 3001 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production" \
  --update-secrets "\
    SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest,\
    GEMINI_API_KEY=GEMINI_API_KEY:latest,\
    PEXELS_API_KEY=PEXELS_API_KEY:latest,\
    R2_ACCESS_KEY_ID=R2_ACCESS_KEY_ID:latest,\
    R2_SECRET_ACCESS_KEY=R2_SECRET_ACCESS_KEY:latest,\
    REDIS_URL=REDIS_URL:latest,\
    GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID:latest,\
    GOOGLE_CLIENT_SECRET=GOOGLE_CLIENT_SECRET:latest"

echo ""
echo "✅ 배포 완료!"
echo "🌐 URL: https://$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --project ${PROJECT_ID} --format 'value(status.url)')"
