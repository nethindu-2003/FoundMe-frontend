// PostSelect.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper
} from '@mui/material';
import './index.css';
import { styled } from '@mui/material/styles';
import Header from './header';
import Footer from './footer';


const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const BackgroundWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'transparent',
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  textAlign: 'center',
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 700,
  width: '100%',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
}));

const PostSelect = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Header />
      <BackgroundWrapper>
        <ContentWrapper maxWidth="md">
          <GlassCard>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
              What would you like to post?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#475569' }}>
              Choose whether you want to post a Lost Item or Found Item. Help your university community reconnect with their belongings.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
              <Button
                variant="contained"
                color="warning"
                size="large"
                sx={{ borderRadius: 3, px: 4 }}
                onClick={() => navigate('/lost')}
              >
                Lost Item
              </Button>
              <Button
                variant="outlined"
                color="warning"
                size="large"
                sx={{ borderRadius: 3, px: 4 }}
                onClick={() => navigate('/found')}
              >
                Found Item
              </Button>
            </Stack>
          </GlassCard>
        </ContentWrapper>
      </BackgroundWrapper>
      <Footer />
    </PageContainer>
  );
};

export default PostSelect;
