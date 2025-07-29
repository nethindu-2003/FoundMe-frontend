import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Stack,
  Link,
  Snackbar,
  Alert,
} from '@mui/material';
import './index.css';
import { styled } from '@mui/material/styles';
import logo from './assets/logo.png';
import Footer from './footer';

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

const LoginCard = styled(Paper)(({ theme }) => ({
  borderRadius: 24,
  padding: theme.spacing(5),
  backgroundColor: 'rgba(255, 243, 224, 0.6)',
  boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
  maxWidth: 400,
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

const FooterWrapper = styled(Box)(({ theme }) => ({
  flexShrink: 0,
}));

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3001/api/users/login', { username, password })
      .then((res) => {
        if (res.data.success) {
          setErrorMsg('');
          setOpenSnackbar(true);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(res.data.user));
          navigate('/homepage');
        }
      })
      .catch((err) => {
        setErrorMsg(err.response?.data?.error || 'Login failed');
        setOpenSnackbar(true);
      });
  };

  return (
    <GradientBackground>
      <CenterContent>
        <LoginCard elevation={5}>
          <LogoImage src={logo} alt="Site Logo" />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Login to Your Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <StyledButton type="submit" variant="contained" color="error">
                Login
              </StyledButton>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Don’t have an account?{' '}
                <Link href="/signup" underline="hover" sx={{ fontWeight: 'bold', color: '#bf360c' }}>
                  Sign up
                </Link>
              </Typography>
            </Stack>
          </form>
        </LoginCard>
      </CenterContent>

      <FooterWrapper>
        <Footer />
      </FooterWrapper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={errorMsg ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {errorMsg || 'Login successful!'}
        </Alert>
      </Snackbar>
    </GradientBackground>
  );
};

export default Login;
