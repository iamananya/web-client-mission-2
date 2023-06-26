import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button, Box } from '@mui/material';
import SeatIcon from '@mui/icons-material/EventSeat';
import Swal from 'sweetalert2';

const BookingPage = ({ user, showId, selectedSeats }) => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const generateBooking = async () => {
    try {
      axios.defaults.withCredentials = true;

      const sessionID = getCookie('session-id');

      const requestBody = {
        user_id: 1,
        show_id: 1,
        
      };

      const response = await axios.post('http://localhost:9010/bookings', requestBody, {
        headers: {
          'Session-ID': sessionID,
        },
        withCredentials: true,
      });

      setBookingDetails(response.data);
      Swal.fire({
        title: 'Booking Successful!',
        text: `Seats booked: ${selectedSeats.map((seat) => seat.seat_number).join(', ')}`,
        icon: 'success',
      });
    } catch (error) {
      console.error('Error generating booking:', error);
      Swal.fire({
        title: 'Payment Failed!',
        text: 'An error occurred while making the payment.',
        icon: 'error',
      });
    }
  };

  useEffect(() => {
    generateBooking();
  }, []);

  useEffect(() => {
    if (bookingDetails) {
      console.log(bookingDetails); // Use the booking details as required
    }
  }, [bookingDetails]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center" gutterBottom mt={5}>
        Booking Details
      </Typography>

      <Box display="flex" justifyContent="center" mt={5}>
        {/* <Grid container spacing={2}>
          {selectedSeats.map((seat) => (
            <Grid item xs={2} key={seat.ID}>
              <Button variant="contained" startIcon={<SeatIcon />} disabled>
                {seat.seat_number}
              </Button>
            </Grid>
          ))}
        </Grid> */}
      </Box>

      {bookingDetails && (
        <Box mt={3}>
          <Typography variant="h5" component="h2" gutterBottom>
            Booking Summary:
          </Typography>
          <Typography variant="body1" gutterBottom>
            User: {bookingDetails.ticketDetails.user.name} ({bookingDetails.ticketDetails.user.email})
          </Typography>
          <Typography variant="body1" gutterBottom>
            Seats: {bookingDetails.seats.map((seat) => seat.seat_number).join(', ')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Total Amount: {bookingDetails.payment_amount}
          </Typography>
        </Box>
      )}

      <Box mt={3} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={generateBooking}>
          Pay Now
        </Button>
      </Box>
    </Container>
  );
};

export default BookingPage;
