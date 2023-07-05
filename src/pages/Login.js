import React, { useState } from 'react';
import { Container, Typography, TextField, Button, IconButton } from '@mui/material';
import { Send as SendIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn, showID }) => {
  const navigate = useNavigate();
  const [isEmailVerified, setIsEmailVerified] = useState(false); // Define isEmailVerified state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hashedPassword = CryptoJS.SHA256(password).toString();
    // Create a new form data object with the hashed password
    const formData = {
      email,
      password: hashedPassword,
    };

    axios
      .post('http://localhost:9010/login', formData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        const { message, user_id, is_email_verified } = response.data;
        console.log('response', response.data);
        setIsEmailVerified(is_email_verified); // Set the isEmailVerified state based on the response
        localStorage.setItem('user_id', user_id);

        // Get the session ID from the response
        const sessionID = response.headers['session-id'];
        if (sessionID) {
          console.log(sessionID);

          document.cookie = `session-id=${encodeURI(sessionID)}; path=/`;
          console.log('Session ID:', document.cookie);
          // Continue with further actions
          Swal.fire({
            title: message,
            text: 'Redirecting to movie details page...',
            icon: 'success',
            showConfirmButton: false,
          });

          // Redirect to the movie page after 3 seconds
          setIsLoggedIn(true);

          // Redirect to movies page
          navigate('/movies/');
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
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Invalid email or password
          Swal.fire({
            title: 'Invalid Credentials',
            text: 'Please enter a valid email and password.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else if (error.response && error.response.status === 403) {
          setIsEmailVerified(true);
          console.log('verify', isEmailVerified);
          if (isEmailVerified) {
            // Email verified but invalid credentials
            Swal.fire({
              title: 'Invalid Password',
              text: 'Please enter valid password.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        } else if (error.response && error.response.status === 417) {
          // Email not verified
          Swal.fire({
            title: 'Email Not Verified',
            text: `Please check email address ${email}. Your email address is not verified.`,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else if (error.response && error.response.status === 307) {
          const redirectUrl = error.response.headers.location;
          // Follow the redirect by making a new request to the provided URL
          axios
            .post(redirectUrl, formData)
            .then((response) => {
              console.log(response.data);
              // Handle successful response
            })
            .catch((error) => {
              console.error(error);
              // Handle error after following the redirect
            });
        } else {
          console.error(error);
          // Handle other errors
        }
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <Button type="submit" variant="contained" endIcon={<SendIcon />} fullWidth>
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
