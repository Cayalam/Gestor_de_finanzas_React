import urllib.request, urllib.error, json, time

base = 'http://localhost:8000'
API = base + '/api'
headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}

def do(method, path, data=None, headers_override=None):
    url = API + path
    b = None
    if data is not None:
        b = json.dumps(data).encode('utf-8')
    hdrs = headers.copy()
    if headers_override:
        hdrs.update(headers_override)
    req = urllib.request.Request(url, data=b, method=method, headers=hdrs)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode('utf-8')
            try:
                obj = json.loads(body)
                print(json.dumps({'status': resp.getcode(), 'body': obj}, ensure_ascii=False, indent=2))
            except Exception:
                print({'status': resp.getcode(), 'body': body})
    except urllib.error.HTTPError as e:
        try:
            err = e.read().decode('utf-8')
        except:
            err = ''
        print({'status': e.code, 'error': err})
    except Exception as e:
        print({'error': str(e)})


ts = int(time.time())
email = f'autotest+{ts}@example.com'
print('Registering test user:', email)
reg = None
try:
    reg_payload = {'email': email, 'nombre': 'AutoTest', 'password': 'pass1234', 'divisa_pref': 'COP'}
    do('POST', '/register/', reg_payload)
except Exception as e:
    print('Register error', e)

# Try to obtain token by calling /api/register/ and parsing response directly
def obtain_token():
    url = base + '/api/register/'
    data = json.dumps({'email': email, 'nombre': 'AutoTest', 'password': 'pass1234', 'divisa_pref': 'COP'}).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST', headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode('utf-8')
            return json.loads(body).get('token')
    except Exception as e:
        print('obtain_token error', e)
        return None

token = obtain_token()
if not token:
    print('No token obtained; aborting authenticated tests')
else:
    auth_hdr = {'Authorization': f'Token {token}'}
    print('\nGET /api/bolsillos/')
    do('GET', '/bolsillos/', headers_override=auth_hdr)

    print('\nPOST /api/bolsillos/')
    do('POST', '/bolsillos/', {'nombre':'Prueba script','saldo':42.5,'color':'#06b6d4'}, headers_override=auth_hdr)

    print('\nGET /api/categorias/')
    do('GET', '/categorias/', headers_override=auth_hdr)

    print('\nPOST /api/categorias/')
    do('POST', '/categorias/', {'nombre':'Cat prueba script','tipo':'ing','color':'#f59e0b'}, headers_override=auth_hdr)
