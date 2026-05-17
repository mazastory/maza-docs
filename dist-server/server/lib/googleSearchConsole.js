/**
 * =============================================
 * MAZA Studio - Google Search Console API Wrapper
 * AGENTS.md: Data Feedback Loop (L-02)
 * =============================================
 */
import { google } from 'googleapis';
import { MazaLogger } from './logger.js';
export class GoogleSearchConsole {
    /**
     * 최근 성과 데이터 가져오기 (Clicks, Impressions, CTR, Position)
     */
    static async getRecentStats(siteUrl, accessToken) {
        try {
            const auth = new google.auth.OAuth2();
            auth.setCredentials({ access_token: accessToken });
            const searchconsole = google.searchconsole({ version: 'v1', auth });
            const res = await searchconsole.searchanalytics.query({
                siteUrl,
                requestBody: {
                    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 최근 30일
                    endDate: new Date().toISOString().split('T')[0],
                    dimensions: ['page'],
                    rowLimit: 1000
                }
            });
            return res.data.rows || [];
        }
        catch (e) {
            MazaLogger.error(`[GSC] Failed to fetch stats for ${siteUrl}`, e);
            throw e;
        }
    }
    /**
     * 색인 상태 확인 (URL Inspection API)
     */
    static async checkIndexStatus(siteUrl, inspectionUrl, accessToken) {
        try {
            const auth = new google.auth.OAuth2();
            auth.setCredentials({ access_token: accessToken });
            const searchconsole = google.searchconsole({ version: 'v1', auth });
            const res = await searchconsole.urlInspection.index.inspect({
                requestBody: {
                    inspectionUrl,
                    siteUrl
                }
            });
            return res.data.inspectionResult?.indexStatusResult?.verdict === 'PASS';
        }
        catch (e) {
            MazaLogger.error(`[GSC] Index check failed for ${inspectionUrl}`, e);
            return false;
        }
    }
}
