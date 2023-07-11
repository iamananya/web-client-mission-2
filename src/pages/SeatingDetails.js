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
          console.log(seat.ID, seat.seat_number,seat.is_booked)
          availability[seat.seat_number] = seat.is_booked;
        });
    
        setSeats(seatsData);
        setSeatAvailability(availability);
        console.log("seat and avaiability",seats,availability)
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
        console.log("ticket prices",ticketPrices)
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
    // console.log("apple")

  } else  if (!seatAvailability[seat.seat_number]) {
    setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seat]);
  } else {
    console.log("blocked",seat.seat_number,seat.ID,seatAvailability[seat.ID])
    Swal.fire({
      icon: "error",
      title: "Seat Unavailable",
      text: "This seat has already been booked by another user.",
    });
    
  }
  const seatButton = document.getElementById(`seat-${seat.ID}`);
  if (seatButton) {
    seatButton.style.backgroundColor = isSeatSelected ? "lightblue" : "blue";
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
        (seat) => seat.seat_number === seatNumber 
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
    try {
      axios.defaults.withCredentials = true;
      const sessionID = getCookie("session-id");

      for (const seat of selectedSeats) {
        const requestBody = {
          show_id: parseInt(showID),
          seat_number: seat.seat_number,
          seat_type_id: seat.seat_type_id,
          is_booked: false,
          user_id: parseInt(userid),
        };
        await axios.post("http://localhost:9010/seats", requestBody, {
          headers: {
            "Session-ID": sessionID,
          },
          withCredentials: true,
        });
      }
      navigate("/booking", {
      state: { showtime: selectedShowtime, date: selectedDate },
    });
    }catch (error) {
      console.error("Error selecting sats:", error);
      Swal.fire({
        title: "Selecting seats failed!",
        text: "One or more selected seats have already been in process of booking by another user.",
        icon: "error",
      });
    }
    if (selectedSeats.some((seat) => seatAvailability[seat.seat_number])) {
      Swal.fire({
        icon: "error",
        title: "Seat Unavailable",
        text: "One or more selected seats have already been booked by another user.",
      });
      return;
    }
  
    handleSelectedSeats(selectedSeats);
    
    } 
    const getSeatPrice = (seatType) => {
      const priceData = ticketPrices.find((price) => price.seat_type_id === seatType);
      return priceData ? `₹${priceData.price}` : "N/A";
    };

  return (
    <Container maxWidth="md">
      <Typography
        align="center"
        gutterBottom
        mt={1}
        variant="h6" component="h2"
      >
       <h1 style={{letterSpacing:2,color:"darkblue"}}> Seating Details</h1>
      </Typography>
      <Typography align="left" gutterBottom mt={2}>
        <h3>Please select a seat by clicking on the blue seats. Click again to remove the seat.</h3>
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                startIcon={<SeatIcon />}
                variant="outlined"
                style={{ backgroundColor: "lightblue" }}
              ></Button>{" "}
              Empty Seats
            </Grid>
            <Grid item>
              <Button
                startIcon={<SeatIcon style={{ color: "grey" }} />}
                variant="outlined"
                style={{ backgroundColor: "lightgrey" }}
              ></Button>{" "}
              Filled Seats
            </Grid>
          </Grid>
        </Grid>
  
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                startIcon={<SeatIcon style={{ color: "lightblue" }} />}
                variant="outlined"
                style={{ backgroundColor: "blue" }}
              ></Button>{" "}
              Selected Seats
            </Grid>
            <Grid item>
              <Button
                startIcon={<SeatIcon style={{ color: "grey" }} />}
                variant="outlined"
                style={{ backgroundColor: "lightblue" }}
              ></Button>{" "}
              Currently unavailable
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Typography align="center" gutterBottom mt={1}>
        <h3>Seat Prices</h3>
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                startIcon={<SeatIcon />}
                variant="outlined"
                style={{ backgroundColor: "lightblue" }}
              >A</Button>{" "}
              {getSeatPrice(1)}
            </Grid>
            <Grid item>
              <Button
                startIcon={<SeatIcon />}
                variant="outlined"
                style={{ backgroundColor: "lightblue" }}
              >B</Button>{" "}
              {getSeatPrice(2)}
            </Grid>
            <Grid item>
              <Button
                startIcon={<SeatIcon />}
                variant="outlined"
                style={{ backgroundColor: "lightblue" }}
              >C</Button>{" "}
              {getSeatPrice(3)}
            </Grid>
            
          </Grid>
          
        </Grid>
  
      
      </Grid>
      <Box display="flex" justifyContent="center" mt={3}>
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
                  backgroundColor: seatAvailability[seat.seat_number]
                    ? "lightgrey"
                    :"lightblue"
                }}
                id={`seat-${seat.ID}`}

              >
                {seat.seat_number}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
      {selectedSeats.length > 0 && (
        <Box>
          <Typography variant="h6" component="h4" gutterBottom mt={1}>
            <h4 style={{margin:0}}>Selected Seats</h4>
          </Typography>
          <Grid container spacing={2} >
            {selectedSeats.map((seat) => (
              <Grid item xs={2} key={seat.ID}>
                <Button
                  variant="outlined"
                  startIcon={<SeatIcon style={{color:"blue"}}/>}
                  style={{ backgroundColor: "lightblue" }}
                >
                  {seat.seat_number}
                </Button>
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
  <Grid item>
    <Typography variant="h6" component="h4" gutterBottom>
      <h4>Total Amount: ₹{calculateTotalAmount()}</h4>
    </Typography>
  </Grid>
  <Grid item>
    <Button variant="contained" color="primary" onClick={generateBill}>
      Select Seats
    </Button>
  </Grid>
</Grid>
        </Box>
      )}
    </Container>
  );
};

export default SeatingDetails;
