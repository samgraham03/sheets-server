import React, { useState, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {
  const [authorized, setAuthorized] = useState(null);
  const [oAuthData, setOAuthData] = useState(null);

  useEffect(() => {
    fetch('/authStatus')
    .then(res => res.json())
    .then(data => {
      setAuthorized(data.authorized);
    });
  }, []);

  const fetchData = () => {
    fetch('/fetchData')
    .then(res => res.json())
    .then(data => {
      setOAuthData(data.fetchData);
    });
  }

  const authorize = () => {
    fetch('/authorize')
    .then(res => res.json())
    .then(data => {
      setAuthorized(data.authorized);
    });
  }

  const deauthorize = () => {
    fetch('/deauthorize')
    .then(res => res.json())
    .then(data => {
      setAuthorized(data.authorized);
    });
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {authorized === false && <button onClick={() => authorize()}>Authorize</button>}
        {authorized === true && <button onClick={() => deauthorize()}>Deauthorize</button>}
        <button onClick={() => fetchData()}>Fetch Data</button>
        <br></br>
        OAuth Data:
        <p>{oAuthData}</p>
      </header>
    </div>
  );
}

export default App;
