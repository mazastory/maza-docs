import 'dotenv/config';
import { supabaseAdmin } from '../src/lib/supabase';

async function check() {
  if (!supabaseAdmin) {
    console.error('Supabase Admin not available');
    process.exit(1);
  }

  try {
    // Check scheduled posts
    const { data: scheduled, error: sError } = await supabaseAdmin
      .from('ms_scheduled_posts')
      .select('id, status, publish_at, last_error')
      .order('publish_at', { ascending: false })
      .limit(10);

    if (sError) throw sError;
    console.log('--- Recent Scheduled Posts ---');
    console.table(scheduled);

    // Check topic clusters
    const { data: clusters, error: clError } = await supabaseAdmin
      .from('ms_topic_clusters')
      .select('*')
      .limit(5);

    if (clError) throw clError;
    console.log('\n--- Topic Clusters ---');
    console.table(clusters);

    // Check sites
    const { data: sites, error: siError } = await supabaseAdmin
      .from('ms_sites')
      .select('id, domain, platform')
      .limit(5);

    if (siError) throw siError;
    console.log('\n--- Sites ---');
    console.table(sites);

  } catch (err) {
    console.error('Error checking DB:', (err as Error).message);
  } finally {
    process.exit(0);
  }
}

check();
