/**
 * =============================================
 * MAZA Studio - Post Verification Service
 * AGENTS.md: Publish Stability (P-02)
 * =============================================
 */

import axios from 'axios';
import { supabaseAdmin } from './supabaseServer.js';
import { MazaLogger } from './logger.js';
import { PostStatus } from './postStatus.js';

export class VerificationService {
  /**
   * 실제 URL에 접속하여 글이 정상적으로 발행되었는지 검증
   */
  static async verifyUrl(postId: string, url: string): Promise<boolean> {
    try {
      MazaLogger.info(`[Verification] Checking URL: ${url}`, { postId });

      // 1. HTTP GET 요청 (User-Agent 설정으로 차단 방지)
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000,
        validateStatus: () => true // 404 등도 직접 핸들링
      });

      if (response.status !== 200) {
        MazaLogger.warn(`[Verification] ❌ HTTP Status ${response.status} for URL: ${url}`, { postId });
        return false;
      }

      // 2. 본문 내용 존재 여부 체크 (티스토리/WP 공통적인 요소 탐지)
      // 간단하게 title이 포함되어 있는지 또는 에디터 흔적이 있는지 확인
      const html = response.data;
      const isOk = html.includes('<title>') && (html.includes('tistory') || html.includes('wp-content') || html.length > 5000);

      if (!isOk) {
        MazaLogger.warn(`[Verification] ❌ Content check failed for URL: ${url}`, { postId });
        return false;
      }

      MazaLogger.info(`[Verification] ✅ URL Verified Successfully: ${url}`, { postId });
      return true;

    } catch (e: any) {
      MazaLogger.error(`[Verification] ❌ Error checking URL: ${url}`, e, { postId });
      return false;
    }
  }

  /**
   * 검증 결과에 따른 후속 조치
   */
  static async handleResult(postId: string, scheduledId: string | null, isSuccess: boolean) {
    if (!supabaseAdmin) return;

    if (isSuccess) {
      await supabaseAdmin.from('ms_scheduled_posts').update({ status: PostStatus.PUBLISHED }).eq('id', scheduledId);
      await supabaseAdmin.from('ms_posts').update({ is_indexed: false }).eq('id', postId); // 인덱싱 대기 상태
    } else {
      await supabaseAdmin.from('ms_scheduled_posts').update({ 
        status: PostStatus.FAILED_VERIFICATION, 
        last_error: 'Verification Failed: URL unreachable or content missing.' 
      }).eq('id', scheduledId);
      
      await supabaseAdmin.from('ms_posts').update({ status: PostStatus.DRAFT }).eq('id', postId); // 재발행을 위해 드래프트로 복구
    }
  }
}
