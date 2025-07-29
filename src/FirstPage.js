// FirstPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './footer';
import { Box, Button, Stack, Typography, Container, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Lottie from 'lottie-react';
import './index.css';
import animationData from './assets/lost-found-anim.json';
import logo from './assets/logo.png';

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'transparent',
}));

const CenterContent = styled(Container)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const ContentCard = styled(Paper)(({ theme }) => ({
  borderRadius: 24,
  padding: theme.spacing(5),
  backgroundColor: 'rgba(255, 243, 224, 0.8)',
  boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
  textAlign: 'center',
  maxWidth: 700,
  width: '100%',
  position: 'relative',
}));

const LogoImage = styled('img')(({ theme }) => ({
  display: 'block',
  margin: '0 auto',
  height: 80,
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  paddingInline: theme.spacing(3),
  paddingBlock: theme.spacing(1),
  fontWeight: 'bold',
  fontSize: '0.875rem',
}));

const FirstPage = () => {
  const navigate = useNavigate();

  return (
    <GradientBackground>
      {/* Main Content */}
      <CenterContent>
        <ContentCard elevation={5}>
          <LogoImage src={logo} alt="Site Logo" />
          <Box sx={{ maxWidth: 320, mx: 'auto', mb: 2 }}>
            <Lottie animationData={animationData} loop />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#bf360c', mb: 2 }}>
            Welcome to the Lost & Found Portal
          </Typography>
          <Typography variant="body1" sx={{ color: '#5d4037', mb: 4 }}>
            Report and recover lost belongings across the University of Kelaniya quickly and safely.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <StyledButton variant="contained" color="error" onClick={() => navigate('/login')}>
              Login
            </StyledButton>
            <StyledButton variant="outlined" color="warning" onClick={() => navigate('/signup')}>
              Sign Up
            </StyledButton>
          </Stack>
        </ContentCard>
      </CenterContent>

      {/* Footer */}
      <Footer />
    </GradientBackground>
  );
};

export default FirstPage;
