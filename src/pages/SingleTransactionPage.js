import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow ,Button} from "@mui/material";
import { Link } from "react-router-dom";
import {  ArrowBackRounded } from "@mui/icons-material";
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};
const SingleTransactionPage = () => {
  const [transaction, setTransaction] = useState(null);
  const [userData, setUserData] = useState(null);
  const gstId = "33AAAAA5291P2ZD"; // Set your GST ID here

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        axios.defaults.withCredentials = true;
        const sessionID = getCookie("session-id");
        const userID = localStorage.getItem("user_id");
        const transactionID = window.location.pathname.split("/")[2];

        const response = await axios.get(
          `http://localhost:9010/transaction-history?userID=${userID}&transactionID=${transactionID}`, {
            headers: {
              "Session-ID": sessionID,
            },
            withCredentials: true,
          }
        );

        const transactionData = response.data;
        setTransaction(transactionData);
        
        const fetchUserDetails = async () => {
          try {
            axios.defaults.withCredentials = true;
            const response = await axios.get(`http://localhost:9010/user/${userID}`, {
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
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      }
    };

    fetchTransactionDetails();
  }, []);
  const calculateInitialPrice = () => {
    const amountPaid = transaction.amount_paid;
    const initialPrice = amountPaid / 1.18; // Assuming GST is 18%
    return initialPrice.toFixed(2); // Rounding to 2 decimal places
  };

  const calculateGSTAmount = () => {
    const amountPaid = transaction.amount_paid;
    const initialPrice = amountPaid / 1.18; // Assuming GST is 18%
    const gstAmount = amountPaid - initialPrice;
    return gstAmount.toFixed(2); // Rounding to 2 decimal places
  };

  const calculateTotalAmount = () => {
    const amountPaid = transaction.amount_paid;
    return amountPaid.toFixed(2); // Rounding to 2 decimal places
  };

  return (
    <Container maxWidth="md" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      {transaction && userData ? (
        <Card>
          <CardContent>
          <Link to="/transaction-history"><ArrowBackRounded/></Link>

            <Typography variant="h5" component="h3" align="center" gutterBottom>
              <h4 style={{letterSpacing:2, color:"darkblue",margin:0}}> Transaction Details</h4>
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                <TableRow>
                  <TableCell><strong>GST Registration ID:</strong></TableCell>
                  <TableCell>{gstId}</TableCell>
                </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Transaction ID:</strong>
                    </TableCell>
                    <TableCell>{transaction.booking_id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Creation Date:</strong>
                    </TableCell>
                    <TableCell>{new Date(transaction.creation_date).toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>User Name:</strong>
                    </TableCell>
                    <TableCell>{userData.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>User Details:</strong>
                    </TableCell>
                    <TableCell>{userData.email}</TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>
                      <strong>Show ID:</strong>
                    </TableCell>
                    <TableCell>{transaction.show_id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Seats Selected:</strong>
                    </TableCell>
                    <TableCell> {transaction.seats_booked
                    // .filter((seat) => seat.show_id === transaction.show_id)
                    .map((seat) => seat.seat_number)
                    .join(", ")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Initial Price:</strong>
                    </TableCell>
                    <TableCell>₹{calculateInitialPrice()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>GST Amount (18%):</strong>
                    </TableCell>
                    <TableCell>₹{calculateGSTAmount()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Total Amount:</strong>
                    </TableCell>
                    <TableCell>₹{calculateTotalAmount()}</TableCell>
                  </TableRow>
                      <TableRow>
                        
                      </TableRow>
                
                </TableBody>
                
              </Table>
            </TableContainer>
          
            
          </CardContent>
          
        </Card>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </Container>
  );
};

export default SingleTransactionPage