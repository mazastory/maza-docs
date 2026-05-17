
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRecentPosts() {
  const { data, error } = await supabase
    .from('ms_posts')
    .select('id, title, status, created_at, seo_score')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  console.log('\n--- [DB 실시간 검증] 최근 생성된 포스팅 ---');
  if (data.length === 0) {
    console.log('데이터가 없습니다.');
  } else {
    console.table(data);
  }

  const { data: events } = await supabase
    .from('ms_events')
    .select('event_type, metadata, created_at')
    .order('created_at', { ascending: false })
    .limit(3);

  console.log('\n--- [DB 실시간 검증] 최근 시스템 이벤트 ---');
  if (events && events.length > 0) {
    console.table(events.map(e => ({
      type: e.event_type,
      keyword: e.metadata?.keyword || '-',
      time: e.created_at
    })));
  } else {
    console.log('이벤트 로그가 없습니다.');
  }
}

checkRecentPosts();
