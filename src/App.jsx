import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Import your Home component here

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the route with optional parameters */}
        <Route path="/:prov?/:kot?/:kec?/:kel?" element={<Home />} />
        {/* Define other routes if needed */}
      </Routes>
    </Router>
  );
}

export default App;
