import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Alert } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import CryptoJS from 'crypto-js';

import axios from 'axios';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    try {

      const hashedPassword = CryptoJS.SHA256(password).toString();

       // Send a POST request to the registration endpoint
      const response = await axios.post('http://localhost:9010/register', {
        name,
        email,
        password:hashedPassword,
      });

      if (response.status === 200) {
        setIsRegistered(true);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setIsRegistered(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsRegistered(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Typography variant="h4" component="h1" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Welcome to Book My Movie!!!
        </Typography>

        {isRegistered && (
          <Alert severity="success" sx={{ marginTop: '1rem' }}>
            User registered successfully!
          </Alert>
        )}

        {passwordMatchError && (
          <Alert severity="error" sx={{ marginTop: '1rem' }}>
            Passwords do not match.
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
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="confirm-password"
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" variant="contained" color="primary" sx={{ width: '100%' }}  endIcon={<SendIcon />}>
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default SignUp;
