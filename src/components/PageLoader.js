// components/PageLoader.js
import React from 'react';
import { Box } from '@mui/material';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading-anim.json'; // Replace with your file

const PageLoader = () => (
  <Box
    sx={{
      height: '100vh',
      width: '100%',
      background: 'linear-gradient(to bottom right, #ffe082, #ff7043, #ff8a65)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}
  >
    <Box sx={{ width: 200 }}>
      <Lottie animationData={loadingAnimation} loop />
    </Box>
  </Box>
);

export default PageLoader;
