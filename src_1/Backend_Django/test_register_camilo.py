import json, urllib.request, urllib.error
url='http://127.0.0.1:8000/api/register/'
payload={'email':'camilopalacio@gmail.com','nombre':'Camilo Palacio','password':'camilopalacio','divisa_pref':'COP'}
req=urllib.request.Request(url,data=json.dumps(payload).encode('utf-8'),headers={'Content-Type':'application/json'})
try:
    with urllib.request.urlopen(req,timeout=10) as resp:
        print('HTTP',resp.status)
        print(resp.read().decode())
except urllib.error.HTTPError as e:
    print('HTTP Error',e.code)
    try:
        print(e.read().decode())
    except:
        pass
except Exception as e:
    print('Error',e)
