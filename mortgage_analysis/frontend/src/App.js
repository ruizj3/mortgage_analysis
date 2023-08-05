// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Data from './Data';
import Mortgage from './Mortgage';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/data">Data</Link>
            </li>
            <li>
              <Link to="/mortgage">Mortgage</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/data" element={<Data />} />
          <Route path="/mortgage" element={<Mortgage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
