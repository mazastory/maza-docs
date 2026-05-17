
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("[MAZA] Missing environment variables.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function destroyTasks() {
  console.log("[MAZA] DESTROYING all pending scheduled posts...");
  const { data, error } = await supabaseAdmin
    .from('ms_scheduled_posts')
    .delete()
    .in('status', ['QUEUED', 'GENERATING', 'VALIDATING', 'PUBLISHING', 'FAILED']);

  if (error) {
    console.error("[MAZA] Error destroying tasks:", error);
  } else {
    console.log("[MAZA] All pending tasks PERMANENTLY DELETED from DB.");
  }
  process.exit(0);
}

destroyTasks();
