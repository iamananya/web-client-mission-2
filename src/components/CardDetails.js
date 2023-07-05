import React, { useState } from "react";
import { Button, TextField } from "@mui/material";

const CardDetails = ({ onPayNow }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCVV] = useState("");

  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };

  const handleCardHolderNameChange = (event) => {
    setCardHolderName(event.target.value);
  };

  const handleExpiryDateChange = (event) => {
    setExpiryDate(event.target.value);
  };

  const handleCVVChange = (event) => {
    setCVV(event.target.value);
  };

  const handlePayNow = () => {
    // Perform validation on the card details
    // For simplicity, you can add basic validation checks here
    if (cardNumber && cardHolderName && expiryDate && cvv) {
      const cardDetails = {
        cardNumber,
        cardHolderName,
        expiryDate,
        cvv,
      };

      // Call the handlePayment function with the card details
      onPayNow();
    } else {
      // Handle invalid card details
      alert("Please enter valid card details.");
    }
  };

  return (
    <div>
      <TextField
        label="Card Number"
        value={cardNumber}
        onChange={handleCardNumberChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <TextField
        label="Cardholder Name"
        value={cardHolderName}
        onChange={handleCardHolderNameChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <TextField
        label="Expiry Date"
        value={expiryDate}
        onChange={handleExpiryDateChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <TextField
        label="CVV"
        value={cvv}
        onChange={handleCVVChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handlePayNow}>
        Pay Now
      </Button>
    </div>
  );
};

export default CardDetails;
