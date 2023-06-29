import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useAsyncError,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Movies from "./pages/Movies";
import SeatingDetails from "./pages/SeatingDetails";
import BookingPage from "./pages/Booking";
import MovieDetails from "./pages/MovieDetails";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showID, setShowID] = useState();
  const [amount,setAmount]=useState()
  const handleShowDetails = (id) => {
    setShowID(id);
  };
  const handleTotalAmount=(cost)=>{
    console.log(cost)
    setAmount(cost);
    
  };
  const handleSelectedSeats = (seats) => {
    console.log("Selected Seats:", seats);
    setSelectedSeats(seats);
  };
  const handleTicketDetails = (showtime, date) => {
    const formattedDate = date.toLocaleDateString();

    const showtimeDate = new Date(showtime);
    const formattedShowtime = showtimeDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
     
    });

    setSelectedShowtime(formattedShowtime);
    setSelectedDate(formattedDate);
  };
  console.log(selectedDate, selectedShowtime);

  const handleLogout = () => {
    // Implement your logout logic here
    setIsLoggedIn(false);
  };
  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/movies" />} />

        <Route
          path="/movies"
          element={<Movies isLoggedIn={isLoggedIn} />}
          index
        />
        {!isLoggedIn && (
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} showID={showID}/>}
          />
        )}

        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/movies/:movieId"
          element={
            <MovieDetails
              isLoggedIn={isLoggedIn}
              handleTicketDetails={handleTicketDetails}
              handleShowDetails={handleShowDetails}
            />
          }
        />

        <Route
          path="/seating"
          element={
            <SeatingDetails
              selectedShowtime={selectedShowtime}
              selectedDate={selectedDate}
              showID={showID}
              handleSelectedSeats={handleSelectedSeats}
              handleTotalAmount={handleTotalAmount}
            />
          }
        />
        <Route
          path="/booking"
          element={
            <BookingPage
              selectedShowtime={selectedShowtime}
              selectedDate={selectedDate}
              selectedSeats={selectedSeats}
              showID={showID}
              amount={amount}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
