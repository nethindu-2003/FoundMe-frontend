// Header.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import logo from './assets/logo.png';

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(to right, #ff7043, #e53935)',
  fontFamily: 'Inter, sans-serif',
}));

const HeaderButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  fontWeight: 500,
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.875rem',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  const handleNavigate = (target) => {
    navigate('/homepage', { state: { scrollTo: target } });
    setDrawerOpen(false);
  };

  return (
    <GradientAppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {/* Logo and title on the left */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box component="img" src={logo} alt="Logo" sx={{ height: 60 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#fff' }}>
              Lost & Found - UoK
            </Typography>
          </Box>

          {/* Right side buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <HeaderButton onClick={() => navigate('/homepage')}>Home</HeaderButton>
            <HeaderButton onClick={() => handleNavigate('lost')}>Lost Items</HeaderButton>
            <HeaderButton onClick={() => handleNavigate('found')}>Found Items</HeaderButton>
            <HeaderButton onClick={() => navigate('/post')}>Post</HeaderButton>
            <HeaderButton onClick={() => {localStorage.removeItem('isLoggedIn'); navigate('/');}}>Logout</HeaderButton>
          </Box>

          {/* Menu icon for mobile */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Drawer for mobile */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
            <ListItem button onClick={() => navigate('/homepage')}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={() => handleNavigate('lost')}>
              <ListItemText primary="Lost Items" />
            </ListItem>
            <ListItem button onClick={() => handleNavigate('found')}>
              <ListItemText primary="Found Items" />
            </ListItem>
            <ListItem button onClick={() => navigate('/post')}>
              <ListItemText primary="Post" />
            </ListItem>
            <ListItem button onClick={() => {localStorage.removeItem('isLoggedIn'); navigate('/');}}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </GradientAppBar>
  );
};

export default Header;
