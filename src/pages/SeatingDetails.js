import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button, Box } from '@mui/material';
import SeatIcon from '@mui/icons-material/EventSeat';
import Swal from 'sweetalert2';
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const SeatingDetails = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        axios.defaults.withCredentials = true;

        const sessionID = getCookie('session-id');

        const response = await axios.get('http://localhost:9010/seats', {
          headers: {
            'Session-ID': sessionID,
          },
          withCredentials: true,
        });

        setSeats(response.data);
      } catch (error) {
        console.error('Error fetching seats:', error);
      }
    };

    fetchSeats();
  }, []);

  const handleSeatClick = (seat) => {
    if (!seat.is_booked) {
      const isSeatSelected = selectedSeats.find((selectedSeat) => selectedSeat.ID === seat.ID);
      if (isSeatSelected) {
        setSelectedSeats((prevSelectedSeats) => prevSelectedSeats.filter((selectedSeat) => selectedSeat.ID !== seat.ID));
      } else {
        setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seat]);
      }
    }
  };

  const calculatePrice = (seatType) => {
    if (seatType === 1) {
      return 150;
    } else if (seatType === 2) {
      return 200;
    } else if (seatType === 3) {
      return 250;
    } else {
      return 0;
    }
  };

  const calculateTotalAmount = () => {
    return selectedSeats.reduce((total, seat) => total + calculatePrice(seat.seat_type_id), 0);
  };

  const additionalSeats = [];
  const rows = ['A', 'B', 'C'];
  let uniqueKey = 0;

  rows.forEach((row) => {
    const rowSeats = seats.filter((seat) => seat.seat_number.startsWith(row));
    for (let i = 1; i <= 5; i++) {
      const seatNumber = `${row}-${i}`;
      const isBooked = rowSeats.some((seat) => seat.seat_number === seatNumber && seat.is_booked);
      const seat = {
        ID: uniqueKey,
        seat_number: seatNumber,
        seat_type_id: row === 'A' ? 1 : row === 'B' ? 2 : 3,
        is_booked: isBooked,
        price: 0,
      };
      additionalSeats.push(seat);
      uniqueKey++;
    }
  });

  const generateBill = async () => {
    try {
      const sessionID = getCookie('session-id');

      for (const seat of selectedSeats) {
        const requestBody = {
          show_id: 1,
          seat_number: seat.seat_number,
          seat_type_id: seat.seat_type_id,
          is_booked: true,
        };
        console.log(requestBody)
        await axios.post('http://localhost:9010/seats', requestBody, {
          headers: {
            'Session-ID': sessionID,
          },
          withCredentials: true,
        });
        Swal.fire({
          title: 'Seat Booked!',
          text: `Seat ${seat.seat_number} has been booked successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }

      setSelectedSeats([]);

      // Navigate to the "booking" route
      setTimeout(() => {
        window.location.href = '/booking';
      }, 3000);

    } catch (error) {
      console.error('Error generating bill:', error);
    }

  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center" gutterBottom mt={5}>
        Seating Details
      </Typography>

      <Box display="flex" justifyContent="center" mt={5}>
        <Grid container spacing={2}>
          {additionalSeats.map((seat) => (
            <Grid item xs={2} key={seat.ID}>
              <Button
                variant={selectedSeats.includes(seat) ? 'contained' : 'outlined'}
                startIcon={<SeatIcon />}
                disabled={seat.is_booked}
                onClick={() => handleSeatClick(seat)}
                style={{
                  backgroundColor: selectedSeats.includes(seat) ? 'yellow' : seat.is_booked ? 'grey' : 'blue',
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
          <Typography variant="h5" component="h2" gutterBottom>
            Selected Seats:
          </Typography>
          <Grid container spacing={2}>
            {selectedSeats.map((seat) => (
              <Grid item xs={2} key={seat.ID}>
                <Button variant="contained" startIcon={<SeatIcon />} style={{ backgroundColor: 'yellow' }}>
                  {seat.seat_number}
                </Button>
              </Grid>
            ))}
          </Grid>
          <Typography variant="h6" component="p" gutterBottom>
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
