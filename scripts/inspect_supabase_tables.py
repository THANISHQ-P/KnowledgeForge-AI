import pathlib
import urllib.request
import urllib.error
import json

p = pathlib.Path('frontend/.env.local')
if not p.exists():
    raise SystemExit('Missing frontend/.env.local')
text = p.read_text()
env = {}
for line in text.splitlines():
    line=line.strip()
    if not line or line.startswith('#') or '=' not in line:
        continue
    key,val = line.split('=',1)
    env[key.strip()] = val.strip().strip('"')

url = env.get('VITE_SUPABASE_URL')
key = env.get('VITE_SUPABASE_ANON_KEY')
if not url or not key:
    raise SystemExit('Missing Supabase env vars')

for table in ['sops', 'knowledge_transfer_requests', 'resignation_requests']:
    endpoint = f"{url.rstrip('/')}/rest/v1/information_schema.columns?table_name=eq.{table}&select=column_name,data_type&order=ordinal_position"
    req = urllib.request.Request(endpoint, headers={
        'apikey': key,
        'Authorization': f'Bearer {key}',
        'Accept': 'application/json'
    })
    print(f'--- {table} ---')
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            print(r.status)
            print(r.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print('HTTP', e.code, e.reason)
        print(e.read().decode('utf-8'))
    except Exception as e:
        print('ERR', type(e).__name__, e)
    print()
