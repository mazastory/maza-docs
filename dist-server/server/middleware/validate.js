import { ZodError } from 'zod';
import { MazaLogger } from '../lib/logger.js';
/**
 * Middleware to validate request body, query, or params using Zod
 * @param schema Zod schema to validate against
 */
export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof ZodError || error.name === 'ZodError') {
                MazaLogger.warn({
                    msg: 'Validation failed',
                    path: req.path,
                    errors: error.errors
                });
                return res.status(400).json({
                    success: false,
                    error: '입력값 검증에 실패했습니다.',
                    details: error.errors?.map((err) => ({
                        path: err.path.join('.'),
                        message: err.message
                    })) || []
                });
            }
            MazaLogger.error({ msg: 'Unexpected validation error', error });
            next(error);
        }
    };
};
