import { supabaseAdmin } from './supabaseServer.js';
import { callDeepAI } from './aiClient.js';

export interface SeriesConfig {
  title: string;
  userId: string;
  siteId?: string; // 추가: 사이트 연동 강화
  postCount: number;
  platform: 'tistory' | 'wordpress' | 'blogspot';
}

export class SeriesManager {
  /**
   * 1. 시리즈 마스터 브리프 생성 및 클러스터 등록 (Section 20-1)
   */
  static async createMasterBrief(config: SeriesConfig) {
    const prompt = `
      당신은 고도로 숙련된 디지털 미디어 전략가입니다. 
      주제: "${config.title}"를 바탕으로 총 ${config.postCount}개의 블로그 포스트 시리즈를 기획하세요.
      
      [목표]
      - 검색 엔진이 사랑하는 '주제 권위(Topical Authority)' 확보.
      - 1번부터 ${config.postCount}번까지 서사가 자연스럽게 이어지는 시리즈 구성.
      
      [결과 형식 - 반드시 JSON으로 응답]
      {
        "master_brief": "전체 시리즈의 핵심 메시지와 목적...",
        "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
        "plan": [
          {"order": 1, "title": "제목1", "summary": "요약1"},
          ...
        ]
      }
    `;

    const aiResponse = await callDeepAI(prompt, { jsonMode: true }); 
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (e) {
      // JSON 파싱 실패 시 텍스트 기반 폴백 (기존 로직 유지)
      parsed = { master_brief: aiResponse, keywords: [config.title] };
    }

    const { data, error } = await supabaseAdmin
      .from('ms_topic_clusters')
      .insert({
        user_id: config.userId,
        site_id: config.siteId,
        title: config.title, // name 대신 title 사용 (v2.0 스키마 호환)
        pillar_keyword: config.title, // NOT NULL 제약조건 우회
        master_brief: parsed.master_brief,
        keywords: parsed.keywords || [config.title],
        metadata: { 
          description: parsed.description || `${config.postCount}개 포스트로 구성된 자동화 시리즈`,
          postCount: config.postCount 
        },
        authority_score: 0.1
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * 2. 시리즈 내 다음 포스트 생성 (Section 20-2: Context Chaining)
   */
  static async generateNextPostInSeries(clusterId: string, order: number) {
    // 1. 마스터 브리프 및 이전 포스트 요약 가져오기
    const { data: cluster } = await supabaseAdmin
      .from('ms_topic_clusters')
      .select('*')
      .eq('id', clusterId)
      .single();

    const { data: prevPost } = await supabaseAdmin
      .from('ms_posts')
      .select('metadata, title')
      .eq('cluster_id', clusterId) // series_id 대신 cluster_id 사용 표준화
      .eq('metadata->>series_order', order - 1)
      .maybeSingle();

    const masterBrief = cluster?.master_brief || '전략 브리프 없음';
    const prevSummary = prevPost?.metadata?.key_takeaways || '첫 번째 포스트입니다.';

    const contextPrompt = `
      [시리즈 마스터 브리프]
      ${masterBrief}
      
      [이전 포스트(${order - 1}번) 요약]
      ${prevSummary}
      
      당신은 현재 이 시리즈의 ${order}번째 포스트를 작성해야 합니다. 
      이전 포스트의 맥락을 이어받아 "지난 글에서 언급했듯이..."와 같은 표현을 사용하여 독자에게 연속성을 제공하세요.
      전체 시리즈의 흐름을 훼손하지 않으면서 ${order}번 포스트의 고유한 가치를 전달하세요.
    `;

    return contextPrompt;
  }
}
