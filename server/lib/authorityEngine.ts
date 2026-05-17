/**
 * =============================================
 * MAZA Studio - Real Authority Engine v2.0 (Phase B-2)
 * =============================================
 * 이전 버전: 단순 카운터 (글 수 / 10)
 * 이번 버전: Topic Cluster 기반 실제 Authority Score 계산
 */

import { supabaseAdmin } from "./supabaseServer.js";
import { MazaLogger } from "./logger.js";

export class AuthorityEngine {
  /**
   * [B-2] 실제 Topic Cluster 기반 내부 링크 추천
   * - 같은 cluster_id를 가진 발행된 글 중 상위 3개 추천
   * - Pillar 페이지(authority_score 최고)를 최우선으로
   */
  static async getInternalLinkSuggestions(userId: string, postId: string, keyword: string): Promise<{title: string, url: string}[]> {
    try {
      // 1. 현재 포스트의 cluster_id 조회
      const { data: post } = await supabaseAdmin!
        .from('ms_posts')
        .select('cluster_id, site_id, category')
        .eq('id', postId)
        .single();

      if (!post) return [];

      let links: any[] = [];

      // 2. cluster_id가 있으면 같은 cluster의 글 우선
      if (post.cluster_id) {
        const { data: clusterPosts } = await supabaseAdmin!
          .from('ms_posts')
          .select('id, title, published_url')
          .eq('cluster_id', post.cluster_id)
          .eq('status', 'published')
          .neq('id', postId)
          .not('published_url', 'is', null)
          .order('gsc_ctr', { ascending: false })  // CTR 높은 순
          .limit(3);

        links = (clusterPosts || []).map((p: any) => ({ title: p.title, url: p.published_url }));
      }

      // 3. 부족하면 같은 사이트의 최신글 추천
      if (links.length < 3) {
        const { data: recentPosts } = await supabaseAdmin!
          .from('ms_posts')
          .select('id, title, published_url')
          .eq('site_id', post.site_id)
          .eq('status', 'published')
          .neq('id', postId)
          .not('published_url', 'is', null)
          .order('created_at', { ascending: false })
          .limit(3 - links.length);

        const recentLinks = (recentPosts || []).map((p: any) => ({ title: p.title, url: p.published_url }));
        links = [...links, ...recentLinks];
      }

      return links;
    } catch (e) {
      MazaLogger.error("[AuthorityEngine] Internal link suggestion failed", e, { postId });
      return [];
    }
  }

  /**
   * [B-2] 실제 Authority Score 계산 (단순 카운터 → 다차원 지표)
   * - 발행 글 수 (40%)
   * - 평균 CTR (30%)
   * - 내부 링크 밀도 (20%)
   * - 인덱싱 비율 (10%)
   */
  static async calculateTopicalDepth(siteId: string, clusterIdOrCategory: string): Promise<number> {
    try {
      // 1. 해당 클러스터 글 통계
      const { data: posts } = await supabaseAdmin!
        .from('ms_posts')
        .select('id, gsc_ctr, is_indexed')
        .eq('site_id', siteId)
        .eq('cluster_id', clusterIdOrCategory)
        .eq('status', 'published');

      if (!posts || posts.length === 0) return 0;

      const publishedCount = posts.length;
      const avgCTR = posts.reduce((sum: number, p: { gsc_ctr?: number }) => sum + (p.gsc_ctr || 0), 0) / publishedCount;
      const indexedRatio = posts.filter((p: { is_indexed?: boolean }) => p.is_indexed).length / publishedCount;

      // 2. 내부 링크 수 집계
      const { count: linkCount } = await supabaseAdmin!
        .from('ms_internal_links')
        .select('*', { count: 'exact', head: true })
        .in('source_post_id', posts.map((p: { id: string }) => p.id));

      const linkDensity = Math.min((linkCount || 0) / (publishedCount * 2), 1.0);

      // 3. 종합 Authority Score (0.0 ~ 1.0)
      const score =
        (Math.min(publishedCount / 10, 1.0) * 0.40) +
        (Math.min(avgCTR * 10, 1.0) * 0.30) +
        (linkDensity * 0.20) +
        (indexedRatio * 0.10);

      return Math.round(score * 100) / 100;
    } catch (e) {
      MazaLogger.error("[AuthorityEngine] Depth calculation failed", e, { siteId });
      return 0;
    }
  }

  /**
   * [B-2] Pillar 페이지 자동 감지
   * - cluster 내에서 CTR, 발행일 등을 종합하여 Pillar 후보를 선정
   */
  static async identifyPillarPost(clusterId: string): Promise<string | null> {
    try {
      const { data: posts } = await supabaseAdmin!
        .from('ms_posts')
        .select('id, title, gsc_ctr, word_count')
        .eq('cluster_id', clusterId)
        .eq('status', 'published')
        .order('gsc_ctr', { ascending: false })
        .limit(1);

      return posts?.[0]?.id || null;
    } catch (e) {
      return null;
    }
  }

  /**
   * [B-2] 내부 링크 자동 기록
   * - 새 포스트 발행 후 같은 cluster 내 포스트들과 링크 관계 등록
   */
  static async registerInternalLinks(sourcePostId: string, targetPostIds: string[]): Promise<void> {
    if (targetPostIds.length === 0) return;
    try {
      const links = targetPostIds.map(targetId => ({
        source_post_id: sourcePostId,
        target_post_id: targetId,
        is_pillar_link: false
      }));
      await supabaseAdmin!.from('ms_internal_links').upsert(links, { onConflict: 'source_post_id,target_post_id' });
    } catch (e) {
      MazaLogger.error("[AuthorityEngine] Link registration failed", e, { sourcePostId });
    }
  }

  /**
   * [B-2] 텍스트 정보 밀도 분석
   * - 단순 글자 수 대비 핵심 정보(수치, 키워드, 서식) 비중 계산
   * - ValidationWorker에서 주제 깊이 점수 보정에 활용
   */
  static analyzeInformationDensity(content: string): number {
    try {
      if (!content || content.length < 100) return 0;

      // 1. 기본 통계
      const charCount = content.replace(/\s/g, '').length;
      const sentences = content.split(/[.!?]\s/).length;
      
      // 2. 수치 데이터 밀도 (날짜, 백분율, 금액 등)
      const dataPoints = (content.match(/\d+[%월일년원배개점]|\d+\.\d+/g) || []).length;
      
      // 3. 핵심 키워드 밀도 (전문 용어, 고유 명사 후보)
      const nouns = (content.match(/[가-힣]{2,6}(?=이|가|을|를|은|는|의|에|로|와|과)/g) || []);
      const uniqueNouns = new Set(nouns).size;

      // 4. 서식 풍부도 (Bold, Link, List 등)
      const formatPoints = (content.match(/\*\*|\[.+?\]\(.+?\)|^\s*[-*+]\s/gm) || []).length;

      // 5. 종합 밀도 점수 계산 (0 ~ 100)
      // 기준: 1,500자 기준 수치 5개 이상, 유니크 명사 30개 이상, 서식 5개 이상 시 고밀도
      const densityScore = 
        (Math.min(dataPoints / 5, 1.0) * 30) +
        (Math.min(uniqueNouns / 30, 1.0) * 40) +
        (Math.min(formatPoints / 5, 1.0) * 20) +
        (Math.min(sentences / 15, 1.0) * 10);

      return Math.round(densityScore);
    } catch (e) {
      return 50; // 에러 시 평균값 반환
    }
  }
}
