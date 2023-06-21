import React,{useState} from 'react';
import { Container, Typography, Grid, Button, Box } from '@mui/material';
import SeatIcon from '@mui/icons-material/EventSeat';

const SeatingDetails = () => {
  // Mock data for seats
  const seats = [
    { id: 1, row: 'Royal', seatNumber: 1, price: 150, isAvailable: true },
    { id: 2, row: 'Royal', seatNumber: 2, price: 150, isAvailable: true },
    { id: 3, row: 'Royal', seatNumber: 3, price: 150, isAvailable: false },
    { id: 4, row: 'Royal', seatNumber: 4, price: 150, isAvailable: false },
    { id: 5, row: 'Royal', seatNumber: 5, price: 150, isAvailable: false },
    // Add more seats...
    { id: 11, row: 'Premium', seatNumber: 1, price: 250, isAvailable: true },
    { id: 12, row: 'Premium', seatNumber: 2, price: 250, isAvailable: true },
    { id: 13, row: 'Premium', seatNumber: 3, price: 250, isAvailable: false },
    { id: 14, row: 'Premium', seatNumber: 4, price: 250, isAvailable: false },
    { id: 15, row: 'Premium', seatNumber: 5, price: 250, isAvailable: false },
    // Add more seats...
    { id: 21, row: 'Executive', seatNumber: 1, price: 500, isAvailable: true },
    { id: 22, row: 'Executive', seatNumber: 2, price: 500, isAvailable: true },
    { id: 23, row: 'Executive', seatNumber: 3, price: 500, isAvailable: false },
    { id: 24, row: 'Executive', seatNumber: 4, price: 500, isAvailable: false },
    { id: 25, row: 'Executive', seatNumber: 5, price: 500, isAvailable: false },
    // Add more seats...
  ];
  const [selectedSeats, setSelectedSeats] = useState([]);
  const handleSeatClick = (seat) => {
    if (seat.isAvailable) {
      const isSeatSelected = selectedSeats.find((selectedSeat) => selectedSeat.id === seat.id);
      if (isSeatSelected) {
        setSelectedSeats((prevSelectedSeats) =>
          prevSelectedSeats.filter((selectedSeat) => selectedSeat.id !== seat.id)
        );
      } else {
        setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seat]);
      }
    }
  };
  const calculateTotalAmount = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center" gutterBottom mt={5}>
        Seating Details
      </Typography>

      <Box display="flex" justifyContent="center" mt={5}>
        <Grid container spacing={2}>
          {seats.map((seat) => (
            <Grid item xs={2} key={seat.id}>
              <Button
                variant={selectedSeats.includes(seat) ? 'contained' : 'outlined'}
                startIcon={<SeatIcon />}
                disabled={!seat.isAvailable}
                onClick={() => handleSeatClick(seat)}
              >
                {seat.row} {seat.seatNumber} ({seat.price})
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
              <Grid item xs={2} key={seat.id}>
                <Button variant="contained" startIcon={<SeatIcon />}>
                  {seat.row} {seat.seatNumber}
                </Button>
              </Grid>
            ))}
          </Grid>
          <Typography variant="h6" component="p" gutterBottom>
            Total Amount: {calculateTotalAmount()}
          </Typography>
          <Button variant="contained" color="primary">
            Generate Bill
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default SeatingDetails;
