import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Dialog, DialogTitle, DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import './index.css';
import { styled } from '@mui/material/styles';
import logo from './assets/logo.png';
import Footer from './footer';
import { forgotPassword, resetPassword } from './services/authService';


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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [tokenConfirmed, setTokenConfirmed] = useState(false);
  const [rePassword, setRePassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [message, setMessage] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const verified = queryParams.get('verified');
  const [verifyMsg, setVerifyMsg] = useState(
    verified === 'success' ? 'Your email has been verified!' :
    verified === 'fail' ? 'Invalid or expired verification link.' :
    verified === 'error' ? 'Server error during verification.' :
    ''
  );
  
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('resetToken');
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      setForgotOpen(true);
      setStep(3);
      setTokenConfirmed(true);
      const newUrl = location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3001/api/users/login', { email, password })
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
  const handleForgot = async () => {
    try {
      await forgotPassword(email);
      setMessage('Reset link sent to email. Use the token from email to confirm.');
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending reset link');
    }
  };

  const handleConfirm = () => {
    if (!resetToken) return setMessage("Enter token to proceed");
    setTokenConfirmed(true);
    setStep(3);
  };

  const handleReset = async () => {
    if (password !== rePassword) return setMessage("Passwords don't match");

    try {
      await resetPassword(resetToken, password);
      setMessage('Password reset successful!');
      setTimeout(() => {
        setForgotOpen(false);
        setStep(1);
        setEmail('');
        setPassword('');
        setRePassword('');
        setResetToken('');
        setTokenConfirmed(false);
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <GradientBackground>
      {verifyMsg && (
        <Alert
          severity={verified === 'success' ? 'success' : 'error'}
          onClose={() => setVerifyMsg('')}
          sx={{ mb: 2 }}
        >
          {verifyMsg}
        </Alert>
      )}
      <CenterContent>
        <LoginCard elevation={5}>
          <LogoImage src={logo} alt="Site Logo" />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Login to Your Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <Typography sx={{ mt: 1, cursor: 'pointer' }} onClick={() => setForgotOpen(true)}>
                Forgot Password?
              </Typography>

              <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>
                  {step === 1 ? 'Forgot Password' : step === 2 ? 'Confirm Reset Link' : 'Reset Password'}
                </DialogTitle>

                <DialogContent dividers>
                  {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
                  {step === 1 && (
                    <TextField
                      label="Enter your email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  )}
                  {step === 2 && (
                    <TextField
                      label="Enter Token (from email)"
                      fullWidth
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                    />
                  )}
                  {step === 3 && tokenConfirmed && (
                    <>
                      <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        sx={{ mt: 1 }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <TextField
                        label="Re-enter Password"
                        type="password"
                        fullWidth
                        sx={{ mt: 2 }}
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                      />
                    </>
                  )}
                </DialogContent>

                <DialogActions>
                  {step === 1 && (
                    <Button onClick={handleForgot} variant="contained" color="primary">Send Link</Button>
                  )}
                  {step === 2 && (
                    <Button onClick={handleConfirm} variant="contained" color="warning">Confirm</Button>
                  )}
                  {step === 3 && (
                    <Button onClick={handleReset} variant="contained" color="success">Reset Password</Button>
                  )}
                </DialogActions>
              </Dialog>
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
