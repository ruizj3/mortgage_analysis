// frontend/src/Data.js
import React, { useEffect, useState } from 'react';

function Data() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div className="Data">
      <h1>Data from backend: {JSON.stringify(data)}</h1>
    </div>
  );
}

export default Data;
