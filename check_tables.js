import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const url = process.env.SUPABASE_URL + '/rest/v1/';
  const res = await fetch(url, {
    headers: {
      'apikey': process.env.SUPABASE_ANON_KEY
    }
  });
  const data = await res.json();
  console.log(Object.keys(data.paths).filter(p => p !== '/'));
}

main().catch(console.error);
