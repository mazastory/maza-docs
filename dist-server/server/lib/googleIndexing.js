import { google } from 'googleapis';
import { MazaLogger } from './logger.js';
/**
 * MazaStudio - Google Indexing API Service
 * [Phase 3] Automatically request indexing for new posts to speed up traffic acquisition.
 */
export class GoogleIndexingService {
    /**
     * Request URL indexing (URL_UPDATED or URL_DELETED)
     */
    static async requestIndexing(url, type = 'URL_UPDATED') {
        if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            MazaLogger.warn('[Indexing] ⚠️ Google Service Account credentials missing. Skipping auto-index.');
            return null;
        }
        try {
            MazaLogger.info(`[Indexing] 🚀 Requesting ${type} for: ${url}`);
            const indexing = google.indexing({
                version: 'v3',
                auth: this.auth
            });
            const res = await indexing.urlNotifications.publish({
                requestBody: {
                    url: url,
                    type: type
                }
            });
            MazaLogger.info(`[Indexing] ✅ Successfully submitted: ${url}`, res.data);
            return res.data;
        }
        catch (error) {
            MazaLogger.error(`[Indexing] ❌ Failed to submit URL: ${url}`, error);
            // Don't throw to prevent breaking the publish flow, just log it
            return null;
        }
    }
    /**
     * Get current notification status for a URL
     */
    static async getStatus(url) {
        try {
            const indexing = google.indexing({
                version: 'v3',
                auth: this.auth
            });
            const res = await indexing.urlNotifications.getMetadata({
                url: url
            });
            return res.data;
        }
        catch (error) {
            MazaLogger.error(`[Indexing] ❌ Failed to get status for URL: ${url}`, error);
            return null;
        }
    }
}
GoogleIndexingService.auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/indexing']
});
