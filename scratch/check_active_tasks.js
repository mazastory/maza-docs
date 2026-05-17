
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL or Key missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPendingTasks() {
  console.log('🔍 Checking pending tasks in ms_scheduled_posts...');
  const { data, error } = await supabase
    .from('ms_scheduled_posts')
    .select('id, keyword, status, publish_at, created_at')
    .in('status', ['queued', 'generating', 'pending'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching tasks:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('✅ No pending or queued tasks found.');
  } else {
    console.log(`📡 Found ${data.length} active tasks:`);
    console.table(data);
    console.log('\n💡 이 작업들이 현재 API를 호출하고 있는 원인입니다.');
  }
}

checkPendingTasks();
