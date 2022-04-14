import React, { useState, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {
  const [authorized, setAuthorized] = useState(false);
  const [oAuthData, setOAuthData] = useState(null);
  const [sheetURL, setSheetURL] = useState('');
  const [invalidURL, setInvalidURL] = useState(false);

  useEffect(() => {
    fetch('/authStatus')
      .then(res => res.json())
      .then(data => {
        setAuthorized(data.authorized);
      })
      .catch(err => console.log(err));
  }, []);

  const fetchData = (url) => {
    let sheetId = getSheetId(url);
    if (sheetId === null) {
      setInvalidURL(true);
    }
    else {
      fetch('/fetchData', {
          'method':'POST',
          headers : {
            'Content-Type':'application/json'
          },
          body:JSON.stringify({sheetId})
        })
        .then(res => res.json())
        .then(data => {
          setOAuthData(data.fetchData);
        })
        .catch(err => console.log(err));
    }
    console.log(sheetId);
  }

  const getSheetId = (url) => {
    // Google spreadsheet urls generally take form:
    // https://docs.google.com/spreadsheets/d<sheetId>/edit#gid=0
    // Here sheetId is isolated using regex
    try {
      new URL(url); // Is a URL ?
      try {
        return url.match(/.*\/d\/(.*)\//)[1]; // Starts with "d/" ends with '/' ?
      }
      catch {
        try {
          return url.match(/d\/(.+?)$/)[1]; // Starts with "d/" ends at line end ?
        }
        catch {
          return null;
        }
      }
    }
    catch {
      return null;
    }
  }

  const authorize = () => {
    fetch('/authorize')
      .then(res => res.json())
      .then(data => {
        setAuthorized(data.authorized);
      })
      .catch(err => console.log(err));
  }

  const deauthorize = () => {
    fetch('/deauthorize')
      .then(res => res.json())
      .then(data => {
        setAuthorized(data.authorized);
      })
      .catch(err => console.log(err));
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        {!authorized && (
          <button onClick={() => authorize()}>Authorize</button>
        )}

        {authorized && (
          <>
            <button onClick={() => deauthorize()}>Deauthorize</button>
            <form onSubmit={(e) => {e.preventDefault(); fetchData(sheetURL);}}>
              <label>
                <input
                  type="text"
                  value={sheetURL}
                  placeholder='Enter spreadsheet URL'
                  name="Sheet URL"
                  onChange={(e) => {setSheetURL(e.target.value); setInvalidURL(false);}}
                />
              </label>
              <input type="submit" value="Fetch Data" />
            </form>

            {invalidURL && (<>INVALID URL</>)}
          </>
        )}
        <><br />Fetch Data:</>
        <p style={{marginTop: 0}}>{oAuthData}</p>
      </header>
    </div>
  );
}

export default App;
