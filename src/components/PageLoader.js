import React from 'react';
import { Box } from '@mui/material';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading-anim.json'; 

const PageLoader = () => (
  <Box
    sx={{
      height: '100vh',
      width: '100%',
      background: 'linear-gradient(to bottom right, #fff4d1ff, #ff9f82ff, #ff9f82ff)',
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
