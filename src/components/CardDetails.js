import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CardDetails = ({ onPayNow }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCVV] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardHolderNameError, setCardHolderNameError] = useState("");
  const [expiryDateError, setExpiryDateError] = useState("");
  const [cvvError, setCVVError] = useState("");

  const handleCardNumberChange = (event) => {
    const { value } = event.target;
    // Check if the card number is exactly 16 digits
    if (/^\d{16}$/.test(value)) {
      setCardNumber(value);
      setCardNumberError("");
    } else {
      setCardNumber(value);
      setCardNumberError("Please enter a valid 16-digit card number.");
    }
  };

  const handleCardHolderNameChange = (event) => {
    const { value } = event.target;
    // Check if the card holder name is a valid name and less than or equal to 30 characters
    if (/^[A-Za-z\s]{3,30}$/.test(value)) {
      setCardHolderName(value);
      setCardHolderNameError("");
    } else {
      setCardHolderName(value);
      setCardHolderNameError("Please enter a valid cardholder name.");
    }
  };

  const handleExpiryDateChange = (date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);

    // Check if the selected expiry date is after the current month and year
    if (selectedDate > currentDate) {
      const month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero if necessary
      const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
      setExpiryMonth(month);
      setExpiryYear(year);
      setExpiryDateError("");
    } else {
      setExpiryDateError("Please select a future expiry date.");
    }
  };

  const handleCVVChange = (event) => {
    const { value } = event.target;
    // Check if the CVV is exactly 3 digits
    if (/^\d{3}$/.test(value)) {
      setCVV(value);
      setCVVError("");
    } else {
      setCVV(value);
      setCVVError("Please enter a valid 3-digit CVV.");
    }
  };

  const handlePayNow = () => {
    // Perform validation on the card details
    if (
      cardNumber.length === 16 &&
      cardHolderName &&
      expiryMonth &&
      expiryYear &&
      cvv.length === 3
    ) {
      const cardDetails = {
        cardNumber,
        cardHolderName,
        expiryDate: `${expiryMonth}-${expiryYear}`,
        cvv,
      };

      // Call the handlePayment function with the card details
      onPayNow(cardDetails);
      setCardNumber("");
      setCardHolderName("");
      setExpiryMonth("");
      setExpiryYear("");
      setCVV("");
    } else {
      // Handle invalid card details
      alert("Please enter correct expiry date.");
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
        error={!!cardNumberError}
        helperText={cardNumberError}
      />
      <TextField
        label="Cardholder Name"
        value={cardHolderName}
        onChange={handleCardHolderNameChange}
        fullWidth
        variant="outlined"
        margin="normal"
        error={!!cardHolderNameError}
        helperText={cardHolderNameError}
      />
    <div style={{ display: "flex", gap: "10px" }}>
        <DatePicker
          selected={new Date(expiryYear, expiryMonth - 1)}
          onChange={handleExpiryDateChange}
          dateFormat="MM/yy"
          showMonthYearPicker
          customInput={
            <TextField
              label="Expiry Date"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!expiryDateError}
              helperText={expiryDateError}
            />
          }
        />
        <TextField
          label="CVV"
          type="password"
          value={cvv}
          onChange={handleCVVChange}
          fullWidth
          variant="outlined"
          margin="normal"
          error={!!cvvError}
          helperText={cvvError}
          inputProps={{ style: { minHeight: "100px" ,margin:"10px",padding:"10px",caretColor: "auto"} 

        }} 
          InputProps={{
            inputComponent: CVVInput,
          }}
          
        />
       
      </div>
      <Button variant="contained" color="primary" onClick={handlePayNow}>
        Pay Now
      </Button>
    </div>
  );
};

// Custom input component for masked CVV
const CVVInput = ({ value, onChange }) => (
  <input
    type="password"
    value={value}
    onChange={onChange}
    style={{
      border: "none",
      outline: "none",
      width: "100%",
      background: "transparent",
      fontFamily: "inherit",
      fontSize: "inherit",
      letterSpacing: "1px",
      caretColor: "transparent",
    }}
    maxLength="3"
  />
);

export default CardDetails;