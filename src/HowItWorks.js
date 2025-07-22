// HowItWorks.js
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Header from './header';
import Footer from './footer';
import { styled } from '@mui/material/styles';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const BackgroundWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(to bottom right, #ffe082, #ff7043, #ff8a65)',
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: 20,
  maxWidth: 800,
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
}));

const HowItWorks = () => {
  return (
    <PageContainer>
      <Header />
      <BackgroundWrapper>
        <ContentWrapper>
          <Card elevation={4}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
              How the Lost & Found Portal Works
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <Typography variant="h6" sx={{ mb: 1 }}>
              Getting Started:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Sign up with your university credentials." />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Log in and navigate to the Post section." />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Choose whether you're reporting a Lost or Found item." />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Fill in the required information and submit." />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Rules & Regulations:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="error" /></ListItemIcon>
                <ListItemText primary="Only university-related lost/found items are allowed." />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="error" /></ListItemIcon>
                <ListItemText primary="Do not post fake or misleading information." />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="error" /></ListItemIcon>
                <ListItemText primary="Ensure contact details are accurate and verified." />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="error" /></ListItemIcon>
                <ListItemText primary="Admins reserve the right to remove inappropriate content." />
              </ListItem>
            </List>

            <Typography variant="body2" sx={{ mt: 4, textAlign: 'center', color: '#64748b' }}>
              Your honesty helps reunite people with their lost belongings. Be responsible.
            </Typography>
          </Card>
        </ContentWrapper>
      </BackgroundWrapper>
      <Footer />
    </PageContainer>
  );
};

export default HowItWorks;
