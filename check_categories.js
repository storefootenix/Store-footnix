import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function main() {
  const { data, error } = await supabase.from('categories').select('*').limit(1);
  if (error) {
    console.error('Error fetching categories:', error);
  } else {
    console.log('Categories table exists, data:', data);
  }
}

main().catch(console.error);
