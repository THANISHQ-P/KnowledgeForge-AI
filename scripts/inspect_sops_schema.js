const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '../frontend/.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Missing frontend/.env.local');
  process.exit(1);
}

const env = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).reduce((acc, line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return acc;
  const [key, value] = line.split('=');
  acc[key.trim()] = value.trim().replace(/^"|"$/g, '');
  return acc;
}, {});

if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

(async () => {
  const { data, error } = await supabase
    .from('information_schema.columns')
    .select('column_name,data_type,character_maximum_length')
    .eq('table_name', 'sops');

  if (error) {
    console.error('Supabase error:', error);
    process.exit(1);
  }

  console.log(JSON.stringify(data, null, 2));
})();
