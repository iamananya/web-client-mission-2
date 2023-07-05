import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const VerifyEmail = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Send a GET request to the backend to verify the email
        const response = await axios.get(`http://localhost:9010/verify-email?token=${token}`);
        console.log(token)

        if (response.status === 200) {
          Swal.fire({
            title: 'Email Verified',
            text: 'Your email has been verified successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate('/login'); // Redirect to the login page
          });
        } else {
          Swal.fire({
            title: 'Email Verification Failed',
            text: 'Failed to verify your email. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate('/'); // Redirect to the home page or another appropriate page
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/'); // Redirect to the home page or another appropriate page
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {isLoading ? (
        <Typography variant="h5">Verifying your email...</Typography>
      ) : (
        <Typography variant="h5">Email verification failed. Please try again.</Typography>
      )}
    </Container>
  );
};

export default VerifyEmail;
