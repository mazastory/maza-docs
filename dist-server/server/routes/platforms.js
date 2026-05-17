import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';
import { WordPressAPI } from '../lib/platforms/wordpress.js';
import { BloggerAPI } from '../lib/platforms/blogger.js';
const router = express.Router();
/**
 * POST /api/platforms/wordpress/verify
 * 워드프레스 계정 정보를 검증하고, 유효하면 DB에 저장합니다.
 */
router.post('/wordpress/verify', requireAuth, async (req, res) => {
    try {
        const { siteId, siteUrl, wpUsername, wpAppPassword } = req.body;
        if (!siteId || !siteUrl || !wpUsername || !wpAppPassword) {
            return res.status(400).json({ error: "모든 워드프레스 정보를 입력해주세요." });
        }
        // 검증 로직
        const verification = await WordPressAPI.verifyConnection(siteUrl, wpUsername, wpAppPassword);
        if (!verification.ok) {
            return res.status(401).json({ error: verification.error || "워드프레스 인증에 실패했습니다." });
        }
        // 성공 시 DB에 업데이트
        if (supabaseAdmin) {
            // 기존 사이트 조회
            const { data: site } = await supabaseAdmin.from('ms_sites').select('metadata').eq('id', siteId).single();
            const currentMetadata = site?.metadata || {};
            const { error: updateError } = await supabaseAdmin.from('ms_sites').update({
                platform: 'wordpress',
                domain: siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
                blog_name: verification.blog_name || siteUrl,
                metadata: {
                    ...currentMetadata,
                    wp_username: wpUsername,
                    wp_app_password: wpAppPassword
                }
            }).eq('id', siteId);
            if (updateError)
                throw updateError;
        }
        res.json({ success: true, blog_name: verification.blog_name });
    }
    catch (error) {
        console.error('[Platforms Route] WordPress verify error:', error);
        res.status(500).json({ error: error.message || "워드프레스 연동 중 오류가 발생했습니다." });
    }
});
/**
 * POST /api/platforms/blogger/list
 * 구글 계정에 연동된 블로그스팟 목록을 가져옵니다.
 */
router.post('/blogger/list', requireAuth, async (req, res) => {
    try {
        const { providerToken } = req.body;
        if (!providerToken) {
            return res.status(401).json({ error: "Google 권한 토큰이 필요합니다." });
        }
        const result = await BloggerAPI.listBlogs(providerToken);
        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }
        res.json({ success: true, blogs: result.blogs });
    }
    catch (error) {
        console.error('[Platforms Route] Blogger list error:', error);
        res.status(500).json({ error: error.message || "블로그스팟 목록 조회 중 오류가 발생했습니다." });
    }
});
/**
 * POST /api/platforms/blogger/save
 * 선택한 블로그스팟 정보를 DB에 저장합니다.
 */
router.post('/blogger/save', requireAuth, async (req, res) => {
    try {
        const { siteId, providerToken, blogId, blogUrl, blogName } = req.body;
        if (!siteId || !providerToken || !blogId || !blogUrl) {
            return res.status(400).json({ error: "필수 정보가 누락되었습니다." });
        }
        if (supabaseAdmin) {
            const { data: site } = await supabaseAdmin.from('ms_sites').select('metadata').eq('id', siteId).single();
            const currentMetadata = site?.metadata || {};
            const { error: updateError } = await supabaseAdmin.from('ms_sites').update({
                platform: 'blogspot',
                domain: blogUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
                blog_name: blogName || blogUrl,
                metadata: {
                    ...currentMetadata,
                    blogger_access_token: providerToken,
                    blogger_blog_id: blogId
                }
            }).eq('id', siteId);
            if (updateError)
                throw updateError;
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('[Platforms Route] Blogger save error:', error);
        res.status(500).json({ error: error.message || "블로그스팟 저장 중 오류가 발생했습니다." });
    }
});
/**
 * POST /api/platforms/publish-post
 * 특정 포스트를 즉시 발행합니다 (W-05 수동 우회).
 */
router.post('/publish-post', requireAuth, async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.userId;
        if (!postId) {
            return res.status(400).json({ error: "postId가 필요합니다." });
        }
        if (!supabaseAdmin) {
            return res.status(503).json({ error: "데이터베이스 연결에 실패했습니다." });
        }
        // 1. 포스트 및 사이트 정보 가져오기
        const { data: post, error: postError } = await supabaseAdmin
            .from('ms_posts')
            .select('*, ms_sites(*)')
            .eq('id', postId)
            .eq('user_id', userId)
            .single();
        if (postError || !post) {
            return res.status(404).json({ error: "포스트를 찾을 수 없습니다." });
        }
        const site = post.ms_sites;
        if (!site) {
            return res.status(404).json({ error: "연동된 사이트가 없습니다." });
        }
        // 2. 플랫폼별 발행 분기
        if (site.platform === 'wordpress') {
            const { wp_username, wp_app_password } = site.metadata || {};
            if (!wp_username || !wp_app_password) {
                return res.status(400).json({ error: "워드프레스 연동 정보가 올바르지 않습니다." });
            }
            const result = await WordPressAPI.post(site.domain, wp_username, wp_app_password, {
                title: post.title,
                content: post.html_content || post.content,
                status: 'publish'
            });
            if (!result.success) {
                return res.status(500).json({ error: result.error || "워드프레스 API 오류가 발생했습니다." });
            }
            // 상태 업데이트
            await supabaseAdmin.from('ms_posts').update({
                status: 'published',
                published_url: result.wp_post_url
            }).eq('id', postId);
            return res.json({ success: true, url: result.wp_post_url });
        }
        else if (site.platform === 'blogspot') {
            const { blogger_access_token, blogger_blog_id } = site.metadata || {};
            if (!blogger_access_token || !blogger_blog_id) {
                return res.status(400).json({ error: "블로그스팟 연동 정보가 올바르지 않습니다." });
            }
            const result = await BloggerAPI.post(blogger_blog_id, blogger_access_token, {
                title: post.title,
                content: post.html_content || post.content
            });
            if (!result.success) {
                return res.status(500).json({ error: result.error || "블로그스팟 API 오류가 발생했습니다." });
            }
            // 상태 업데이트
            await supabaseAdmin.from('ms_posts').update({
                status: 'published',
                published_url: result.post_url
            }).eq('id', postId);
            return res.json({ success: true, url: result.post_url });
        }
        else if (site.platform === 'tistory') {
            // 티스토리: 대기 상태로 변경 후 소켓 전송
            await supabaseAdmin.from('ms_posts').update({
                status: 'ready_to_publish'
            }).eq('id', postId);
            // 소켓 알림
            const { sendToUser } = await import('../lib/websocketServer.js');
            const { SERVER_EVENTS } = await import('../shared/protocol.js');
            const sent = sendToUser(userId, {
                type: SERVER_EVENTS.RUN_ACTION,
                action: 'PUBLISH_POST',
                data: {
                    postId,
                    url: `https://${site.domain}/manage/post/write`,
                    title: post.title,
                    html: post.html_content || post.content
                }
            });
            return res.json({
                success: true,
                tistory: true,
                message: sent > 0
                    ? "익스텐션으로 발행 명령을 즉시 보냈습니다!"
                    : "익스텐션이 연결되어 있지 않습니다. 익스텐션 연결 시 자동으로 주입됩니다."
            });
        }
        res.status(400).json({ error: "지원하지 않는 블로그 플랫폼입니다." });
    }
    catch (error) {
        console.error("[Platforms Route] Manual publish error:", error);
        res.status(500).json({ error: error.message || "발행 처리 중 오류가 발생했습니다." });
    }
});
export default router;
