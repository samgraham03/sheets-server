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

app = Flask(__name__)

@app.route('/OAuth')
def authenticate():
    creds = None
    if os.path.exists(os.path.dirname(os.path.realpath(__file__)) + '\\' + 'token.json'):
        creds = Credentials.from_authorized_user_file(os.path.dirname(os.path.realpath(__file__)) + '\\' + 'token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(os.path.dirname(os.path.realpath(__file__)) + '\\' + 'credentials.json', SCOPES)
            creds = flow.run_local_server(port=8000)
        with open(os.path.dirname(os.path.realpath(__file__)) + '\\' + 'token.json', 'w') as token:
            token.write(creds.to_json())
    try:
        service = build('sheets', 'v4', credentials=creds)
        sheet = service.spreadsheets()
        result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID, range=SAMPLE_RANGE_NAME).execute()
        values = result.get('values', [])
        if not values:
            print('No data found.')
            return
        print('Name, Major:')
        for row in values:
            print('%s, %s' % (row[0], row[4]))
        # return {'OAuth': 'no exceptions'}
        return {'OAuth': values}
    except HttpError as err:
        print(err)
        return {'OAuth': 'HttpError'}
