import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, Alert, InputAdornment, IconButton } from '@mui/material';
import { Send as SendIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Indicates whether registration is in progress
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check password strength on password change
    const checkPasswordStrength = () => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,16}$/;
      if (passwordRegex.test(password)) {
        setPasswordStrength('Strong');
      } else if (password === '') {
        setPasswordStrength('');
      } else {
        setPasswordStrength('Weak');
      }
    };

    checkPasswordStrength();
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }
    // Validate name
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      setNameError(true);
      return;
    }
    if (name.trim() === ''|| name.length > 30) {
      setNameError(true);
      return;
    }

    // Validate email format
    let emailRegex = new RegExp(
      '([!#-\'*+/-9=?A-Z^-~-]+(\\.[!#-\'*+/-9=?A-Z^-~-]+)*|"\(\[\]!#-[^-~ \\t]|(\\\\[\\t -~]))+\")@([!#-\'*+/-9=?A-Z^-~-]+(\\.[!#-\'*+/-9=?A-Z^-~-]+)*|\\[[\\t -Z^-~]*])'
    );

    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    }
    if (email.trim() === '') {
      setEmailError(true);
      return;
    }

    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,16}$/;
    if (!passwordRegex.test(password)) {
      setPasswordStrength('Weak');
      return;
    }

    try {
      setIsRegistering(true); // Set the registration flag to true

      const hashedPassword = CryptoJS.SHA256(password).toString();

      // Send a POST request to the registration endpoint
      const response = await axios.post('http://localhost:9010/register', {
        name,
        email,
        password: hashedPassword,
      });

      Swal.fire({
        title: 'Please wait',
        text: 'Please wait until the registration is successful.',
        icon: 'info',
        confirmButtonText: 'OK',
        allowOutsideClick: false, // Prevent closing the alert until registration is complete
        showLoaderOnConfirm: true // Show loading spinner in the alert
      });

      if (response.status === 201) {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        // Delay the success alert to simulate registration processing time
        setTimeout(() => {
          Swal.fire({
            title: 'Registration Successful',
            text: 'Please check your email for verification.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate('/login');
          });
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Email verification failed
        Swal.fire({
          title: 'Email Not Verified',
          text: 'Email verification failed. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else if (error.response && error.response.status === 500) {
        // Failed to create user
        Swal.fire({
          title: 'Registration Failed',
          text: 'Failed to create user. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else {
        // Other errors
        console.error(error);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } finally {
      setIsRegistering(false); // Reset the registration flag
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Typography variant="h4" component="h1" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Welcome to Book My Movie!!!
        </Typography>

        {passwordMatchError && (
          <Alert severity="error" sx={{ marginTop: '1rem', padding: '2%' }}>
            Passwords do not match.
          </Alert>
        )}
        {nameError && (
          <Alert severity="error" sx={{ marginTop: '1rem', padding: '2%' }}>
            Please enter a valid name less than 30 characters.
          </Alert>
        )}

        {emailError && (
          <Alert severity="error" sx={{ marginTop: '1rem', padding: '2%' }}>
            Please enter a valid email address.
          </Alert>
        )}
        {!passwordMatchError && passwordStrength === 'Weak' && (
          <Alert severity="error" sx={{ marginTop: '1rem', padding: '2%' }}>
            Password should contain at least one uppercase letter, one lowercase letter, one digit, one special character (!@#$%^&*()), and be 8-16 characters in length.
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="name"
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(false);
              }}
              error={nameError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
              error={emailError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordStrength(getPasswordStrength(e.target.value));
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="confirm-password"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            {password && (
              <Typography variant="body2" color={getPasswordStrengthColor(passwordStrength)}>
                Password Strength: {passwordStrength}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" variant="contained" color="primary" sx={{ width: '100%' }} endIcon={<SendIcon />}>
              {isRegistering ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default SignUp;

// Helper function to determine password strength
const getPasswordStrength = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,16}$/;
  if (passwordRegex.test(password)) {
    return 'Strong';
  } else {
    return 'Weak';
  }
};

// Helper function to determine password strength color
const getPasswordStrengthColor = (passwordStrength) => {
  return passwordStrength === 'Strong' ? 'success' : 'error';
};
