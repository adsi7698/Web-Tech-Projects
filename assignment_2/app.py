import base64
import requests
import urllib.parse

from flask import Flask, request, send_from_directory


app = Flask(__name__)


class OAuthToken:
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret

    def getBase64Encoding(self):
        sample_string = f"{self.client_id}:{self.client_secret}"
        sample_string_bytes = sample_string.encode("ascii")

        base64_bytes = base64.b64encode(sample_string_bytes)
        base64_string = base64_bytes.decode("ascii")

        return base64_string

    def getApplicationToken(self):
        url = "https://api.ebay.com/identity/v1/oauth2/token"

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {self.getBase64Encoding()}",
        }
        
        data = {
            "grant_type": "client_credentials",
            "scope": "https://api.ebay.com/oauth/api_scope"
        }

        response = requests.post(url, headers=headers, data=data)
        return response.json()["access_token"]




@app.route("/")
@app.route("/static/index.html")
def ebay_frontend():
	return send_from_directory('static', 'index.html')


@app.route("/testing")
def retireve_items():

	url = request.args.get('url', default = '', type = str)
	decoded_url = urllib.parse.unquote(url)

	try:
		if decoded_url != '':
			return requests.request("GET", decoded_url).text
	except:
		print('error')
	
	return 'Ebay unable to handle requests'


@app.route("/get_each")
def get_each_item():

	url = request.args.get('url', default = '', type = str)
	decoded_url = urllib.parse.unquote(url)

	client_id = "AdityaSi-adityasi-PRD-ab45afebc-323e9a90"
	client_secret = "PRD-b45afebcfd33-b5ac-4123-a19f-7dd4"

	oauth_utility = OAuthToken(client_id, client_secret)

	try:
		if decoded_url != '':
			headers = {
					"X-EBAY-API-IAF-TOKEN": oauth_utility.getApplicationToken()
			}

			return requests.get(decoded_url, headers=headers).text
	except:
		print('error')
	
	return 'Ebay unable to handle requests'



if __name__ == "__main__":
	app.run()
