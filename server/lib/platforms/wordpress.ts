/**
 * =============================================
 * 🟦 WordPress REST API Publisher (MazaStory)
 * =============================================
 */

export interface WpPublishResult {
  success: boolean;
  wp_post_id?: number;
  wp_post_url?: string;
  error?: string;
}

export interface WpPostPayload {
  title: string;
  content: string; // HTML
  status: "publish" | "draft";
  categories?: number[];
  tags?: number[];
  excerpt?: string;
}

export class WordPressAPI {
  /**
   * Publish a post to a WordPress site via WP REST API.
   * Uses HTTP Basic Auth with Application Password.
   */
  static async post(
    siteUrl: string,
    wpUsername: string,
    wpAppPassword: string,
    post: WpPostPayload
  ): Promise<WpPublishResult> {
    if (!siteUrl || !wpUsername || !wpAppPassword) {
      return { success: false, error: "워드프레스 계정 정보가 누락되었습니다." };
    }

    // Normalize URL
    const baseUrl = siteUrl.replace(/\/+$/, "").replace(/^(?!https?:\/\/)/, "https://");
    const apiUrl = `${baseUrl}/wp-json/wp/v2/posts`;

    // HTTP Basic Auth with Application Password
    const credentials = Buffer.from(`${wpUsername}:${wpAppPassword}`).toString("base64");

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${credentials}`,
          "User-Agent": "MazaStory/1.0"
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          status: post.status || "draft",
          excerpt: post.excerpt || "",
          ...(post.categories?.length ? { categories: post.categories } : {}),
          ...(post.tags?.length ? { tags: post.tags } : {})
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[WP Publisher] API error ${response.status}: ${errorBody.slice(0, 200)}`);
        return { success: false, error: `WordPress API 오류 (${response.status})` };
      }

      const data = await response.json() as any;
      return {
        success: true,
        wp_post_id: data.id,
        wp_post_url: data.link
      };

    } catch(err: unknown) {
      console.error("[WP Publisher] Network error:", err.message);
      return { success: false, error: `네트워크 오류: ${err.message}` };
    }
  }

  /**
   * Verify connection and credentials.
   */
  static async verifyConnection(
    siteUrl: string,
    wpUsername: string,
    wpAppPassword: string
  ): Promise<{ ok: boolean; blog_name?: string; error?: string }> {
    const baseUrl = siteUrl.replace(/\/+$/, "").replace(/^(?!https?:\/\/)/, "https://");
    const credentials = Buffer.from(`${wpUsername}:${wpAppPassword}`).toString("base64");

    try {
      const authRes = await fetch(`${baseUrl}/wp-json/wp/v2/users/me`, {
        headers: {
          "Authorization": `Basic ${credentials}`,
          "User-Agent": "MazaStory/1.0"
        }
      });

      if (!authRes.ok) {
        return { ok: false, error: "인증 실패: 사용자명과 앱 비밀번호를 확인해 주세요." };
      }

      const infoRes = await fetch(`${baseUrl}/wp-json/`);
      const info = await infoRes.json() as any;

      return { ok: true, blog_name: info.name || siteUrl };

    } catch(err: unknown) {
      return { ok: false, error: `연결 실패: ${err.message}` };
    }
  }
}
