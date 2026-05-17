import express from "express";
import { google } from "googleapis";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router();
// Helper to get OAuth2 Client
const getOAuth2Client = () => {
    return new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, `${process.env.APP_URL || 'https://mazastudio.kr'}/auth/callback`);
};
/**
 * POST /api/google/setup-ga4
 * Creates a GA4 property and returns Measurement ID
 */
router.post("/setup-ga4", requireAuth, async (req, res) => {
    try {
        const { domain, providerToken } = req.body;
        if (!domain)
            return res.status(400).json({ error: "도메인 주소가 필요합니다." });
        if (!providerToken)
            return res.status(401).json({ error: "Google 권한 토큰이 필요합니다." });
        const auth = getOAuth2Client();
        auth.setCredentials({ access_token: providerToken });
        const analyticsAdmin = google.analyticsadmin({ version: 'v1alpha', auth });
        // 1. List Accounts
        const { data: { accounts } } = await analyticsAdmin.accounts.list();
        if (!accounts || accounts.length === 0) {
            return res.status(404).json({ error: "구글 애널리틱스 계정을 찾을 수 없습니다. 먼저 애널리틱스(analytics.google.com)에 가입해주세요." });
        }
        // Use the first account
        const accountId = accounts[0].name; // format: "accounts/123"
        // 2. Create Property
        const { data: property } = await analyticsAdmin.properties.create({
            requestBody: {
                parent: accountId,
                displayName: `${domain} (MAZA Story)`,
                timeZone: 'Asia/Seoul',
                currencyCode: 'KRW',
            }
        });
        if (!property || !property.name)
            throw new Error("GA4 속성 생성에 실패했습니다.");
        // 3. Create Data Stream (Web)
        const { data: stream } = await analyticsAdmin.properties.dataStreams.create({
            parent: property.name,
            requestBody: {
                type: 'WEB_DATA_STREAM',
                displayName: 'Web Stream',
                webStreamData: {
                    defaultUri: `https://${domain}`
                }
            }
        });
        res.json({
            success: true,
            propertyId: property.name.split('/')[1],
            measurementId: stream.webStreamData?.measurementId,
            propertyName: property.displayName
        });
    }
    catch (err) {
        console.error("[Google API] GA4 Setup Error:", err);
        res.status(500).json({ error: err.message || "GA4 자동 생성 중 오류가 발생했습니다." });
    }
});
/**
 * POST /api/google/setup-search-console
 * Adds site to Search Console and returns verification token
 */
router.post("/setup-search-console", requireAuth, async (req, res) => {
    try {
        const { domain, providerToken } = req.body;
        if (!domain)
            return res.status(400).json({ error: "도메인 주소가 필요합니다." });
        if (!providerToken)
            return res.status(401).json({ error: "Google 권한 토큰이 필요합니다." });
        const auth = getOAuth2Client();
        auth.setCredentials({ access_token: providerToken });
        const searchConsole = google.searchconsole({ version: 'v1', auth });
        // @ts-ignore - Google APIs typing can be tricky for siteVerification
        const siteVerification = google.siteVerification({ version: 'v1', auth });
        const siteUrl = `https://${domain}/`;
        // 1. Add site to Search Console
        try {
            await searchConsole.sites.add({ siteUrl });
        }
        catch (e) {
            console.warn("[Google API] Site might already exist in SC:", domain);
        }
        // 2. Get Verification Token (Meta Tag)
        const { data: tokenData } = await siteVerification.webResource.getToken({
            requestBody: {
                site: {
                    identifier: siteUrl,
                    type: 'SITE'
                },
                verificationMethod: 'META'
            }
        });
        res.json({
            success: true,
            verificationToken: tokenData.token,
            siteUrl
        });
    }
    catch (err) {
        console.error("[Google API] Search Console Setup Error:", err);
        res.status(500).json({ error: err.message || "서치콘솔 등록 중 오류가 발생했습니다." });
    }
});
/**
 * POST /api/google/verify-site
 */
router.post("/verify-site", requireAuth, async (req, res) => {
    try {
        const { domain, providerToken } = req.body;
        if (!domain)
            return res.status(400).json({ error: "도메인 주소가 필요합니다." });
        if (!providerToken)
            return res.status(401).json({ error: "Google 권한 토큰이 필요합니다." });
        const auth = getOAuth2Client();
        auth.setCredentials({ access_token: providerToken });
        // @ts-ignore
        const siteVerification = google.siteVerification({ version: 'v1', auth });
        const { data: result } = await siteVerification.webResource.insert({
            verificationMethod: 'META',
            requestBody: {
                site: {
                    identifier: `https://${domain}/`,
                    type: 'SITE'
                }
            }
        });
        res.json({
            success: true,
            result
        });
    }
    catch (err) {
        console.error("[Google API] Verification Error:", err);
        res.status(500).json({ error: err.message || "소유권 확인 중 오류가 발생했습니다." });
    }
});
/**
 * POST /api/google/submit-sitemap
 * Submits sitemap and RSS to Search Console
 */
router.post("/submit-sitemap", requireAuth, async (req, res) => {
    try {
        const { domain, providerToken, rssPath } = req.body;
        if (!domain)
            return res.status(400).json({ error: "도메인 주소가 필요합니다." });
        if (!providerToken)
            return res.status(401).json({ error: "Google 권한 토큰이 필요합니다." });
        const auth = getOAuth2Client();
        auth.setCredentials({ access_token: providerToken });
        const searchConsole = google.searchconsole({ version: 'v1', auth });
        const siteUrl = `https://${domain}/`;
        // 1. Submit sitemap.xml
        await searchConsole.sitemaps.submit({
            siteUrl,
            feedpath: `${siteUrl}sitemap.xml`
        });
        // 2. Submit RSS feed (clean up path to prevent domain duplication)
        let finalRssPath = rssPath || 'rss';
        // If user mistakenly sent full domain/rss, extract only the part after domain
        if (finalRssPath.includes(domain)) {
            finalRssPath = finalRssPath.split(domain).pop()?.replace(/^\/+/, '') || 'rss';
        }
        try {
            await searchConsole.sitemaps.submit({
                siteUrl,
                feedpath: finalRssPath.startsWith('http') ? finalRssPath : `${siteUrl}${finalRssPath.replace(/^\/+/, '')}`
            });
        }
        catch (e) {
            console.warn("[Google API] RSS submit failed:", e);
        }
        res.json({
            success: true,
            message: "사이트맵 및 RSS 제출이 완료되었습니다."
        });
    }
    catch (err) {
        console.error("[Google API] Sitemap Submission Error:", err);
        res.status(500).json({ error: err.message || "사이트맵 제출 중 오류가 발생했습니다." });
    }
});
/**
 * GET /api/google/sitemap-status
 * Checks the status of submitted sitemaps
 */
router.get("/sitemap-status", requireAuth, async (req, res) => {
    try {
        const { domain, providerToken } = req.query;
        if (!domain)
            return res.status(400).json({ error: "도메인 주소가 필요합니다." });
        if (!providerToken)
            return res.status(401).json({ error: "Google 권한 토큰이 필요합니다." });
        const auth = getOAuth2Client();
        auth.setCredentials({ access_token: providerToken });
        const searchConsole = google.searchconsole({ version: 'v1', auth });
        const siteUrl = `https://${domain}/`;
        const { data: sitemaps } = await searchConsole.sitemaps.list({ siteUrl });
        res.json({
            success: true,
            sitemaps: sitemaps.sitemap || []
        });
    }
    catch (err) {
        console.error("[Google API] Sitemap Status Check Error:", err);
        res.status(500).json({ error: err.message || "상태 조회 중 오류가 발생했습니다." });
    }
});
export default router;
