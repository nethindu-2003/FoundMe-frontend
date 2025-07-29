import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from '@mui/material';
import './index.css';
import { styled } from '@mui/material/styles';
import lostImage from './assets/lost.png';

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'transparent',
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const HeroSection = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(6),
  borderRadius: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column-reverse',
    textAlign: 'center',
    gap: theme.spacing(4),
  },
}));

const ImageBox = styled(Box)(({ theme }) => ({
  flex: 1,
  textAlign: 'center',
}));

const TextBox = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingRight: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    paddingRight: 0,
  },
}));

const TableSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: '#0f172a',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: theme.shadows[3],
}));

const HomePage = () => {
  const navigate = useNavigate();
  const lostRef = useRef(null);
  const foundRef = useRef(null);
  const location = useLocation();

  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    if (location.state?.scrollTo === 'lost') {
      lostRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (location.state?.scrollTo === 'found') {
      foundRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    axios.get('http://localhost:3001/api/lost')
      .then(res => setLostItems(res.data))
      .catch(err => console.error('Error fetching lost items:', err));

    axios.get('http://localhost:3001/api/found')
      .then(res => setFoundItems(res.data))
      .catch(err => console.error('Error fetching found items:', err));
  }, [location]);

  return (
    <GradientBackground>
      <Header />
      <MainContent>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <HeroSection>
            <TextBox>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#bf360c', mb: 2 }}>
                Getting lost isn’t the end—
                <span style={{ color: '#0284c7' }}> finding</span> is just the beginning!
              </Typography>
              <Typography variant="body1" sx={{ color: '#374151', mb: 3 }}>
                Use this portal to reconnect lost and found items at the University of Kelaniya. Quick, easy, and secure.
              </Typography>
              <Button variant="contained" color="error" size="large" sx={{ borderRadius: 2 }} onClick={() => navigate('/howitworks')}>
                How it Works
              </Button>
            </TextBox>
            <ImageBox>
              <img src={lostImage} alt="Lost & Found" style={{ maxWidth: '100%', height: 'auto' }} />
            </ImageBox>
          </HeroSection>

          {/* Lost Items */}
          <TableSection ref={lostRef}>
            <SectionTitle variant="h5">Lost Items</SectionTitle>
            <StyledTableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#fef3c7' }}>
                  <TableRow>
                    <TableCell><b>Item Name</b></TableCell>
                    <TableCell><b>Date & Time</b></TableCell>
                    <TableCell><b>Location Lost</b></TableCell>
                    <TableCell><b>Owner Name</b></TableCell>
                    <TableCell><b>Contact</b></TableCell>
                    <TableCell><b>Description</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lostItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.lostitem}</TableCell>
                      <TableCell>{item.lostdatetime}</TableCell>
                      <TableCell>{item.lostlocation}</TableCell>
                      <TableCell>{item.ownername}</TableCell>
                      <TableCell>{item.ownerphonenumber}</TableCell>
                      <TableCell>{item.lostdescription}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </TableSection>

          {/* Found Items */}
          <TableSection ref={foundRef}>
            <SectionTitle variant="h5">Found Items</SectionTitle>
            <StyledTableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#ede7f6' }}>
                  <TableRow>
                    <TableCell><b>Item Name</b></TableCell>
                    <TableCell><b>Date & Time</b></TableCell>
                    <TableCell><b>Location Found</b></TableCell>
                    <TableCell><b>Finder Contact</b></TableCell>
                    <TableCell><b>Description</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {foundItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.founditem}</TableCell>
                      <TableCell>{item.founddatetime}</TableCell>
                      <TableCell>{item.foundlocation}</TableCell>
                      <TableCell>{item.findercontact}</TableCell>
                      <TableCell>{item.founddescription}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </TableSection>
        </Container>
      </MainContent>
      <Footer />
    </GradientBackground>
  );
};

export default HomePage;
