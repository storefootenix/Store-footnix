import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function main() {
  const jsonStr = JSON.stringify([{ id: 'test' }]);
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload('test_config.json', jsonStr, {
      contentType: 'application/json',
      upsert: true
    });
  console.log('Upload:', error || data);
  
  const { data: dlData, error: dlError } = await supabase.storage
    .from('product-images')
    .download('test_config.json');
  if (dlData) {
    console.log('Download:', await dlData.text());
  } else {
    console.log('Download Error:', dlError);
  }
}

main().catch(console.error);
