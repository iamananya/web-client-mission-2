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
import CardDetailsComponent from "../components/CardDetails";
import CardDetails from "../components/CardDetails";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import WalletCard from "../components/WalletCard";
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};
const BookingPage = ({
  user,
  showID,
  selectedSeats,
  selectedShowtime,
  selectedDate,
  amount,
  selectedShow,
}) => {
  const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.common.white,
    fontSize: "1rem",
  }));

  const [bookingDetails, setBookingDetails] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false); // State variable to show/hide transaction history
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const navigate = useNavigate();

  const gstId = "33AAAAA5291P2ZD"; // Set your GST ID here
  const gstRate = 0.18; // 10% GST
  const totalAmountBeforeGST = selectedSeats.reduce(
    (total, seat) => total + seat.price,
    0
  ).toFixed(2);
 
  const gstAmount = (totalAmountBeforeGST * gstRate).toFixed(2);;
  const totalAmountAfterGST = (parseFloat(totalAmountBeforeGST) + parseFloat(gstAmount)).toFixed(2);
  const ttk=0.0000065 ;
  const token_amount=parseFloat(ttk*totalAmountAfterGST).toFixed(8);
  const userid = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        axios.defaults.withCredentials = true;
        const sessionID = getCookie("session-id");
        const response = await axios.get(`http://localhost:9010/user/${userid}`, {
          headers: {
            "Session-ID": sessionID,
          },
          withCredentials: true,
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const generateBooking = async () => {
    try {
      axios.defaults.withCredentials = true;
      const sessionID = getCookie("session-id");

        const requestBody = {
        user_id: parseInt(userid),
        show_id: parseInt(showID),
        payment_amount: parseFloat(totalAmountAfterGST),
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
      setPaymentComplete(true);
      setShowCardDetails(false)
      setShowTransactionHistory(true); // Show transaction history page after successful booking
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
  const handleSeatUpdates = async (selectedSeats, showID, paymentComplete) => {
    try {
      if (selectedSeats.length > 0) {
        selectedSeats.forEach(async (seat) => {
          const sessionID = getCookie("session-id");
          const requestOptions = {
            headers: {
              "Session-ID": sessionID,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          };

          if (paymentComplete) {
            await axios.put(
              `http://localhost:9010/seats?seat_number=${seat.seat_number}&show_id=${showID}`,
              null,
              requestOptions
            );
          } else {
            await axios.delete(
              `http://localhost:9010/seats?seat_number=${seat.seat_number}&show_id=${showID}`,
              requestOptions
            );
          }
        });
      }
    } catch (error) {
      console.error("Error updating/deleting seats:", error);
    }
  };
  const handlePaymentSuccess = async () => {
    try {
      await generateBooking();

      await handleSeatUpdates(selectedSeats, showID, true);

      Swal.fire({
        title: "Booking Successful!",
        text: `Seats booked: ${selectedSeats
          .map((seat) => seat.seat_number)
          .join(", ")}`,
        icon: "success",
      });
    } catch (error) {
      console.error("Error handling payment success:", error);
      Swal.fire({
        title: "Booking Failed!",
        text: "An error occurred while making the booking.",
        icon: "error",
      });
    }
  };
  
  const handlePayNow = async () => {
    try {
      const result = await Swal.fire({
        title: "Proceed with Payment",
        text: "Are you sure you want to proceed with the payment?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Proceed",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        if (selectedSeats.length > 0) {
          setShowCardDetails(true);
        } else {
          Swal.fire({
            title: "No Seats Selected",
            text: "Please select at least one seat to proceed with the payment.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        
      } else {
        await handleSeatUpdates(selectedSeats, showID, false);

        navigate("/seating");
      }
    } catch (error) {
      console.error("Error in handlePayNow:", error);
    }
  };

  
  useEffect(() => {
    if (bookingDetails) {
      console.log("details", bookingDetails); // Use the booking details as required
    }
    setShowCardDetails(false);

  }, [bookingDetails]);

  const handleViewTransactionHistory = () => {
    setShowTransactionHistory((prevState) => !prevState);
  };
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
           <h3 style={{color:"darkblue",letterSpacing:2}}>Booking Details </h3>
        </Typography>
        <Typography variant="h5" component="h2" align="left" gutterBottom mt={5}>
        <h4 style={{color:"darkblue",letterSpacing:2}}>Booking Summary </h4>
        </Typography>

        <Box mt={3}>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>GST Registration Number:</TableCell>
                  <TableCell>{gstId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Name:</TableCell>
                  <TableCell>{userData?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email:</TableCell>
                  <TableCell>{userData?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Movie:</TableCell>
                  <TableCell>{selectedShow.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Show Time:</TableCell>
                  <TableCell>{selectedShowtime} hours</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Date:</TableCell>
                  <TableCell>{selectedDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Seats:</TableCell>
                  <TableCell>
                    {selectedSeats.map((seat) => (
                      <Button
                        variant="outlined"
                        startIcon={<SeatIcon color="action" style={{ color: "blue" }} />}
                        disabled
                        key={seat.ID}
                        style={{backgroundColor:"lightblue"}}
                      >
                        <span style={{color:"blue"}}> {seat.seat_number}</span>
                      </Button>
                    ))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Seat Price:</TableCell>
                  <TableCell>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Price (INR)</TableCell>
                            <TableCell>Seat</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedSeats.map((seat) => (
                            <TableRow key={seat.ID}>
                              <TableCell>
                                <span>₹{seat.price}</span>
                              </TableCell>
                              <TableCell>{seat.seat_number}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Amount Before GST:</TableCell>
                  <TableCell style={{ fontWeight: "600" }}>
                    ₹{totalAmountBeforeGST}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    GST Amount @ {gstRate * 100}%:
                  </TableCell>
                  <TableCell style={{ fontWeight: "600" }}>
                    ₹{totalAmountBeforeGST} {String.fromCharCode(215)}{" "}
                    {gstRate * 100}% = ₹{gstAmount}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Amount After GST:</TableCell>
                  <TableCell style={{ fontWeight: "600" }}>
                    ₹{totalAmountAfterGST}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>INR In TTK Conversion</TableCell>
                  <TableCell style={{ fontWeight: "600" }}>
                  ₹1 INR = {ttk} TTK
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Amount in tokens</TableCell>
                  <TableCell style={{ fontWeight: "600" }}>
                   {token_amount} TTK
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {bookingDetails && (
          <Box mt={3}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              style={{ fontWeight: "700", marginBottom: "10px" }}
            >
              Booking Successful
            </Typography>
          </Box>
        )}

          
          <Box mt={3} display="flex" justifyContent="center">
          {showCardDetails && (
            <div>
              {/* WalletCard component */}
              <WalletCard
                onSubmit={handlePayNow}
                selectedSeats={selectedSeats}
                showID={showID}
                handlePaymentSuccess={handlePaymentSuccess} 
                token_amount={token_amount} // Pass the token_amount as a prop
                />
            </div>
          )}

{!showCardDetails &&  (
  <Box mt={3} display="flex" justifyContent="center">
   {!paymentComplete &&( <Button variant="contained" color="primary" onClick={handlePayNow}>
      Make Payment
    </Button>)}
  </Box>
)}
        </Box>
        <Box mt={3} display="flex" justifyContent="center">
  {paymentComplete && (
    <Button
      variant="contained"
      color="primary"
      component={Link}
      to="/transaction-history"
      style={{ marginBottom: "2%" }}
    >
      View Transaction History
    </Button>
  )}
</Box>
      </Container>
     
    </div>
  );
};

export default BookingPage;
