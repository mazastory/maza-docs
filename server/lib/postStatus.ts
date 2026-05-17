/**
 * =============================================
 * MAZA Studio - Unified Post Status Contract
 * ENGINE_RULES.md 규칙 A-1: 모든 Worker는 이 Enum만 사용
 * =============================================
 * 위반 시: PR 거절 대상
 */

export const PostStatus = {
  // 생성 파이프라인
  QUEUED:            'queued',           // 큐에 등록됨
  GENERATING:        'generating',       // AI 글 생성 중
  IMAGE_PROCESSING:  'image_processing', // 이미지 처리 중
  VALIDATING:        'validating',       // SEO 검증 중

  // 발행 파이프라인
  READY_TO_PUBLISH:  'ready_to_publish', // 발행 대기 (Extension 픽업 대기)
  PUBLISHING:        'publishing',       // 발행 진행 중
  VERIFYING:         'verifying',        // 발행 후 URL 검증 중

  // 최종 상태
  PUBLISHED:         'published',        // ✅ 성공
  FAILED:            'failed',           // ❌ 재시도 가능한 실패
  DEAD:              'dead',             // 💀 재시도 한계 초과 (인간 개입 필요)

  // 특수 상태
  DRAFT:             'draft',            // 수동 검토 대기
  ARCHIVED:          'archived',         // 보관됨
  FAILED_VERIFICATION: 'failed_verification', // 검증 실패
} as const;

export type PostStatusType = typeof PostStatus[keyof typeof PostStatus];

// 상태 전이 규칙 (허용된 전이만 가능)
export const ALLOWED_TRANSITIONS: Record<PostStatusType, PostStatusType[]> = {
  [PostStatus.QUEUED]:              [PostStatus.GENERATING, PostStatus.FAILED],
  [PostStatus.GENERATING]:          [PostStatus.IMAGE_PROCESSING, PostStatus.FAILED],
  [PostStatus.IMAGE_PROCESSING]:    [PostStatus.VALIDATING, PostStatus.GENERATING, PostStatus.FAILED],
  [PostStatus.VALIDATING]:          [PostStatus.READY_TO_PUBLISH, PostStatus.FAILED],
  [PostStatus.READY_TO_PUBLISH]:    [PostStatus.PUBLISHING],
  [PostStatus.PUBLISHING]:          [PostStatus.VERIFYING, PostStatus.FAILED],
  [PostStatus.VERIFYING]:           [PostStatus.PUBLISHED, PostStatus.FAILED_VERIFICATION],
  [PostStatus.PUBLISHED]:           [PostStatus.ARCHIVED],
  [PostStatus.FAILED]:              [PostStatus.QUEUED, PostStatus.DEAD],  // retry 가능
  [PostStatus.DEAD]:                [],                                     // 인간 개입 필요
  [PostStatus.DRAFT]:               [PostStatus.READY_TO_PUBLISH, PostStatus.ARCHIVED],
  [PostStatus.ARCHIVED]:            [],
  [PostStatus.FAILED_VERIFICATION]: [PostStatus.QUEUED, PostStatus.DEAD],
};

/**
 * 상태 전이 유효성 검증
 * 잘못된 전이 시도 시 에러를 발생시켜 silent failure를 방지
 */
export function validateTransition(from: PostStatusType, to: PostStatusType): boolean {
  const allowed = ALLOWED_TRANSITIONS[from];
  if (!allowed.includes(to)) {
    throw new Error(`[PostStatus] Invalid transition: ${from} → ${to}. Allowed: ${allowed.join(', ')}`);
  }
  return true;
}

/**
 * Dead 상태 판단 (retry 횟수 초과)
 */
export const FAILURE_POLICY = {
  MAX_RETRIES: 3,         // 최대 재시도 횟수
  DEAD_AFTER_RETRIES: 3,  // N회 실패 후 dead 처리
  COOLDOWN_MS: 5000,      // 재시도 간격 (지수 백오프)
  HUMAN_ALERT_THRESHOLD: 5, // N개 이상 dead 시 알림
} as const;
