import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Grid, Button, Box } from "@mui/material";
import SeatIcon from "@mui/icons-material/EventSeat";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { TableChartOutlined } from "@mui/icons-material";
import TransactionHistoryPage from "./TransactionHistory";
const BookingPage = ({
  user,
  showID,
  selectedSeats,
  selectedShowtime,
  selectedDate,
  amount,
}) => {
  const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.common.white,
    fontSize: "1rem",
  }));
  const [bookingDetails, setBookingDetails] = useState(null);
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  console.log("Date,time", selectedDate, selectedShowtime);
  const userid = localStorage.getItem("user_id");

  const generateBooking = async () => {
    try {
      axios.defaults.withCredentials = true;

      const sessionID = getCookie("session-id");

      const requestBody = {
        user_id: parseInt(userid),
        show_id: parseInt(showID),
        payment_amount:parseFloat(amount)
      };

      const response = await axios.post(
        "http://localhost:9010/bookings",
        requestBody,
        {
          headers: {
            "Session-ID": sessionID,
          },
          withCredentials: true,
        }
      );

      setBookingDetails(response.data);
      Swal.fire({
        title: "Booking Successful!",
        text: `Seats booked: ${selectedSeats
          .map((seat) => seat.seat_number)
          .join(", ")}`,
        icon: "success",
      });
    } catch (error) {
      console.error("Error generating booking:", error);
      Swal.fire({
        title: "Payment Failed!",
        text: "An error occurred while making the payment.",
        icon: "error",
      });
    }
  };
  const handlePayNow = () => {
    Swal.fire({
      title: "Proceed with Payment",
      text: "Are you sure you want to proceed with the payment?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Proceed",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        generateBooking();
      }
    });
  };
  useEffect(() => {
    if (bookingDetails) {
      console.log(bookingDetails); // Use the booking details as required
    }
  }, [bookingDetails]);

  return (
    <div>
    <Container maxWidth="md">
      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        mt={5}
        style={{ textAlign: "center", fontWeight: "700" }}
      >
        Booking Details
      </Typography>

      <Box display="flex" justifyContent="center" mt={5}>
        <Grid container spacing={2}>
        <Typography variant="h5" component="h2" gutterBottom  style={{fontWeight:"700",marginBottom:"2%"}}>
                Seats
              </Typography>
          {selectedSeats.map((seat) => (
            <Grid item xs={2} key={seat.ID}>
              
              <Button variant="contained" startIcon={<SeatIcon />} disabled>
                {seat.seat_number}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {bookingDetails && (
        <Box mt={3}>
          <Typography variant="h5" component="h2" gutterBottom style={{fontWeight:"700",marginBottom:"10px"}}>
            Booking Invoice:
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeaderCell>User</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Email</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Seats</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Selected Time</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Selected Date</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Total Amount</StyledTableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody >
                <TableRow>
                  <TableCell>
                    {bookingDetails.ticketDetails.user.name}
                  </TableCell>
                  <TableCell>
                    {bookingDetails.ticketDetails.user.email}
                  </TableCell>
                  <TableCell>
                    {selectedSeats.map((seat) => seat.seat_number).join(", ")}
                  </TableCell>
                  <TableCell>{selectedShowtime}</TableCell>
                  <TableCell>{selectedDate}</TableCell>
                  <TableCell>{amount}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Box mt={3} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={handlePayNow}>
          Pay Now
        </Button>
      </Box>
    </Container>
    <TransactionHistoryPage userID={userid} showID={showID} />

    </div>
  );
};

export default BookingPage;
