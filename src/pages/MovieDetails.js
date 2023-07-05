import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import CustomDatePicker from "./../components/CustomDatePicker";

import "react-datepicker/dist/react-datepicker.css";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Pagination,
  Calendar,
  Button,
  CardMedia,
} from "@mui/material";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Swal from 'sweetalert2';

const MovieDetails = ({ isLoggedIn, handleTicketDetails, handleShowDetails }) => {
  const { movieId } = useParams();
  const [show, setShow] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9010/movies/${movieId}`,
        );

        if (response.status === 200) {
          setShow(response.data);
          console.log(response.data);
        } else {
          setShow(null);
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/login")
        setShow(null);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  handleShowDetails(movieId, show);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleShowtimeSelect = (showtime, isClickable) => {
    if (isClickable) {
      setSelectedShowtime(showtime);
    }
  };

  const handleBookTicket = () => {
    if (isLoggedIn) {
      if (selectedShowtime && selectedDate) {
        console.log(selectedShowtime);
        console.log("Ticket booked!", selectedShowtime, selectedDate);
        handleTicketDetails(selectedShowtime, selectedDate);
        setShowDetails(true);
        navigate("/seating");
      } else {
        console.log("Please select a showtime and date.");
        Swal.fire({
          icon: "warning",
          title: "Reminder",
          text: "Please choose a showtime before proceeding.",
        });
      }
    } else {
      navigate("/login");
    }
  };

  if (!show) {
    return (
      <Container>
        <Typography variant="h4" component="h1">
          Movie Details
        </Typography>
        <Typography variant="body1" component="p">
          Loading Show details...
        </Typography>
      </Container>
    );
  }

  const isCurrentDate = selectedDate.toDateString() === new Date().toDateString();

  return (
    <Container style={{ padding: "5%" }}>
      {show && (
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                src={show.image}
                alt={show.title}
                style={{ width: "100%", height: "auto" }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" style={{color:"green",fontWeight:"700"}}>
                {show.title}
              </Typography>
              <Typography variant="body1" component="p" style={{padding:"2px",fontSize:"20px"}}>
                {show.desc}
              </Typography>
              <Typography variant="h5" component="h2" style={{ marginTop: "2rem",color:"blue",fontWeight:"600" }}>
                Choose Time (24-hour format)
              </Typography>
              <Grid container spacing={2} style={{ margin: "0px", padding: "2%" }}>
                {show.shows.map((showtime) => {
                  const showtime1 = new Date(showtime.showtime_slot_1);
                  const showtime2 = new Date(showtime.showtime_slot_2);
                  const showtime3 = new Date(showtime.showtime_slot_3);
                  const showtime4 = new Date(showtime.showtime_slot_4);
                  
                  const showtime1Time = showtime1.getHours() * 60 + showtime1.getMinutes();
                  const showtime2Time = showtime2.getHours() * 60 + showtime2.getMinutes();
                  const showtime3Time = showtime3.getHours() * 60 + showtime3.getMinutes();
                  const showtime4Time = showtime4.getHours() * 60 + showtime4.getMinutes();
                  
                  const currentTime = new Date();
                  const currentTimeTime = currentTime.getHours() * 60 + currentTime.getMinutes();
                  // console.log(showtime1Time, showtime2Time, showtime3Time, showtime4Time, currentTimeTime);
                  
                  const isShowtime1Clickable = !isCurrentDate || showtime1Time > currentTimeTime;
                  const isShowtime2Clickable = !isCurrentDate || showtime2Time > currentTimeTime;
                  const isShowtime3Clickable = !isCurrentDate || showtime3Time > currentTimeTime;
                  const isShowtime4Clickable = !isCurrentDate || showtime4Time > currentTimeTime;
          

                  return (
                    
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      key={showtime.ID}
                      style={{ display: "contents", padding: "3%" }}
                    >
                      <Card
                        style={{
                          backgroundColor:
                            selectedShowtime === showtime.showtime_slot_1
                              ? "blue"
                              : "white",
                          cursor: isShowtime1Clickable ? "pointer" : "not-allowed",
                        }}
                        onClick={() =>
                          handleShowtimeSelect(
                            showtime.showtime_slot_1,
                            isShowtime1Clickable
                          )
                        }
                      >
                        <CardContent>
                          <Typography>
                            {showtime1.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card
                        style={{
                          backgroundColor:
                            selectedShowtime === showtime.showtime_slot_2
                              ? "blue"
                              : "white",
                          cursor: isShowtime2Clickable ? "pointer" : "not-allowed",
                        }}
                        onClick={() =>
                          handleShowtimeSelect(
                            showtime.showtime_slot_2,
                            isShowtime2Clickable
                          )
                        }
                      >
                        <CardContent>
                          <Typography>
                            {showtime2.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card
                        style={{
                          backgroundColor:
                            selectedShowtime === showtime.showtime_slot_3
                              ? "blue"
                              : "white",
                          cursor: isShowtime3Clickable ? "pointer" : "not-allowed",
                        }}
                        onClick={() =>
                          handleShowtimeSelect(
                            showtime.showtime_slot_3,
                            isShowtime3Clickable
                          )
                        }
                      >
                        <CardContent>
                          <Typography>
                            {showtime3.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card
                        style={{
                          backgroundColor:
                            selectedShowtime === showtime.showtime_slot_4
                              ? "blue"
                              : "white",
                          cursor: isShowtime4Clickable ? "pointer" : "not-allowed",
                        }}
                        onClick={() =>
                          handleShowtimeSelect(
                            showtime.showtime_slot_4,
                            isShowtime4Clickable
                          )
                        }
                      >
                        <CardContent>
                          <Typography>
                            {showtime4.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
              <Typography variant="h5" component="h2" style={{ marginTop: "2rem" ,color:"blue",fontWeight:"600"}}>
                Choose Date
              </Typography>
              <Typography variant="p" style={{color:"grey"}}>
                  **Select calendar icon to choose date.Deselct the icon to close it.
                  </Typography>
                  <br/>
              <CustomDatePicker selectedDate={selectedDate} handleDateChange={handleDateChange} />
               <br/>
              <Button variant="contained" color="primary" onClick={handleBookTicket}>
                Choose Seat
              </Button>
              {showDetails && (
                <>
                  <Typography variant="h5" component="h2" style={{ marginTop: "2rem" }}>
                    Show Details
                  </Typography>
                  
                  <Card>
                    <CardContent>
                      <Typography>
                        Date: {selectedDate.toLocaleDateString()}
                        <br />
                        Time:{" "}
                        {selectedShowtime
                          ? new Date(selectedShowtime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Not selected"}
                      </Typography>
                    </CardContent>
                  </Card>
                </>
              )}
            </Grid>
          </Grid>
        </div>
      )}
    </Container>
  );
};

export default MovieDetails;
