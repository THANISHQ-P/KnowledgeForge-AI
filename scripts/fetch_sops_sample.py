import pathlib
import json
import urllib.request
import urllib.error

p = pathlib.Path('frontend/.env.local')
if not p.exists():
    raise SystemExit('Missing frontend/.env.local')
text = p.read_text()
env = {}
for line in text.splitlines():
    line = line.strip()
    if not line or line.startswith('#') or '=' not in line:
        continue
    key, value = line.split('=', 1)
    env[key.strip()] = value.strip().strip('"')

url = env.get('VITE_SUPABASE_URL')
key = env.get('VITE_SUPABASE_ANON_KEY')
if not url or not key:
    raise SystemExit('Missing Supabase env vars')

endpoint = url.rstrip('/') + '/rest/v1/sops?select=*&limit=1'
req = urllib.request.Request(endpoint, headers={
    'apikey': key,
    'Authorization': f'Bearer {key}',
    'Accept': 'application/json'
})
try:
    with urllib.request.urlopen(req, timeout=20) as resp:
        body = resp.read().decode('utf-8')
        print('status', resp.status)
        print(body)
except urllib.error.HTTPError as e:
    print('HTTP', e.code, e.reason)
    print(e.read().decode('utf-8'))
except Exception as e:
    print('ERR', type(e).__name__, e)
