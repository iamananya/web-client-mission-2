import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hashedPassword = CryptoJS.SHA256(password).toString();
    // Create a new form data object with the hashed password
    const formData = {
      email,
      password: hashedPassword,
    };
   
    axios.post('http://localhost:9010/login', formData,{
      withCredentials:true
        })
      .then(response => {
        console.log(response.headers);
       // Get the session ID from the response
       const sessionID = response.headers['session-id'];
       if (sessionID) {
        console.log(sessionID)
    

        document.cookie = `session-id=${encodeURI(sessionID)}; path=/`;
          console.log('Session ID:', document.cookie);
        // Continue with further actions

      } else {
        console.log('Session ID not found in response headers');
        // Handle the case where session ID is not present
      }
       // Set the session ID as a cookie
       // Redirect to the movie page
      //  setTimeout(() => {
      //    window.location.href = '/movies'; // Redirect to '/movies' after 10 seconds
      //  }, 10000);
      })
      .catch(error => {
        if (error.response && error.response.status === 307) {
          const redirectUrl = error.response.headers.location;
          // Follow the redirect by making a new request to the provided URL
          axios.post(redirectUrl, formData)
            .then(response => {
              console.log(response.data);
              // Handle successful response
            })
            .catch(error => {
              console.error(error);
              // Handle error after following the redirect
            });
        } else {
          console.error(error);
          // Handle other errors
        }});
  };

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Welcome Back !!
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => 
              setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            fullWidth
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
