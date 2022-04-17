import React, { useState, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';

import { getAuthStatus, authorize, deauthorize, fetchData } from './services/api';

function App() {
  const [authorized, setAuthorized] = useState(false);
  const [data, setData] = useState(null);
  const [sheetURL, setSheetURL] = useState('');
  const [invalidURL, setInvalidURL] = useState(false);

  useEffect(() => {
    getAuthStatus(setAuthorized);
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        {!authorized && (
          <button onClick={() => authorize(setAuthorized)}>Authorize</button>
        )}

        {authorized && (
          <>
            <button onClick={() => deauthorize(setAuthorized)}>Deauthorize</button>
          </>
        )}

        <form onSubmit={(e) => {e.preventDefault(); fetchData(sheetURL, setData, setInvalidURL);}}>
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
        <><br />Data:</>
        <p style={{marginTop: 0}}>{data}</p>
      </header>
    </div>
  );
}

export default App;
