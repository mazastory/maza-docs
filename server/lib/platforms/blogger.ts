/**
 * =============================================
 * 🟧 Blogger (Blogspot) API Publisher
 * =============================================
 */
import { google } from "googleapis";

export interface BloggerPublishResult {
  success: boolean;
  post_id?: string;
  post_url?: string;
  error?: string;
}

export interface BloggerPostPayload {
  title: string;
  content: string; // HTML
  isDraft?: boolean;
  labels?: string[];
}

export class BloggerAPI {
  private static getAuthClient(providerToken: string) {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.APP_URL || 'https://mazastudio.kr'}/auth/callback`
    );
    auth.setCredentials({ access_token: providerToken });
    return auth;
  }

  /**
   * 사용자의 블로그스팟 목록을 가져옵니다.
   */
  static async listBlogs(providerToken: string) {
    try {
      const auth = this.getAuthClient(providerToken);
      const blogger = google.blogger({ version: 'v3', auth });
      
      const res = await blogger.blogs.listByUser({ userId: 'self' });
      return { success: true, blogs: res.data.items || [] };
    } catch(err: unknown) {
      console.error("[BloggerAPI] Error listing blogs:", err.message);
      return { success: false, error: `Blogger 목록 조회 실패: ${err.message}` };
    }
  }

  /**
   * 블로그스팟에 새로운 글을 발행합니다.
   */
  static async post(
    blogId: string,
    providerToken: string,
    post: BloggerPostPayload
  ): Promise<BloggerPublishResult> {
    try {
      if (!blogId || !providerToken) {
        return { success: false, error: "블로그 ID 또는 인증 토큰이 누락되었습니다." };
      }

      const auth = this.getAuthClient(providerToken);
      const blogger = google.blogger({ version: 'v3', auth });

      const res = await blogger.posts.insert({
        blogId,
        isDraft: post.isDraft ?? false,
        requestBody: {
          title: post.title,
          content: post.content,
          labels: post.labels || []
        }
      });

      return {
        success: true,
        post_id: res.data.id || undefined,
        post_url: res.data.url || undefined
      };
    } catch(err: unknown) {
      console.error("[BloggerAPI] Post insertion error:", err.message);
      return { success: false, error: `Blogger 글쓰기 오류: ${err.message}` };
    }
  }
}
