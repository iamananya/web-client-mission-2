import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Grid, Button, Box } from "@mui/material";
import SeatIcon from "@mui/icons-material/EventSeat";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const SeatingDetails = ({
  selectedShowtime,
  selectedDate,
  showID,
  handleSelectedSeats,
  handleTotalAmount,
}) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0); // New state variable for total amount
  const [ticketPrices, setTicketPrices] = useState([]);
  const [seatAvailability, setSeatAvailability] = useState({});

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        axios.defaults.withCredentials = true;
        const sessionID = getCookie("session-id");
        const response = await axios.get(
          `http://localhost:9010/seats/${showID}`,
          {
            headers: {
              "Session-ID": sessionID,
            },
            withCredentials: true,
          }
        );
        const seatsData = response.data;
        const availability = {};
        seatsData.forEach((seat) => {
          availability[seat.ID] = seat.is_booked;
        });
    
        setSeats(seatsData);
        setSeatAvailability(availability);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    fetchSeats();
  }, []);

  useEffect(() => {
    const fetchTicketPrices = async () => {
      try {
        axios.defaults.withCredentials = true;
        const sessionID = getCookie("session-id");
        const response = await axios.get(
          `http://localhost:9010/ticket-prices?movie_id=${showID}`,
          {
            headers: {
              "Session-ID": sessionID,
            },
            withCredentials: true,
          }
        );
        setTicketPrices(response.data);
      } catch (error) {
        console.error("Error fetching ticket prices:", error);
      }
    };
  
    fetchTicketPrices();
  }, [showID]);
console.log("showid",showID)

const handleSeatClick = (seat) => {
  const isSeatSelected = selectedSeats.find(
    (selectedSeat) => selectedSeat.ID === seat.ID
  );
  if (isSeatSelected) {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.filter((selectedSeat) => selectedSeat.ID !== seat.ID)
    );
  } else  if (!seatAvailability[seat.ID]) {
    setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seat]);
  } else {
    Swal.fire({
      icon: "error",
      title: "Seat Unavailable",
      text: "This seat has already been booked by another user.",
    });
    
  }

  console.log("Seats:", selectedSeats);
};
  const userid = localStorage.getItem("user_id");
  const calculatePrice = (seatType) => {
    const price = ticketPrices.find((price) => price.seat_type_id === seatType);
  return price ? price.price : 0;
  };

  const calculateTotalAmount = () => {
    return selectedSeats.reduce(
      (total, seat) => total + calculatePrice(seat.seat_type_id),
      0
    ).toFixed(2);;
  };

  useEffect(() => {
    const amount = calculateTotalAmount();
    setTotalAmount(amount);
    handleTotalAmount(amount); // Pass the total amount to App.js
  }, [selectedSeats,ticketPrices]);

  const additionalSeats = [];
  const rows = ["A", "B", "C"];
  let uniqueKey = 0;

  rows.forEach((row) => {
    const rowSeats = seats.filter((seat) => seat.seat_number.startsWith(row));
    for (let i = 1; i <= 5; i++) {
      const seatNumber = `${row}-${i}`;
      const isBooked = rowSeats.some(
        (seat) => seat.seat_number === seatNumber && seat.is_booked
      );
      const seatType = row === "A" ? 1 : row === "B" ? 2 : 3;
      const price = calculatePrice(seatType);
      const seat = {
        ID: uniqueKey,
        seat_number: seatNumber,
        show_id:showID,
        seat_type_id: row === "A" ? 1 : row === "B" ? 2 : 3,
        is_booked: isBooked,
        price: price,
      };
      additionalSeats.push(seat);
      uniqueKey++;
    }
  });

  const generateBill = async () => {
    if (selectedSeats.some((seat) => seatAvailability[seat.ID])) {
      Swal.fire({
        icon: "error",
        title: "Seat Unavailable",
        text: "One or more selected seats have already been booked by another user.",
      });
      return;
    }
  
    handleSelectedSeats(selectedSeats);
    navigate("/booking", {
      state: { showtime: selectedShowtime, date: selectedDate },
    });
    } 


  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        mt={5}
      >
        Seating Details
      </Typography>
      <Typography align="left" gutterBottom mt={5}>
        <h3>Please select a seat by clicking on the blue seats. Click again to remove the seat.</h3>
        <Button
          startIcon={<SeatIcon />}
          style={{ backgroundColor: "blue" }}
        ></Button>{" "}
        Empty Seats
        <br />
        <Button
          startIcon={<SeatIcon />}
          style={{ backgroundColor: "grey", marginTop: "1%" }}
        ></Button>{" "}
        Filled Seats
      </Typography>
     
      <Box display="flex" justifyContent="center" mt={5}>
        <Grid container spacing={2}>
          {additionalSeats.map((seat) => (
            <Grid item xs={2} key={seat.ID}>
              <Button
                variant={
                  selectedSeats.includes(seat) ? "contained" : "outlined"
                }
                startIcon={<SeatIcon />}
                disabled={seat.is_booked}
                onClick={() => handleSeatClick(seat)}
                style={{
                  backgroundColor: selectedSeats.includes(seat)
                    ? "green"
                    : seat.is_booked
                    ? "grey"
                    : "blue",
                }}
              >
                {seat.seat_number}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
      {selectedSeats.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6" component="h4" gutterBottom>
            Selected Seats:
          </Typography>
          <Grid container spacing={2}>
            {selectedSeats.map((seat) => (
              <Grid item xs={2} key={seat.ID}>
                <Button
                  variant="contained"
                  startIcon={<SeatIcon />}
                  style={{ backgroundColor: "green" }}
                >
                  {seat.seat_number}
                </Button>
              </Grid>
            ))}
          </Grid>
          <Typography variant="h6" component="h4" gutterBottom>
            Total Amount: {calculateTotalAmount()}
          </Typography>
          <Button variant="contained" color="primary" onClick={generateBill}>
            Select Seats
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default SeatingDetails;
