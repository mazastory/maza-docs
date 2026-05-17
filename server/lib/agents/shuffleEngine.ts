import { Blueprint } from './vaultManager.js';

export class ShuffleEngineAgent {
  
  /**
   * 키워드 풀에서 지정된 갯수만큼 무작위로 추출합니다.
   * Fisher-Yates shuffle 알고리즘 사용.
   */
  public static shuffleKeywords(keywords: string[], count: number): string[] {
    if (!keywords || keywords.length === 0) return [];
    
    // 복사본 생성
    const shuffled = [...keywords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, Math.min(count, keywords.length));
  }

  /**
   * 선택된 셔플 키워드들을 기반으로 시리즈 마스터 브리프를 자동 생성합니다.
   * 이 브리프는 나중에 AI Writer가 개별 포스트를 작성할 때 "Context Anchor"로 작용합니다.
   */
  public static generateMasterBrief(blueprint: Blueprint, selectedKeywords: string[]): string {
    if (!selectedKeywords || selectedKeywords.length === 0) {
      return '';
    }

    const seriesTitle = `${blueprint.title} 핵심 가이드 (총 ${selectedKeywords.length}부작)`;
    const description = `이 시리즈는 '${blueprint.description}'의 목적을 달성하기 위해 기획되었습니다.\n타겟 대상: ${blueprint.target_audience}\n`;
    
    let brief = `=== Series Master Brief ===\n`;
    brief += `Title: ${seriesTitle}\n`;
    brief += `Overview: ${description}\n\n`;
    brief += `[Topic Cluster Structure]\n`;
    
    selectedKeywords.forEach((kw, index) => {
      // 첫 번째 글을 Pillar로 간주
      const role = index === 0 ? 'Pillar (Main)' : 'Cluster (Sub)';
      brief += `${index + 1}. [${role}] ${kw}\n`;
    });

    brief += `\n[Context Chaining Rule]\n`;
    brief += `- 각 포스트는 독립적으로 유용하되, 이전 포스트의 핵심 개념을 자연스럽게 언급하며 내부 링크(Anchor)를 유도할 것.\n`;
    brief += `- 유저가 경험한(Experience-First) 스토리텔링을 1문단에 필수 포함할 것.\n`;

    return brief;
  }
}
