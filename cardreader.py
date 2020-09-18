import requests
import json

response = requests.post(
  'http://172.28.31.48:5000',
  headers={'Content-Type': 'application/json'},
  data=json.dumps({"device":"台車Ｂ","status":"move"}),
  #data={"device":"台車Ｂ","status":"move"}
)
print(response.status_code)    # HTTPのステータスコード取得
print(response.text)    # レスポンスのHTMLを文字列で取得
