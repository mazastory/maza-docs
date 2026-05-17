
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
  console.log('🧹 Cleaning up active tasks...');
  const { data, error } = await supabase
    .from('ms_scheduled_posts')
    .update({ 
      status: 'dead', 
      last_error: 'Emergency cleanup: stopped by admin to save API quota' 
    })
    .in('status', ['queued', 'generating', 'pending']);

  if (error) {
    console.error('❌ Cleanup failed:', error);
  } else {
    console.log('✅ Successfully marked all active tasks as DEAD. AI calls will stop now.');
  }
}

cleanup();
