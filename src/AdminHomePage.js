import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, IconButton, Link
} from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import logo from './assets/logo.png';

const GradientWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(to bottom right, #ffe082, #ff7043, #ff8a65)',
}));

const LogoImage = styled('img')(({ theme }) => ({
  height: 80,
  marginBottom: theme.spacing(2),
}));

const DashboardContent = styled(Container)(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.15)',
  marginBottom: theme.spacing(6),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: 12,
  overflow: 'hidden',
}));

const Footer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4b1e1e 0%, #7a3e2f 50%, #3a0e0e 100%)',
  color: '#f8fafc',
  padding: theme.spacing(2, 1), // reduced padding (top/bottom 16px, left/right 8px)
  textAlign: 'center',
  fontFamily: 'Inter, sans-serif',
  boxShadow: '0 -3px 8px rgba(0, 0, 0, 0.3)', // slightly smaller shadow
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: '#fbbf24',
  fontWeight: 500,
  textDecoration: 'underline',
  fontSize: '0.85rem', // smaller font size for link
  '&:hover': {
    color: '#fffefcff',
  },
}));

const AdminHomePage = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ id: '', collection: '' });
  const [type, setType] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const lost = await axios.get('http://localhost:3001/api/lost');
    const found = await axios.get('http://localhost:3001/api/found');
    setLostItems(lost.data);
    setFoundItems(found.data);
  };

  const handleDelete = (id, collection) => {
    setDeleteInfo({ id, collection });
    setConfirmDelete(true);
  };

  const confirmDeleteItem = async () => {
    const { id, collection } = deleteInfo;
    await axios.delete(`http://localhost:3001/api/${collection}/${id}`);
    setConfirmDelete(false);
    fetchData();
  };

  const handleUpdate = (item, collection) => {
    setEditItem(item);
    setType(collection);
    setDialogOpen(true);
  };

  const handleDialogSave = async () => {
    await axios.put(`http://localhost:3001/api/${type}/${editItem._id}`, editItem);
    setDialogOpen(false);
    fetchData();
  };

  const renderTable = (data, category) => (
    <SectionCard>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#bf360c' }}>
        {category === 'lost' ? 'Lost Items' : 'Found Items'}
      </Typography>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f59e0b' }}>
            <TableRow>
              {category === 'lost' ? (
                <>
                  <TableCell sx={{ color: 'white' }}>Item</TableCell>
                  <TableCell sx={{ color: 'white' }}>Date & Time</TableCell>
                  <TableCell sx={{ color: 'white' }}>Location</TableCell>
                  <TableCell sx={{ color: 'white' }}>Owner</TableCell>
                  <TableCell sx={{ color: 'white' }}>Phone</TableCell>
                  <TableCell sx={{ color: 'white' }}>Description</TableCell>
                </>
              ) : (
                <>
                  <TableCell sx={{ color: 'white' }}>Item</TableCell>
                  <TableCell sx={{ color: 'white' }}>Date & Time</TableCell>
                  <TableCell sx={{ color: 'white' }}>Location</TableCell>
                  <TableCell sx={{ color: 'white' }}>Contact</TableCell>
                  <TableCell sx={{ color: 'white' }}>Description</TableCell>
                </>
              )}
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(item => (
              <TableRow key={item._id}>
                {category === 'lost' ? (
                  <>
                    <TableCell>{item.lostitem}</TableCell>
                    <TableCell>{item.lostdatetime}</TableCell>
                    <TableCell>{item.lostlocation}</TableCell>
                    <TableCell>{item.ownername}</TableCell>
                    <TableCell>{item.ownerphonenumber}</TableCell>
                    <TableCell>{item.lostdescription}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{item.founditem}</TableCell>
                    <TableCell>{item.founddatetime}</TableCell>
                    <TableCell>{item.foundlocation}</TableCell>
                    <TableCell>{item.findercontact}</TableCell>
                    <TableCell>{item.founddescription}</TableCell>
                  </>
                )}
                <TableCell>
                  <IconButton onClick={() => handleUpdate(item, category)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item._id, category)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </SectionCard>
  );

  return (
    <GradientWrapper>
      <DashboardContent>
        <center><LogoImage src={logo} alt="Site Logo" /></center>
        <Typography variant="h4" align="center" sx={{ fontWeight: 800, color: '#0f172a', mb: 4 }}>
          Admin Dashboard
        </Typography>

        {renderTable(lostItems, 'lost')}
        {renderTable(foundItems, 'found')}
      </DashboardContent>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update {type === 'lost' ? 'Lost' : 'Found'} Item</DialogTitle>
        <DialogContent>
          {Object.keys(editItem || {}).map((key) =>
            ['_id', '__v'].includes(key) ? null : (
              <TextField
                key={key}
                label={key}
                fullWidth
                margin="dense"
                value={editItem[key]}
                onChange={(e) => setEditItem({ ...editItem, [key]: e.target.value })}
              />
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDialogSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDeleteItem}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Footer */}
      <Footer>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} University of Kelaniya - Lost & Found Portal
        </Typography>
        <Typography variant="caption" display="block">
          Developed by Department of Industrial Management |{' '}
          <StyledLink onClick={() => {
            localStorage.removeItem('isAdminLoggedIn');
            window.location.href = '/';
          }} variant="outlined" color="error">
            Logout
          </StyledLink>

        </Typography>
      </Footer>
    </GradientWrapper>
  );
};

export default AdminHomePage;
