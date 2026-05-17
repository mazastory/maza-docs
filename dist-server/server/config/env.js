import { cleanEnv, str, url } from 'envalid';
import dotenv from 'dotenv';
import path from 'path';
// .env 로드 시도 (개발 환경용)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
export const env = cleanEnv(process.env, {
    // Supabase
    VITE_SUPABASE_URL: url({ desc: 'Supabase 프로젝트 URL' }),
    SUPABASE_SERVICE_ROLE_KEY: str({ desc: 'Supabase Service Role Key (서버 전용)' }),
    VITE_SUPABASE_ANON_KEY: str({ desc: 'Supabase Anon Key', default: '' }),
    // Redis
    REDIS_URL: url({ desc: 'Redis 연결 URL' }),
    // AI API Keys
    GEMINI_API_KEY: str({ desc: 'Gemini API Key (다중 키의 경우 쉼표로 구분)' }),
    // App
    PORT: str({ default: '3001', desc: '서버 포트 번호' }),
    NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
});
