# Sheets Server
Sheets Server integrates a ReactJS frontend and Python Flask backend to securely serve google sheets menus via the Google Sheets API.

With OAuth2.0, a Sheets Server user can authorize the Google Sheets API to run on the Python backend.
Provided a url to a custom google sheet, the backend fetches data from the sheet and returns in to the frontend.
The frontend then displays the data in a friendly manner for to user to read.
As the OAuth is handled on the backend, the user does not have to worry about their data being compromised as it never reaches the frontend.

## Setting up the Project
1. [Create a Google Cloud Project](https://developers.google.com/workspace/guides/create-project)
2. [Create OAuth Client ID Credentials](https://developers.google.com/workspace/guides/create-credentials#oauth-client-id)
  - The "Authorized Redirect URL" should be set to http://localhost:8000/ (or match PORT specified in ./api/api.py)
  - The generated credentials.json file should be placed in ./api/
**Windows**
```
$ cd api
$ python -m venv venv
$ venv\Scripts\activate
$ pip install flask python-dotenv
$ pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
$ cd ..
```
## Running the Project
**Windows**
terminal 1 - backend
```
$ npm run start-api
```
terminal 2 - frontend
```
$ npm start
```
