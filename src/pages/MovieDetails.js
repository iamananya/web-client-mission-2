// MovieDetails.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Container, Typography, Card, CardContent, Grid, Pagination, Calendar, Button } from '@mui/material';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
 
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        axios.defaults.withCredentials = true;
      
        const sessionID = getCookie("session-id");
        console.log(movieId,sessionID)
        console.log("Session ID in movie details",sessionID)
        const response = await axios.get(`http://localhost:9010/movies/${movieId}`, {
          headers: {
            'Session-ID': sessionID,
          },
          withCredentials:true

        });
      
        if (response.status === 200) {
          // Request successful, retrieve the movie details
          console.log(response.data)
        } else {
          // Handle other status codes
          setMovie(null);
        }
      } catch (error) {
        console.error('Error:', error);
        setMovie(null);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleBookTicket = () => {
    // Perform ticket booking or any other action
    console.log('Ticket booked!');
  };

  if (!movie) {
    return (
      <Container>
        <Typography variant="h4" component="h1">
          Movie Details
        </Typography>
        <Typography variant="body1" component="p">
          Loading movie details...
        </Typography>
      </Container>
    );
  }
  return (
    <Container>
      <Typography variant="h4" component="h1">
        Movie Details
      </Typography>

      <Card style={{ marginTop: '2rem' }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {movie.title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Genre: {movie.genre}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Rating: {movie.rating}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" component="h2" style={{ marginTop: '2rem' }}>
        Show Timings
      </Typography>

      <Grid container spacing={2} style={{ marginTop: '1rem' }}>
        {movie.showtimes.map((showtime) => (
          <Grid item xs={12} sm={6} md={3} key={showtime.ID}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {new Date(showtime.showtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" component="h2" style={{ marginTop: '2rem' }}>
        Choose Date
      </Typography>

      <DatePicker selected={selectedDate} onChange={handleDateChange} />
      <Button variant="contained" color="primary" onClick={handleBookTicket}>
        Book Ticket
      </Button>
    </Container>
  );
};

export default MovieDetails;
