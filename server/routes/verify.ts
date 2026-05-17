import express from 'express';
import { supabaseAdmin } from '../lib/supabaseServer.js';

const router = express.Router();

/**
 * =============================================
 * MAZA Studio - URL Verification Route
 * AGENTS.md v6.0 Section 3: VerificationAgent
 *
 * 100점제 / 7항목 URL 기반 발행 후 검증
 * 70점 이상 → PASS (다음 단계 진행)
 * 40~69점  → WARNING (수정 가이드)
 * ~39점    → FAIL (재작성 필요)
 * =============================================
 */

interface VerificationResult {
  score: number;
  grade: 'PASS' | 'WARNING' | 'FAIL';
  gradeLabel: string;
  checks: Record<string, { passed: boolean; score: number; detail?: string }>;
  suggestions: string[];
}

function scoreUrl(html: string, keyword: string, url: string): VerificationResult {
  const suggestions: string[] = [];
  let totalScore = 0;

  // 1. 제목에 키워드 포함 (20점)
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : '';
  const keywordInTitle = titleText.toLowerCase().includes(keyword.toLowerCase());
  const titleScore = keywordInTitle ? 20 : 0;
  totalScore += titleScore;
  if (!keywordInTitle) suggestions.push(`페이지 제목에 키워드 "${keyword}"를 포함하세요.`);

  // 2. 본문 1,500자 이상 (20점)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyText = (bodyMatch ? bodyMatch[1] : html).replace(/<[^>]*>/g, '').replace(/\s+/g, '');
  const wordCount = bodyText.length;
  const wordCountPassed = wordCount >= 1500;
  const wordScore = wordCountPassed ? 20 : (wordCount >= 1000 ? 10 : 0);
  totalScore += wordScore;
  if (!wordCountPassed) suggestions.push(`본문이 ${wordCount}자입니다. 1,500자 이상 권장합니다.`);

  // 3. H2/H3 2개 이상 (15점)
  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;
  const headingTotal = h2Count + h3Count;
  const headingPassed = headingTotal >= 2;
  const headingScore = headingPassed ? 15 : (headingTotal === 1 ? 7 : 0);
  totalScore += headingScore;
  if (!headingPassed) suggestions.push(`H2/H3 소제목을 2개 이상 사용하세요. (현재: ${headingTotal}개)`);

  // 4. 이미지 1개 이상 (15점)
  const imgCount = (html.match(/<img[^>]+src/gi) || []).length;
  const hasImage = imgCount >= 1;
  const imageScore = hasImage ? 15 : 0;
  totalScore += imageScore;
  if (!hasImage) suggestions.push('이미지를 1개 이상 포함하세요.');

  // 5. 내부 링크 (10점)
  let domain = '';
  try { domain = new URL(url).hostname; } catch {}
  const internalLinks = domain
    ? (html.match(new RegExp(`href="[^"]*${domain.replace('.', '\\.')}[^"]*"`, 'gi')) || []).length
    : 0;
  const hasInternalLink = internalLinks >= 1;
  const linkScore = hasInternalLink ? 10 : 0;
  totalScore += linkScore;
  if (!hasInternalLink) suggestions.push('블로그 내 다른 글로 연결되는 내부 링크를 추가하세요.');

  // 6. 메타 디스크립션 (10점)
  const metaDesc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const hasMetaDesc = !!metaDesc;
  const metaScore = hasMetaDesc ? 10 : 0;
  totalScore += metaScore;
  if (!hasMetaDesc) suggestions.push('메타 디스크립션을 추가하면 검색 클릭률(CTR)이 높아집니다.');

  // 7. 모바일 뷰포트 (10점)
  const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);
  const viewportScore = hasViewport ? 10 : 0;
  totalScore += viewportScore;
  if (!hasViewport) suggestions.push('모바일 뷰포트 메타태그를 추가하세요.');

  // 등급 결정
  let grade: 'PASS' | 'WARNING' | 'FAIL';
  let gradeLabel: string;
  if (totalScore >= 70) {
    grade = 'PASS';
    gradeLabel = '✅ 검증 완료! 다음 미션으로 이동합니다.';
  } else if (totalScore >= 40) {
    grade = 'WARNING';
    gradeLabel = '⚠️ 부족한 항목이 있습니다. 수정 후 재검증하세요.';
  } else {
    grade = 'FAIL';
    gradeLabel = '❌ 기준 미달입니다. 가이드를 참고하여 다시 작성해주세요.';
  }

  return {
    score: totalScore,
    grade,
    gradeLabel,
    checks: {
      keywordInTitle:   { passed: keywordInTitle, score: titleScore, detail: titleText.slice(0, 50) },
      wordCount:        { passed: wordCountPassed, score: wordScore, detail: `${wordCount}자` },
      headingStructure: { passed: headingPassed, score: headingScore, detail: `H2:${h2Count} H3:${h3Count}` },
      hasImage:         { passed: hasImage, score: imageScore, detail: `${imgCount}개` },
      hasInternalLink:  { passed: hasInternalLink, score: linkScore, detail: `${internalLinks}개` },
      hasMetaDesc:      { passed: hasMetaDesc, score: metaScore },
      hasViewport:      { passed: hasViewport, score: viewportScore }
    },
    suggestions
  };
}

/**
 * POST /api/verify
 * 발행된 URL을 검증하여 SEO 점수를 반환
 */
router.post('/', async (req, res) => {
  try {
    const { url, keyword, post_id, user_id } = req.body;

    if (!url || !keyword || !user_id) {
      return res.status(400).json({ success: false, error: 'url, keyword, user_id가 필요합니다.' });
    }

    // URL에서 HTML 가져오기
    const response = await fetch(url, {
      headers: { 'User-Agent': 'MazaStudio-Verifier/1.0' },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        error: `URL에 접근할 수 없습니다 (${response.status}). 발행 후 잠시 기다렸다가 다시 시도해 주세요.`
      });
    }

    const html = await response.text();
    const result = scoreUrl(html, keyword, url);

    // DB 업데이트
    if (supabaseAdmin) {
      if (post_id) {
        await supabaseAdmin.from('ms_posts')
          .update({
            published_url: url,
            status: 'published',
            seo_score: result.score
          })
          .eq('id', post_id)
          .eq('user_id', user_id);
      }

      // 이벤트 로그
      await supabaseAdmin.from('ms_events').insert([{
        user_id,
        event_type: 'verify',
        status: result.grade === 'FAIL' ? 'failed' : 'success',
        metadata: {
          url,
          keyword,
          score: result.score,
          grade: result.grade
        }
      }]);
    }

    res.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('[Verify Error]', error);
    res.status(500).json({
      success: false,
      error: 'URL 검증 중 오류가 발생했습니다. URL이 올바른지 확인하고 다시 시도해 주세요.'
    });
  }
});

/**
 * POST /api/verify/infra
 * 블로그 홈 HTML을 검증하여 서치콘솔 및 GA4 코드 존재 여부 확인
 */
router.post('/infra', async (req, res) => {
  try {
    let { domain, sc_tag, ga_id } = req.body;

    if (!domain) {
      return res.status(400).json({ success: false, error: 'domain이 필요합니다.' });
    }

    // [Fix] Robust domain extraction and URL construction
    let targetUrl = domain;
    if (!targetUrl.startsWith('http')) targetUrl = `https://${targetUrl}`;
    
    // Tistory specific subdomain handling
    if (domain.includes('.tistory.com') && !domain.startsWith('http')) {
      const subdomain = domain.split('.')[0];
      targetUrl = `https://${subdomain}.tistory.com`;
    }

    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'MazaStudio-InfraVerifier/1.0' },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        error: `블로그에 접근할 수 없습니다 (${response.status}). 주소를 확인해 주세요.`
      });
    }

    const html = await response.text();
    
    let scTagFound = true;
    let gaIdFound = true;

    if (sc_tag) {
      let cleanScTag = sc_tag;
      const contentMatch = cleanScTag.match(/content="([^"]+)"/);
      if (contentMatch) cleanScTag = contentMatch[1];
      if (cleanScTag.startsWith('google-site-verification=')) cleanScTag = cleanScTag.replace('google-site-verification=', '');
      
      scTagFound = html.includes(cleanScTag);
    }
    
    if (ga_id) {
      const cleanGaId = ga_id.trim();
      // More robust check: look for the ID in various common script formats
      gaIdFound = html.includes(cleanGaId) || 
                  html.includes(cleanGaId.toLowerCase()) ||
                  html.includes(`'${cleanGaId}'`) ||
                  html.includes(`"${cleanGaId}"`);
      
      if (!gaIdFound) {
        console.warn(`[Verify Infra] GA4 ID ${cleanGaId} not found in HTML of ${targetUrl}`);
      }
    }

    res.json({
      success: true,
      data: {
        scTagFound,
        gaIdFound
      }
    });

  } catch (error: any) {
    console.error('[Verify Infra Error]', error);
    res.status(500).json({
      success: false,
      error: '블로그 접속 중 오류가 발생했습니다. (네트워크 타임아웃 등)'
    });
  }
});

export default router;
