// LostItemForm.js
import React, { useState, useRef } from 'react';
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
import axios from 'axios';
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
  maxWidth: 700,
  width: '100%',
  borderRadius: 20,
  boxShadow: theme.shadows[5],
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  position: 'relative',
  overflow: 'hidden',
}));

const Lost = () => {
  const itemRef = useRef(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [lostitem, setLostitem] = useState('');
  const [lostdatetime, setLostdatetime] = useState('');
  const [lostlocation, setLostlocation] = useState('');
  const [ownername, setOwnername] = useState('');
  const [ownerphonenumber, setOwnerphonenumber] = useState('');
  const [lostdescription, setLostdescription] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(ownerphonenumber)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }

    if (loading) return;
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
      console.error("User not found or invalid in localStorage");
      return;
    }
    axios
      .post('http://localhost:3001/api/lost/lost', {
        lostitem,
        lostdatetime,
        lostlocation,
        ownername,
        ownerphonenumber,
        lostdescription,
        email: user.email,
      })
      .then((result) => {
        setLostitem('');
        setLostdatetime('');
        setLostlocation('');
        setOwnername('');
        setOwnerphonenumber('');
        setLostdescription('');
        itemRef.current.focus();
        setOpenSnackbar(true);
      })
      .catch((err) => console.log(err))
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
                Submit a Lost Item
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Item Name"
                  name="item"
                  fullWidth
                  inputRef={itemRef}
                  value={lostitem}
                  onChange={(e) => setLostitem(e.target.value)}
                  required
                />
                <TextField
                  label="Date and Time"
                  name="dateTime"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={lostdatetime}
                  onChange={(e) => setLostdatetime(e.target.value)}
                  required
                />
                <TextField
                  label="Location Lost"
                  name="location"
                  fullWidth
                  value={lostlocation}
                  onChange={(e) => setLostlocation(e.target.value)}
                  required
                />
                <TextField
                  label="Owner Name"
                  name="owner"
                  fullWidth
                  value={ownername}
                  onChange={(e) => setOwnername(e.target.value)}
                  required
                />
                <TextField
                  label="Contact Details"
                  name="contact"
                  fullWidth
                  value={ownerphonenumber}
                  onChange={(e) => setOwnerphonenumber(e.target.value)}
                  required
                />
                <TextField
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  fullWidth
                  value={lostdescription}
                  onChange={(e) => setLostdescription(e.target.value)}
                  required
                />
                <Button
                  variant="contained"
                  color="warning"
                  type="submit"
                  size="large"
                  sx={{ borderRadius: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
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
            Lost item submitted successfully!
          </Alert>
        </Snackbar>
      </BackgroundWrapper>
      <Footer />
    </PageContainer>
  );
};

export default Lost;
