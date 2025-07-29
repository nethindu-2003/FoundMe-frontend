import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import './index.css';
import { styled } from '@mui/material/styles';
import Footer from './footer';
import logo from './assets/logo.png';

const BackgroundWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'transparent',
}));

const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const LoginContent = styled(Container)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const LoginBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(5px)',
  maxWidth: 400,
  width: '100%',
  borderRadius: 20,
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  textAlign: 'center',
}));

const LogoImage = styled('img')(({ theme }) => ({
  height: 80,
  marginBottom: theme.spacing(2),
}));

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
      navigate('/adminhomepage');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'Admin@123') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/adminhomepage');
    } else {
      setErrorMsg('Invalid admin credentials');
      setOpenSnackbar(true);
    }
  };

  return (
    <BackgroundWrapper>
      <LoginContainer>
        <LoginContent>
          <LoginBox elevation={3}>
            <LogoImage src={logo} alt="Site Logo" />
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Admin Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="warning"
                  size="large"
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                  Login
                </Button>
              </Stack>
            </form>
          </LoginBox>
        </LoginContent>
        <Footer />
      </LoginContainer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </BackgroundWrapper>
  );
};

export default AdminLogin;
