import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const TransactionHistoryPage = ({showID }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;
  const userID=localStorage.getItem("user_id");
  useEffect(() => {
    
    const fetchTransactionHistory = async () => {
      try {
        axios.defaults.withCredentials = true;
        const sessionID = getCookie("session-id");

        const response = await axios.get(
          `http://localhost:9010/transaction-history/${userID}`,
          {
            headers: {
              "Session-ID": sessionID,
            },
            withCredentials: true,
          }
        );

        const transactionsData = response.data;
        console.log("Transa data",transactionsData)
        if (transactionsData) {
          transactionsData.reverse();

          setTransactions(transactionsData);
          setTotalPages(Math.ceil(transactionsData.length / itemsPerPage));
        }
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    };

    fetchTransactionHistory();
  }, [userID, showID]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getPaginatedTransactions = () => {
    if (transactions && transactions.length > 0) {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return transactions.slice(startIndex, endIndex);
    }
    return [];
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h2" align="center" gutterBottom mt={5}>
          <h3 style={{color:"darkblue",letterSpacing:2}}>Transaction History </h3>
        </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Seats Booked</TableCell>
              <TableCell>View Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getPaginatedTransactions().map((transaction) => (
              <TableRow key={transaction.booking_id}>
                <TableCell>{transaction.booking_id}</TableCell>
                <TableCell> ₹{transaction.amount_paid}</TableCell>
                <TableCell>
                  {transaction.seats_booked
                    // .filter((seat) => seat.show_id === transaction.show_id)
                    .map((seat) => seat.seat_number)
                    .join(", ")}
                </TableCell>
            
                <TableCell><Button   component={Link}
                to={`/transaction-details/${transaction.booking_id}`}
                variant="outlined">View Details</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Container>
  );
};

export default TransactionHistoryPage;
