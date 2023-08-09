// frontend/src/Data.js
import React, { useEffect, useState } from 'react';
const apiUrl = process.env.REACT_APP_CONNECT_TO_BACKEND_URL;

function Data() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(apiUrl+`/data`)
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
