/**
 * =============================================
 * MAZA Studio - Structured & Traceable Logger
 * AGENTS.md: Observability Protocol (O-01)
 * =============================================
 */
import pino from 'pino';
import { env } from '../config/env.js';
const isProduction = env.NODE_ENV === 'production';
// Pino logger instance
export const pinoLogger = pino({
    level: isProduction ? 'info' : 'debug',
    transport: !isProduction
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
    base: {
        env: env.NODE_ENV,
    },
});
export class MazaLogger {
    static info(arg1, arg2, arg3) {
        if (typeof arg1 === 'string') {
            if (arg3)
                pinoLogger.info(arg3, arg1);
            else if (arg2)
                pinoLogger.info(arg2, arg1);
            else
                pinoLogger.info(arg1);
        }
        else {
            pinoLogger.info(arg1);
        }
    }
    static warn(arg1, arg2, arg3) {
        if (typeof arg1 === 'string') {
            if (arg3)
                pinoLogger.warn(arg3, arg1);
            else if (arg2)
                pinoLogger.warn(arg2, arg1);
            else
                pinoLogger.warn(arg1);
        }
        else {
            pinoLogger.warn(arg1);
        }
    }
    static error(arg1, arg2, arg3) {
        if (typeof arg1 === 'string') {
            if (arg3)
                pinoLogger.error({ ...arg3, err: arg2 }, arg1);
            else if (arg2)
                pinoLogger.error(arg2, arg1);
            else
                pinoLogger.error(arg1);
        }
        else {
            pinoLogger.error(arg1);
        }
    }
    static debug(arg1, arg2, arg3) {
        if (typeof arg1 === 'string') {
            if (arg3)
                pinoLogger.debug(arg3, arg1);
            else if (arg2)
                pinoLogger.debug(arg2, arg1);
            else
                pinoLogger.debug(arg1);
        }
        else {
            pinoLogger.debug(arg1);
        }
    }
}
