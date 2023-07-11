import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Grid, Pagination,CardMedia } from '@mui/material';
import axios from 'axios';

// Set default headers for Axios requests
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:9010';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, DELETE';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type';

const Movies = () => {

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:9010/movies');
        const { data } = response;
        console.log(data);
        setMovies(data);
        setTotalPages(Math.ceil(data.length / 6)); // Calculate total pages based on number of movies
      } catch (error) {
        console.error('Error:', error);
        setMovies([]);
        setTotalPages(1);
      }
    };

    fetchMovies();
  }, [page]);


  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculate the starting index and ending index of movies to display for the current page
  const startIndex = (page - 1) * 6;
  const endIndex = startIndex + 6;

  // Get the movies to display for the current page
  const moviesToDisplay = movies.slice(startIndex, endIndex);

  return (
    <Container>
      <Typography variant="h4" component="h1" align='center' mt={2}>
      <h3 style={{color:"darkblue",letterSpacing:2}}>Movies </h3>
      </Typography>

      <Grid container spacing={2} style={{ marginTop: '2rem' }}>
        {moviesToDisplay.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.ID}>
            <Card>
            <CardMedia component="img" height="200" image={movie.image} alt={movie.title} />
              <CardContent>
                <Typography variant="h6" component="h2">
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Genre: {movie.genre}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Rating: {movie.rating}
                </Typography>
                <Link  to={{ pathname: `/movies/${movie.ID}`, state: { movie } }}>View Details</Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination
        style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}
        count={totalPages}
        page={page}
        onChange={handlePageChange}
      />
    </Container>
  );
};

export default Movies;
