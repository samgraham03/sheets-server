import React, { useState, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {
  const [authorized, setAuthorized] = useState(false);
  const [oAuthData, setOAuthData] = useState(null);
  const [sheetURL, setSheetURL] = useState('Sheet URL');
  const [invalidURL, setInvalidURL] = useState(false);

  useEffect(() => {
    fetch('/authStatus')
      .then(res => res.json())
      .then(data => {
        setAuthorized(data.authorized);
      })
      .catch(err => console.log(err));
  }, []);

  // const fetchData = () => {
  //   fetch('/fetchData')
  //     .then(res => res.json())
  //     .then(data => {
  //       setOAuthData(data.fetchData);
  //     })
  //     .catch(err => console.log(err));
  // }

  const fetchData = (url) => {
    let sheetID = getSheetID(url);
    if (sheetID === null) {
      setInvalidURL(true);
    }
    else {
      // TODO: pass back sheetID

      fetch('/fetchData')
        .then(res => res.json())
        .then(data => {
          setOAuthData(data.fetchData);
        })
        .catch(err => console.log(err));
    }
    console.log(sheetID);
  }

  const getSheetID = (url) => {
    try {
      new URL(url); // not a URL
      try {
        return url.match(/.*\/d\/(.*)\//)[1]; // Starts with "d/" ends with '/'
      }
      catch {
        try {
          return url.match(/d\/(.+?)$/)[1]; // Starts with "d/" ends at line end
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
                  name="Sheet URL"
                  onChange={(e) => {setSheetURL(e.target.value); setInvalidURL(false);}}
                />
              </label>
              <input type="submit" value="Fetch Data" />
            </form>

            {invalidURL && (<>INVALID URL</>)}
          </>
        )}

        <br></br>
        OAuth Data:
        <p>{oAuthData}</p>
      </header>
    </div>
  );
}

export default App;
