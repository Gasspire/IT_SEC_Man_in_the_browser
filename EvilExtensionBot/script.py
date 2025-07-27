import requests


bank_token = ""
ext_token = ""


bank_path = "/bank"
ext_path = "/evilbot"

URL_bank = "https://api.telegram.org/bot"+bank_token+"/setWebhook"
URL_ext = "https://api.telegram.org/bot"+ext_token+"/setWebhook"

url_serve = "https://5a7b-79-50-220-69.ngrok-free.app"


PARAMS = {'url': url_serve+bank_path} 

r = requests.get(url = URL_bank,params= PARAMS)
data = r.json()
print(data)

PARAMS = {'url': url_serve+ext_path} 

r = requests.get(url = URL_ext,params= PARAMS)
data = r.json()
print(data)
