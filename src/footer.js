import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterWrapper = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4b1e1e 0%, #7a3e2f 50%, #3a0e0e 100%)',
  color: '#f8fafc',
  padding: theme.spacing(2, 1), // reduced padding (top/bottom 16px, left/right 8px)
  textAlign: 'center',
  fontFamily: 'Inter, sans-serif',
  boxShadow: '0 -3px 8px rgba(0, 0, 0, 0.3)', // slightly smaller shadow
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: '#fbbf24',
  fontWeight: 500,
  textDecoration: 'underline',
  fontSize: '0.85rem', // smaller font size for link
  '&:hover': {
    color: '#fffefcff',
  },
}));

const Footer = () => (
  <FooterWrapper>
    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
      &copy; {new Date().getFullYear()} University of Kelaniya - Lost & Found Portal
    </Typography>
    <Typography variant="caption" display="block" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
      Developed by Department of Industrial Management |{' '}
      <StyledLink href="/adminlogin">Admin Login</StyledLink>
    </Typography>
  </FooterWrapper>
);

export default Footer;
