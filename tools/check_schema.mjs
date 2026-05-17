import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  console.log("Checking profiles table schema...");
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Error fetching from profiles:", error);
  } else if (data && data.length > 0) {
    console.log("Available columns in 'profiles':", Object.keys(data[0]));
  } else {
    console.log("No data in profiles table to check schema.");
    
    // Try a different way if no data
    const { data: columns, error: colError } = await supabase
      .rpc('get_table_columns', { table_name: 'profiles' });
    
    if (colError) {
      console.log("RPC get_table_columns not available or failed.");
    } else {
      console.log("Columns via RPC:", columns);
    }
  }
}

checkSchema();
