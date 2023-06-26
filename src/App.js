import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Movies from './pages/Movies';
import SeatingDetails from './pages/SeatingDetails';
import Booking from './pages/Booking';
import MovieDetails from './pages/MovieDetails';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    // Implement your logout logic here
    setIsLoggedIn(false);
  };
  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
      <Route path="/" element={<Navigate to="/movies" />} />

        <Route  path="/movies" element={<Movies  isLoggedIn={isLoggedIn} />} index/>
        {!isLoggedIn && <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />}

        <Route path="/signup" element={<SignUp/>} />
        <Route path="/movies/:movieId" element={<MovieDetails isLoggedIn={isLoggedIn} />} />

        <Route path="/seating" element={<SeatingDetails/>} />
        <Route path="/booking" element={<Booking/>} />
      </Routes>
    </Router>
  );
};

export default App;
