import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function main() {
  const { data, error } = await supabase.from('store_settings').select('*').limit(1);
  console.log('store_settings columns:', Object.keys(data[0]));
}

main().catch(console.error);
