from __future__ import print_function
import time
from flask import Flask

import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
SAMPLE_RANGE_NAME = 'Class Data!A2:E'

CREDENTIALS_DIR = os.path.dirname(os.path.realpath(__file__)) + '\\' + 'credentials.json'
TOKEN_DIR = os.path.dirname(os.path.realpath(__file__)) + '\\' + 'token.json'

PORT=8000

app = Flask(__name__)

@app.route('/authStatus')
def get_auth_status():
    return {'authorized': os.path.exists(TOKEN_DIR)}

@app.route('/deauthorize')
def deauthorize():
    if os.path.exists(TOKEN_DIR):
        os.remove(TOKEN_DIR)
    return {'authorized': os.path.exists(TOKEN_DIR)}

@app.route('/authorize')
def authorize():
    creds = get_creds()
    # if os.path.exists(TOKEN_DIR):
    #     creds = Credentials.from_authorized_user_file(TOKEN_DIR, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_DIR, SCOPES)
            creds = flow.run_local_server(port=PORT)
            # may be able to access the redirect url and handle it for return to lh3000

        with open(TOKEN_DIR, 'w') as token:
            token.write(creds.to_json())
    return {'authorized': os.path.exists(TOKEN_DIR)}


@app.route('/fetchData')
def fetch_data():
    creds = get_creds()
    if creds == None:
        return {'fetchData': 'Not Authorized'}
    else:
        try:
            service = build('sheets', 'v4', credentials=creds)
            sheet = service.spreadsheets()
            result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID, range=SAMPLE_RANGE_NAME).execute()
            values = result.get('values', [])
            # if not values:
            #     print('No data found.')
            #     return
            # print('Name, Major:')
            # for row in values:
            #     print('%s, %s' % (row[0], row[4]))
            return {'fetchData': values}
        except HttpError as err:
            # print(err)
            return {'fetchData': 'HTTP Error: ' + err}

def get_creds():
    creds = None
    if os.path.exists(TOKEN_DIR):
        creds = Credentials.from_authorized_user_file(TOKEN_DIR, SCOPES)
    return creds

