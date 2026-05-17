import { MazaLogger } from '../lib/logger.js';
import * as Sentry from '@sentry/node';
/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || '서버 내부 오류가 발생했습니다.';
    // Extract useful context for logging
    const context = {
        method: req.method,
        url: req.url,
        status,
        requestId: req.headers['x-request-id'] || 'unknown',
        user: req.user?.id,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    };
    // Log the error
    if (status >= 500) {
        MazaLogger.error({ msg: `[Unhandled Error] ${message}`, err, ...context });
        // Report to Sentry if configured
        if (process.env.SENTRY_DSN) {
            Sentry.captureException(err);
        }
    }
    else {
        MazaLogger.warn({ msg: `[Client Error] ${message}`, ...context });
    }
    // Final JSON response
    res.status(status).json({
        success: false,
        error: message,
        code: err.code || 'INTERNAL_ERROR',
        traceId: context.requestId
    });
};
