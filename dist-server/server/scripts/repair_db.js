import { supabaseAdmin } from '../lib/supabaseServer.js';
async function repair() {
    console.log('🚀 Starting Database Repair...');
    // 1. Create ms_autopilot_status table if not exists
    // Note: We use rpc() or raw query if possible, but since we are using supabase-js client
    // we might need to rely on the fact that the table SHOULD exist.
    // If we can't run DDL, we at least check if we can access it.
    const { data, error } = await supabaseAdmin
        .from('ms_autopilot_status')
        .select('count')
        .limit(1);
    if (error) {
        console.error('❌ Table access error:', error.message);
        if (error.message.includes('not find the table')) {
            console.log('💡 Suggestion: Please run the following SQL in your Supabase SQL Editor:');
            console.log(`
        CREATE TABLE IF NOT EXISTS public.ms_autopilot_status (
          user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          active_job_id text,
          status text DEFAULT 'IDLE',
          progress integer DEFAULT 0,
          current_task text,
          metadata jsonb DEFAULT '{}'::jsonb,
          updated_at timestamp with time zone DEFAULT now()
        );

        -- Enable Realtime
        ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_autopilot_status;

        -- RLS Policies
        ALTER TABLE public.ms_autopilot_status ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view their own status" ON public.ms_autopilot_status FOR SELECT USING (auth.uid() = user_id);
      `);
        }
    }
    else {
        console.log('✅ ms_autopilot_status table is accessible.');
    }
    process.exit(0);
}
repair();
