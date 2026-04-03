import urllib.request, json
import re

data = json.dumps({'email':'test10@test.com','password':'Test@123','full_name':'Test Us','role':'USER'}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/auth/register/', data=data, headers={'Content-Type': 'application/json', 'Accept': 'application/json'})
try:
    urllib.request.urlopen(req)
except Exception as e:
    html = e.read().decode()
    match = re.search(r'<title>(.*?)</title>', html)
    print("Title:", match.group(1) if match else "No Title")
    match2 = re.search(r'Exception Value:\s*</th[^>]*>\s*<td[^>]*><pre[^>]*>(.*?)</pre>', html, re.DOTALL | re.IGNORECASE)
    print("Exception Value:", match2.group(1).strip() if match2 else "Not found")
    match3 = re.search(r'Exception Type:\s*</th[^>]*>\s*<td[^>]*>(.*?)</td>', html, re.DOTALL | re.IGNORECASE)
    print("Exception Type:", match3.group(1).strip() if match3 else "Not found")
