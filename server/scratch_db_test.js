import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function test() {
  const statuses = ['queued', 'processing', 'retrying', 'waiting_external', 'waiting_publish', 'pending', 'generating', 'validating'];
  for (const status of statuses) {
    const { data, error } = await supabaseAdmin.from('ms_scheduled_posts').insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      site_id: '00000000-0000-0000-0000-000000000000',
      post_id: '00000000-0000-0000-0000-000000000000',
      publish_at: new Date().toISOString(),
      status: status
    }).select();
    if (error) {
      console.log(`Status '${status}' failed:`, error.message);
    } else {
      console.log(`Status '${status}' succeeded!`);
      await supabaseAdmin.from('ms_scheduled_posts').delete().eq('id', data[0].id);
    }
  }
}
test();
