import fs from 'fs';
import path from 'path';

export interface Blueprint {
  id: string;
  title: string;
  description: string;
  target_audience: string;
  average_cpc_score: number;
  theme_color: string;
  keywords: string[];
}

export class VaultManagerAgent {
  private static instance: VaultManagerAgent;
  private blueprints: Blueprint[] = [];
  private lastLoaded: number = 0;

  private constructor() {
    this.loadBlueprints();
  }

  public static getInstance(): VaultManagerAgent {
    if (!VaultManagerAgent.instance) {
      VaultManagerAgent.instance = new VaultManagerAgent();
    }
    return VaultManagerAgent.instance;
  }

  /**
   * blueprints.json 파일을 로드하여 메모리에 캐싱합니다.
   * 파일이 변경되면 핫리로드를 위해 1분 단위로 캐시를 갱신합니다.
   */
  private loadBlueprints() {
    try {
      // 60초 캐시
      if (Date.now() - this.lastLoaded < 60000 && this.blueprints.length > 0) {
        return;
      }

      const filePath = path.join(process.cwd(), 'server', 'data', 'blueprints.json');
      if (!fs.existsSync(filePath)) {
        console.warn('[VaultManager] blueprints.json not found at', filePath);
        this.blueprints = [];
        return;
      }

      const data = fs.readFileSync(filePath, 'utf-8');
      this.blueprints = JSON.parse(data);
      this.lastLoaded = Date.now();
      console.log(`[VaultManager] Successfully loaded ${this.blueprints.length} Winning Blueprints.`);
    } catch (error) {
      console.error('[VaultManager] Failed to load blueprints:', error);
    }
  }

  /**
   * 모든 Blueprint 목록을 반환합니다. (키워드는 너무 길 수 있으므로 생략 또는 일부 반환 가능하지만 현재는 전체 반환)
   */
  public getAllBlueprints(): Blueprint[] {
    this.loadBlueprints(); // Refresh cache if needed
    return this.blueprints;
  }

  /**
   * 특정 ID의 Blueprint를 반환합니다.
   */
  public getBlueprintById(id: string): Blueprint | null {
    this.loadBlueprints();
    return this.blueprints.find(bp => bp.id === id) || null;
  }

  /**
   * 특정 Blueprint의 Keyword Vault(풀)를 반환합니다.
   */
  public getVaultKeywords(id: string): string[] {
    const bp = this.getBlueprintById(id);
    return bp ? bp.keywords : [];
  }
}
