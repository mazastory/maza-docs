import axios from 'axios';
import * as cheerio from 'cheerio';
import { MazaLogger } from './logger.js';

export interface VerificationResult {
  success: boolean;
  score: number;
  reason?: string;
  details?: {
    titleMatch: boolean;
    contentLength: number;
    imageCount: number;
    hasAdsense?: boolean;
  };
}

/**
 * [VerificationAgent] 발행된 포스트의 무결성을 서버 사이드에서 최종 검증
 */
export class VerificationAgent {
  /**
   * verifyPost: URL에 접속하여 콘텐츠 정합성 체크
   */
  static async verifyPost(url: string, expectedTitle: string): Promise<VerificationResult> {
    try {
      MazaLogger.info(`[VerificationAgent] Starting verification for: ${url}`);

      // 1. HTML 가져오기 (User-Agent 설정으로 차단 방지)
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
        },
        timeout: 10000
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // 2. 제목 추출 및 비교 (공백 제거 후 부분 일치 여부)
      const pageTitle = $('title').text() || $('h1').first().text();
      const titleMatch = pageTitle.replace(/\s/g, '').includes(expectedTitle.replace(/\s/g, '').substring(0, 10));

      // 3. 본문 길이 및 이미지 추출
      // 티스토리/네이버 공통 컨테이너 클래스들
      const contentText = $('.tt_article_usr, .se-main-container, article, #content').text() || $('body').text();
      const contentLength = contentText.trim().length;
      
      const imageCount = $('img').length;
      const hasAdsense = html.includes('adsbygoogle') || html.includes('googlesyndication');

      // 4. 점수 산출
      let score = 0;
      if (titleMatch) score += 40;
      if (contentLength > 1000) score += 40;
      else if (contentLength > 500) score += 20;
      
      if (imageCount >= 1) score += 20;

      const success = score >= 70;

      MazaLogger.info(`[VerificationAgent] Verification completed. Score: ${score}`, { 
        url, titleMatch, contentLength, imageCount, success 
      });

      return {
        success,
        score,
        reason: success ? undefined : '콘텐츠 무결성 부족 (제목 불일치 또는 분량 미달)',
        details: { titleMatch, contentLength, imageCount, hasAdsense }
      };

    } catch (error: any) {
      MazaLogger.error(`[VerificationAgent] Verification failed due to network/scraping error`, error);
      return {
        success: false,
        score: 0,
        reason: `접근 실패: ${error.message}`
      };
    }
  }
}
