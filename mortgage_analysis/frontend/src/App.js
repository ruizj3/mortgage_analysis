// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);

  const calculateY = () => {
    axios.get(`http://127.0.0.1:5000/calculate?x=${x}&z=${z}`)
      .then(response => {
        setY(response.data.y);
      });
  };

  return (
    <div className="App">
      <label>
        X value:
        <input 
          type="number"
          value={x}
          onChange={e => setX(e.target.value)}
        />
      </label>
      <label>
        Z value:
        <input 
          type="number"
          value={z}
          onChange={e => setZ(e.target.value)}
        />
      </label>
      <button onClick={calculateY}>
        Calculate y
      </button>
      <p>Y Value: {y}</p>
    </div>
  );
}

export default App;
