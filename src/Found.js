// FoundItemForm.js
import React, { useState, useRef  } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Snackbar, 
  Alert,
} from '@mui/material';
import './index.css';
import { styled } from '@mui/material/styles';
import Header from './header';
import Footer from './footer';
import  axios from 'axios';
import logo from './assets/logo.png';

const BackgroundWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'transparent',
}));

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const FormBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  width: '100%',
  borderRadius: 16,
  boxShadow: theme.shadows[3],
}));

const Found = () => {
  const itemRef = useRef(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [founditem,setFounditem] = useState('');
  const [founddatetime,setFounddatetime] = useState('');
  const [foundlocation,setFoundlocation] = useState('');
  const [findercontact,setFindercontact] = useState('');
  const [founddescription,setFounddescription] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(findercontact)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }
    const selectedDate = new Date(founddatetime);
    const now = new Date();
    if (selectedDate > now) {
      alert('Found date and time cannot be in the future.');
      return;
    }

    if (loading) return;
    setLoading(true);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
      console.error("User not found or invalid in localStorage");
      return;
    }

    axios.post('http://localhost:3001/api/found/found',{founditem,founddatetime,foundlocation,findercontact,founddescription,email: user.email,})
    .then(result => {
      console.log(result)
      // Clear inputs
      setFounditem('');
      setFounddatetime('');
      setFoundlocation('');
      setFindercontact('');
      setFounddescription('');
      // Focus back to item field
      itemRef.current.focus();
      setOpenSnackbar(true); // Show message
    })
    .catch(err => console.log(err))
    .finally(() => setLoading(false));
  };


  return (
    <PageContainer>
      <Header />
      <BackgroundWrapper>
      <ContentWrapper maxWidth="md">
        <FormBox elevation={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <img src={logo} alt="Logo" style={{ height: 60, marginBottom: 8 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Submit a Found Item
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Item Name"
                name="item"
                fullWidth
                inputRef={itemRef}
                value={founditem}
                onChange={(e) => setFounditem(e.target.value)}
                required
              />
              <TextField
                label="Date and Time"
                name="dateTime"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={founddatetime}
                onChange={(e) => setFounddatetime(e.target.value)}
                required
              />
              <TextField
                label="Location Found"
                name="location"
                fullWidth
                value={foundlocation}
                onChange={(e) => setFoundlocation(e.target.value)}
                required
              />
              <TextField
                label="Finder Contact Details"
                name="contact"
                fullWidth
                value={findercontact}
                onChange={(e) => setFindercontact(e.target.value)}
                required
              />
              <TextField
                label="Description"
                name="description"
                multiline
                rows={4}
                fullWidth
                value={founddescription}
                onChange={(e) => setFounddescription(e.target.value)}
                required
              />
              <Button variant="contained" color="warning" type="submit" size="large" sx={{ borderRadius: 2 }} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </Stack>
          </form>
        </FormBox>
      </ContentWrapper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Found item submitted successfully!
        </Alert>
      </Snackbar>
      </BackgroundWrapper>
      <Footer />
    </PageContainer>
  );
};

export default Found;
