const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1];
const supabaseServiceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanup() {
  console.log("Fetching all sites (Service Role)...");
  const { data: sites, error } = await supabase.from('ms_sites').select('*');
  
  if (error) {
    console.error("Error fetching sites:", error);
    return;
  }

  console.log(`Total sites found: ${sites.length}`);
  
  const userGroups = {};
  sites.forEach(s => {
    if (!userGroups[s.user_id]) userGroups[s.user_id] = [];
    userGroups[s.user_id].push(s);
  });

  for (const userId in userGroups) {
    const list = userGroups[userId];
    if (list.length <= 1) {
      console.log(`User ${userId} has ${list.length} site(s). Skipping.`);
      continue;
    }

    console.log(`User ${userId} has ${list.length} sites. Cleaning up...`);
    
    // Sort logic: 
    // 1. domain exists?
    // 2. updated_at desc
    list.sort((a, b) => {
      const aDom = a.domain && a.domain.trim() !== '' ? 1 : 0;
      const bDom = b.domain && b.domain.trim() !== '' ? 1 : 0;
      if (aDom !== bDom) return bDom - aDom;
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

    const toKeep = list[0];
    const toDelete = list.slice(1).map(s => s.id);

    console.log(`  KEEPING: ${toKeep.id} (Domain: ${toKeep.domain || 'N/A'})`);
    console.log(`  DELETING: ${toDelete.length} duplicates.`);

    const { error: delError } = await supabase.from('ms_sites').delete().in('id', toDelete);
    if (delError) console.error("  Delete failed:", delError);
    else console.log("  Cleanup successful for this user.");
  }
}

cleanup().catch(err => console.error("Cleanup crashed:", err));
