import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IconButton, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const CustomDatePicker = ({ selectedDate, handleDateChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <IconButton onClick={toggleDatePicker} style={{backgroundColor:"lightblue"}}>
        <CalendarTodayIcon />
      </IconButton>
      {selectedDate && (
        <Typography variant="body1" component="span">
          {selectedDate.toLocaleDateString()}
        </Typography>
      )}
      {showDatePicker && (
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={new Date()}
          maxDate={new Date().getTime() + 12096e5} // 2 weeks from current date
          inline
        />
      )}
    </div>
  );
};

export default CustomDatePicker;
