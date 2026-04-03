import urllib.request, json
data = json.dumps({'email':'test8@test.com','password':'Test@123','full_name':'Test Us','role':'USER'}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/auth/register/', data=data, headers={'Content-Type': 'application/json', 'Accept': 'application/json'})
try:
    urllib.request.urlopen(req)
except Exception as e:
    print(e.read().decode())
