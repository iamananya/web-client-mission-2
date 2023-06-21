import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Movies from './pages/Movies';
import SeatingDetails from './pages/SeatingDetails';
import Booking from './pages/Booking';
import MovieDetails from './pages/MovieDetails';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/movies" element={<Movies/>} />
        <Route path="/movies/:movieId" element={<MovieDetails/>} />

        <Route path="/seating" element={<SeatingDetails/>} />
        <Route path="/booking" element={<Booking/>} />
      </Routes>
    </Router>
  );
};

export default App;
