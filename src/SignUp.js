import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  Link,
  FormLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import './index.css';
import { styled } from '@mui/material/styles';
import Footer from './footer';
import axios from 'axios';
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
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const SignupCard = styled(Box)(({ theme }) => ({
  borderRadius: 24,
  padding: theme.spacing(5),
  backgroundColor: 'rgba(255, 243, 224, 0.6)',
  boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
  maxWidth: 500,
  width: '100%',
  textAlign: 'center',
}));

const LogoImage = styled('img')(({ theme }) => ({
  height: 80,
  marginBottom: theme.spacing(3),
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  paddingInline: theme.spacing(2),  
  paddingBlock: theme.spacing(1),   
  fontWeight: 'bold',
  fontSize: '0.875rem',           
}));

const Signup = () => {
  const navigate = useNavigate();
  const itemRef = useRef(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phonenumber)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordPattern.test(password)) {
      alert(
        'Password must include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    axios
      .post('http://localhost:3001/api/users/signup', {
        name,
        gender,
        birthday,
        phonenumber,
        username,
        password,
      })
      .then((result) => {
        console.log('Server Response:', result.data);
        setName('');
        setGender('');
        setBirthday('');
        setPhonenumber('');
        setUsername('');
        setPassword('');
        itemRef.current.focus();
        setOpenSnackbar(true);
        navigate('/login');
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          alert(err.response.data.error);
        } else {
          console.error('Signup failed:', err);
          alert('Something went wrong. Please try again.');
        }
      });
  };

  return (
    <GradientBackground>
      <CenterContent>
        <SignupCard>
          <LogoImage src={logo} alt="Site Logo" />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Create Your Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                variant="outlined"
                name="name"
                fullWidth
                inputRef={itemRef}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Box textAlign="left">
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  Gender
                </FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
              </Box>

              <TextField
                label="Birthday"
                type="date"
                name="birthday"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
              <TextField
                label="Telephone Number"
                name="phone"
                fullWidth
                required
                value={phonenumber}
                onChange={(e) => setPhonenumber(e.target.value)}
              />
              <TextField
                label="Username"
                name="username"
                fullWidth
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <StyledButton type="submit" variant="contained" color="error">
                Sign Up
              </StyledButton>

              <Typography variant="body2" sx={{ mt: 1 }}>
                Already have an account?{' '}
                <Link
                  href="/login"
                  underline="hover"
                  sx={{ fontWeight: 'bold', color: '#bf360c' }}
                >
                  Login
                </Link>
              </Typography>
            </Stack>
          </form>
        </SignupCard>
      </CenterContent>

      <Footer />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Sign Up successfully!
        </Alert>
      </Snackbar>
    </GradientBackground>
  );
};

export default Signup;
