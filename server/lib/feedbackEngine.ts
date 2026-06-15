/**
 * =============================================
 * MAZA Studio - Data Feedback Loop Engine
 * AGENTS.md: Phase 7 - Self-Learning Intelligence (L-01)
 * =============================================
 */

import { supabaseAdmin } from "./supabaseServer.js";
import { GoogleSearchConsole } from "./googleSearchConsole.js"; // 기존 라이브러리 가정
import { MazaLogger } from "./logger.js";
import { callAgent } from "./aiClient.js";

export class FeedbackEngine {
  /**
   * 7-1. GSC/GA4 데이터 동기화 및 색인 체크
   */
  static async syncPerformance(siteId: string) {
    try {
      MazaLogger.info(`[FeedbackEngine] Syncing real performance for site: ${siteId}`);
      
      // 1. 사이트 및 토큰 정보 조회
      const { data: site } = await supabaseAdmin!
        .from('ms_sites')
        .select('*, ms_profiles(google_access_token)')
        .eq('id', siteId)
        .single();

      if (!site || !site.ms_profiles?.google_access_token) {
        MazaLogger.warn(`[FeedbackEngine] Skipping sync: No Google access token for site ${siteId}`);
        return;
      }

      // 2. GSC 데이터 가져오기
      const rows = await GoogleSearchConsole.getRecentStats(site.domain, site.ms_profiles.google_access_token);

      for (const row of rows) {
        const url = row.keys?.[0];
        if (!url) continue;

        // URL에서 post_id 추출
        const { data: post } = await supabaseAdmin!
          .from('ms_posts')
          .select('id')
          .ilike('published_url', `%${url}%`)
          .limit(1)
          .maybeSingle();

        if (post) {
          await supabaseAdmin!.from('ms_performance_metrics').upsert([{
            site_id: siteId,
            post_id: post.id,
            date: new Date().toISOString().split('T')[0],
            impressions: row.impressions,
            clicks: row.clicks,
            ctr: row.ctr,
            position: row.position
          }]);

          // 실시간 필드 업데이트
          await supabaseAdmin!.from('ms_posts').update({
            gsc_ctr: row.ctr,
            is_indexed: true 
          }).eq('id', post.id);
        }
      }

      // 3. 패턴 학습 및 승인 분석 트리거
      await this.learnWinningPatterns(siteId);
      await this.analyzeApprovalSuccess(site.user_id);

    } catch(e: unknown) {
      MazaLogger.error("Feedback sync failed", e, { siteId });
    }
  }

  /**
   * 7-3. 애드센스 승인 성공률 분석
   */
  static async analyzeApprovalSuccess(userId: string) {
    try {
      const { data: approvedSites } = await supabaseAdmin!
        .from('ms_sites')
        .select('niche, category, adsense_status')
        .eq('user_id', userId)
        .eq('adsense_status', 'approved');

      if (!approvedSites || approvedSites.length === 0) return;

      const nicheStats = approvedSites.reduce((acc: any, site: { niche?: string; category?: string }) => {
        const key = site.niche || site.category || 'General';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      await supabaseAdmin!.from('ms_winning_patterns').upsert([{
        user_id: userId,
        pattern_type: 'niche_success',
        insight: { approved_niches: nicheStats, total_approved: approvedSites.length }
      }]);
    } catch (e) {
      MazaLogger.error("Approval analysis failed", e);
    }
  }

  /**
   * 7-2. Winning Patterns 학습 (AI)
   * 성공적인 글들의 공통점을 분석하여 전략 도출
   */
  static async learnWinningPatterns(siteId: string) {
    try {
      if (!supabaseAdmin) return;

      // 1. 상위 성과 포스트 20개 조회 (CTR 기준)
      const { data: topPosts } = await supabaseAdmin
        .from('ms_posts')
        .select('title, word_count, gsc_ctr, metadata')
        .eq('site_id', siteId)
        .gt('gsc_ctr', 0)
        .order('gsc_ctr', { ascending: false })
        .limit(20);

      if (!topPosts || topPosts.length < 5) return;

      // 2. AI 분석 요청
      const prompt = `
      Analyze these successful blog posts (high CTR):
      ${topPosts.map((p: { title: string; word_count: number; gsc_ctr: number; metadata?: any }) => `- Title: "${p.title}", Length: ${p.word_count}, CTR: ${p.gsc_ctr}, Intent: ${p.metadata?.validation_v2?.searchIntent?.intent}`).join('\n')}
      
      Identify "Winning Patterns" for:
      1. Title structure (e.g., Question style, Listicle)
      2. Optimal length range
      3. Best performing Search Intent
      
      Return JSON: { "best_title_pattern": "...", "optimal_length": 1800, "winning_intent": "..." }
      `;

      const result = await callAgent(prompt, "StrategyLearner", { jsonMode: true });
      const patterns = result.data;

      if (patterns) {
        const { data: site } = await supabaseAdmin.from('ms_sites').select('user_id').eq('id', siteId).single();
        if (site) {
          await supabaseAdmin.from('ms_winning_patterns').upsert([{
            user_id: site.user_id,
            niche: "General", // 향후 카테고리별 분리 가능
            pattern_type: 'combined',
            insight: patterns
          }]);
        }
      }

      MazaLogger.info(`[FeedbackEngine] Successfully learned patterns for site ${siteId}`);

    } catch(e: unknown) {
      MazaLogger.error("Pattern learning failed", e, { siteId });
    }
  }

  /**
   * AI Writer에게 줄 전략 컨텍스트 반환
   */
  static async getStrategyContext(userId: string) {
    const { data: pattern } = await supabaseAdmin!
      .from('ms_winning_patterns')
      .select('insight')
      .eq('user_id', userId)
      .order('last_updated', { ascending: false })
      .limit(1)
      .maybeSingle();

    return pattern?.insight || null;
  }
}
