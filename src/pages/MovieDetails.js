// MovieDetails.js

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
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

const MovieDetails = ({isLoggedIn,handleTicketDetails,handleShowDetails}) => {
  const { movieId } = useParams();
  const [show, setShow] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
       
        const response = await axios.get(
          `http://localhost:9010/movies/${movieId}`,
          
        
        );

        if (response.status === 200) {
          // Request successful, retrieve the movie details
          setShow(response.data);
          console.log(response.data);
        } else {
          // Handle other status codes
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

  handleShowDetails(movieId);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
  };

  const handleBookTicket = () => {
    if(isLoggedIn){
    if (selectedShowtime && selectedDate) {
      console.log(selectedShowtime);
      // Perform ticket booking or any other action with selectedShowtime and selectedDate
      console.log("Ticket booked!", selectedShowtime, selectedDate);
      handleTicketDetails(selectedShowtime,selectedDate)
      setShowDetails(true);
      navigate("/seating")
    } else {
      console.log("Please select a showtime and date.");
      Swal.fire({
        icon: "warning",
        title: "Reminder",
        text: "Please choose a showtime before proceeding.",
      });
    }
  }else{
    navigate("/login")
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
  return (
    <Container style={{padding:"5%"}}>
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
              <Typography variant="h4" component="h1">
                {show.title}
              </Typography>
              <Typography variant="body1" component="p">
                {show.desc}
              </Typography>
              <Typography
                variant="h5"
                component="h2"
               
              >
                Show Timings
              </Typography>
              <Grid container spacing={2} style={{margin:"0px",padding:"2%" }}>
                
                {show.shows.map((showtime) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={showtime.ID}
                    style={{ display: "contents",padding:"3%" }}
                  >
                    <Card
                      style={{
                        backgroundColor:
                          selectedShowtime === showtime.showtime_slot_1
                            ? "blue"
                            : "white",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleShowtimeSelect(showtime.showtime_slot_1)
                      }
                    >
                      <CardContent>
                        <Typography>
                          {new Date(
                            showtime.showtime_slot_1
                          ).toLocaleTimeString([], {
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
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleShowtimeSelect(showtime.showtime_slot_2)
                      }
                    >
                      <CardContent>
                        <Typography>
                          {new Date(
                            showtime.showtime_slot_2
                          ).toLocaleTimeString([], {
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
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleShowtimeSelect(showtime.showtime_slot_3)
                      }
                    >
                      <CardContent>
                        <Typography>
                          {new Date(
                            showtime.showtime_slot_3
                          ).toLocaleTimeString([], {
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
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleShowtimeSelect(showtime.showtime_slot_4)
                      }
                    >
                      <CardContent>
                        <Typography>
                          {new Date(
                            showtime.showtime_slot_4
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Typography
                variant="h5"
                component="h2"
                style={{ marginTop: "2rem" }}
              >
                Choose Date
              </Typography>

              <DatePicker selected={selectedDate} onChange={handleDateChange} />
              <Button
                variant="contained"
                color="primary"
                onClick={handleBookTicket}
              >
                 Choose Seat
              </Button>

              {showDetails && (
                <>
                  <Typography
                    variant="h5"
                    component="h2"
                    style={{ marginTop: "2rem" }}
                  >
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
