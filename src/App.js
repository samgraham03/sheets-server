import React, { useState } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {
  const [oAuthData, setOAuthData] = useState(null);

  const oAuthFetch = () => {
    fetch('/OAuth')
      .then(res => res.json())
      .then(data => {
        setOAuthData(data.OAuth);
      });
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => oAuthFetch()}>OAuth Button</button>
        <br></br>
        OAuth Data:
        <p>{oAuthData}</p>
      </header>
    </div>
  );
}

export default App;
