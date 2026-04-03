import urllib.request, json
data = json.dumps({'email':'test12@test.com','password':'Test@123','full_name':'Test Us','role':'USER'}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/auth/register/', data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        print("Success:", response.read().decode())
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        output = e.read().decode()
        print("Output length:", len(output))
        print("Starts with:", output[:200])
        # Find detail key if json
        try:
            print("JSON ERROR:", json.loads(output))
        except:
            print("Not JSON")
