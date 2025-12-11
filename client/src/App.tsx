import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/googleLogin/Login';
import Home from './components/Home';
import Reservations from './components/Reservations';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/home" element={<Home/>} />
        <Route  path="/reservations" element={<Reservations/>} />
      </Routes>
    </Router>
  )
}

export default App;