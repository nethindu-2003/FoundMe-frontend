import React, { useEffect, useState, useRef } from 'react';
import {
  Container, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Button, ButtonGroup, Dialog, DialogTitle, DialogContent, DialogActions, Box, IconButton, Link, Chip, Stack,
} from '@mui/material';
import './index.css';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import logo from './assets/logo.png';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import UpdateDialog from './components/UpdateDialog';
import VisibilityIcon from '@mui/icons-material/Visibility';


// --- Styled Components ---
const GradientWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'transparent',
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

const StyledTableHead = styled(TableHead)({
  backgroundColor: '#fa9c0fff',
  '& th': { color: '#fff', fontWeight: 'bold' },
});

const Footer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4b1e1e 0%, #7a3e2f 50%, #3a0e0e 100%)',
  color: '#f8fafc',
  padding: theme.spacing(2, 1),
  textAlign: 'center',
  fontFamily: 'Inter, sans-serif',
  boxShadow: '0 -3px 8px rgba(0, 0, 0, 0.3)',
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: '#fbbf24',
  fontWeight: 500,
  textDecoration: 'underline',
  fontSize: '0.85rem',
  cursor: 'pointer',
  '&:hover': {
    color: '#fffefcff',
  },
}));

const PIE_COLORS = ['#4caf50', '#f44336'];

const AdminHomePage = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ id: '', collection: '' });
  const [type, setType] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const userRef = useRef(null);
  const lostRef = useRef(null);
  const foundRef = useRef(null);
  const analyticsRef = useRef(null);

  // Quick stat counts
  const lostCount = lostItems.length;
  const foundCount = foundItems.length;
  const userCount = users.length;
  const bannedCount = users.filter(u => u.isBanned).length;

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const lost = await axios.get('http://localhost:3001/api/lost');
      const found = await axios.get('http://localhost:3001/api/found');
      setLostItems(lost.data);
      setFoundItems(found.data);
    } catch (err) {
      setError('Unable to fetch item data. Please check your connection.');
    }
    setLoading(false);
  };

  const fetchUsers = () => {
    setError('');
    axios.get('http://localhost:3001/api/users')
      .then(res => setUsers(res.data))
      .catch(() => setError('Unable to fetch user data. Please check your connection.'));
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

  const toggleBan = (id) => {
    axios.patch(`http://localhost:3001/api/users/${id}/toggle-ban`)
      .then(() => fetchUsers())
      .catch(() => setError('Could not update user ban status.'));
  };

  const HeaderNav = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  background: 'linear-gradient(to right, #ff7043, #e53935)',
  fontFamily: 'Inter, sans-serif',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
  position: 'sticky',
  top: 0,
  zIndex: 1200,
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  fontWeight: 500,
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.875rem',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
}));

   // Helper: group data by month or week based on lostdatetime/founddatetime
  const groupItemsByTime = (items, dateKey, filter) => {
    // Returns array of { timeLabel, count }
    // timeLabel = "YYYY-MM" for monthly or "YYYY-WW" for weekly
    const grouped = {};

    items.forEach(item => {
      const date = new Date(item[dateKey]);
      if (isNaN(date)) return;

      let label = '';
      if (filter === 'monthly') {
        label = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else if (filter === 'weekly') {
        // Get week number (ISO week)
        const onejan = new Date(date.getFullYear(), 0, 1);
        const week = Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        label = `${date.getFullYear()}-W${week.toString().padStart(2, '0')}`;
      } else {
        label = 'All Time';
      }

      grouped[label] = (grouped[label] || 0) + 1;
    });

    // Convert to array sorted by label (time)
    const result = Object.entries(grouped)
      .map(([timeLabel, count]) => ({ timeLabel, count }))
      .sort((a, b) => a.timeLabel.localeCompare(b.timeLabel));

    return result;
  };

  // Prepare data for Bar chart (Monthly Lost vs Found)
  const prepareBarChartData = () => {
    if (timeFilter === 'all') {
      // Single data point for all time
      return [{
        timeLabel: 'All Time',
        Lost: lostItems.length,
        Found: foundItems.length,
      }];
    }
    const lostGrouped = groupItemsByTime(lostItems, 'lostdatetime', timeFilter);
    const foundGrouped = groupItemsByTime(foundItems, 'founddatetime', timeFilter);

    // Merge lost and found by timeLabel
    const labels = Array.from(new Set([...lostGrouped.map(i => i.timeLabel), ...foundGrouped.map(i => i.timeLabel)]))
      .sort();

    return labels.map(label => ({
      timeLabel: label,
      Lost: lostGrouped.find(i => i.timeLabel === label)?.count || 0,
      Found: foundGrouped.find(i => i.timeLabel === label)?.count || 0,
    }));
  };

  // Prepare data for Pie chart (Active vs Banned users)
  const preparePieChartData = () => {
    const banned = users.filter(u => u.isBanned).length;
    const active = users.length - banned;
    return [
      { name: 'Active', value: active },
      { name: 'Banned', value: banned }
    ];
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
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={category === 'lost' ? 7 : 6} align="center">
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </SectionCard>
  );

  const openUserProfile = async (user) => {
  try {
    const [lostRes, foundRes] = await Promise.all([
      axios.get(`http://localhost:3001/api/lost?email=${user.email}`),
      axios.get(`http://localhost:3001/api/found?email=${user.email}`)
    ]);

    const extendedUser = {
      ...user,
      lostItems: lostRes.data,
      foundItems: foundRes.data
    };

    setSelectedUser(extendedUser);
    setProfileOpen(true);
  } catch (err) {
    console.error('Failed to fetch user profile:', err);
    alert('Failed to load user details.');
  }
};

  return (
    <GradientWrapper>
      <HeaderNav>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#fff' }}>
                          Lost & Found - UoK
                        </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <NavButton onClick={() => analyticsRef.current?.scrollIntoView({ behavior: 'smooth' })}>Analytics</NavButton>
              <NavButton onClick={() => userRef.current?.scrollIntoView({ behavior: 'smooth' })}>User Management</NavButton>
              <NavButton onClick={() => lostRef.current?.scrollIntoView({ behavior: 'smooth' })}>Lost Items</NavButton>
              <NavButton onClick={() => foundRef.current?.scrollIntoView({ behavior: 'smooth' })}>Found Items</NavButton>
            </Box>
          </Box>
        </Container>
      </HeaderNav>
      <DashboardContent>
        <center><LogoImage src={logo} alt="Site Logo" /></center>
        <Typography variant="h4" align="center" sx={{ fontWeight: 800, color: '#0f172a', mb: 4 }}>
          Admin Dashboard
        </Typography>
         
        {/* --- Early Update: Quick Stats and Error/Loading --- */}
        <Box sx={{ mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
            <Chip label={`Lost Items: ${lostCount}`} color="warning" size="medium" />
            <Chip label={`Found Items: ${foundCount}`} color="success" size="medium" />
            <Chip label={`Total Users: ${userCount}`} color="primary" size="medium" />
            <Chip label={`Banned Users: ${bannedCount}`} color="error" size="medium" />
          </Stack>
        </Box>
        {loading && (
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            Loading data, please wait...
          </Typography>
        )}
        {error && (
          <Typography variant="body1" align="center" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box ref={analyticsRef}>
        <SectionCard>
        <Container sx={{ py: 6 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={800} color="primary.dark" gutterBottom>
              Dashboard Analytics Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get visual insights about user activity and item statistics
            </Typography>
          </Box>

          {/* Time Filter Buttons */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <ButtonGroup variant="outlined" color="warning" sx={{ boxShadow: 3 }}>
              {['weekly', 'monthly', 'all'].map((type) => (
                <Button
                  key={type}
                  onClick={() => setTimeFilter(type)}
                  variant={timeFilter === type ? 'contained' : 'outlined'}
                  sx={{
                    textTransform: 'capitalize',
                    px: 3,
                    fontWeight: 600,
                    transition: '0.2s ease',
                  }}
                >
                  {type === 'all' ? 'All Time' : type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          {/* Charts Section */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
            sx={{ mb: 6 }}
          >
            {/* Bar Chart Card */}
            <Paper
              elevation={4}
              sx={{
                flex: 1,
                minWidth: 320,
                background: 'linear-gradient(to bottom right, #fff3e0, #ffe0b2)',
                borderRadius: 5,
                p: 3,
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#bf360c' }}>
                Lost vs Found Items
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={prepareBarChartData()} barCategoryGap={20}>
                  <XAxis dataKey="timeLabel" stroke="#5d4037" />
                  <YAxis stroke="#5d4037" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Lost" fill="#ef5350" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Found" fill="#66bb6a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>

            {/* Pie Chart Card */}
            <Paper
              elevation={4}
              sx={{
                flexBasis: 320,
                background: 'linear-gradient(to bottom right, #e1f5fe, #b3e5fc)',
                borderRadius: 5,
                p: 3,
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#0277bd' }}>
                User Status Overview
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={preparePieChartData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {preparePieChartData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Stack>
        </Container>
        </SectionCard>
        </Box>

        <Box ref={userRef}>
        <SectionCard>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#bf360c' }}>User Management</Typography>
          <StyledTableContainer>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Chip label={user.isBanned ? "Banned" : "Active"} color={user.isBanned ? "error" : "success"} size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => openUserProfile(user)} 
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <Button
                        onClick={() => toggleBan(user._id)}
                        size="small"
                        variant="contained"
                        color={user.isBanned ? "success" : "error"}
                      >
                        {user.isBanned ? "Unban" : "Ban"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </SectionCard>
        </Box>

        <Box ref={lostRef}>{renderTable(lostItems, 'lost')}</Box>
        <Box ref={foundRef}>{renderTable(foundItems, 'found')}</Box>
      </DashboardContent>

      {/* Edit Dialog */}
      <UpdateDialog
        editItem={editItem}
        setEditItem={setEditItem}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        type={type}
        handleDialogSave={handleDialogSave}
      />

      {/* Delete Confirmation */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            boxShadow: 6,
            backgroundColor: '#fff',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningAmberRoundedIcon color="error" sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600}>
            Confirm Deletion
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
            Are you sure you want to permanently delete this item? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setConfirmDelete(false)}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDeleteItem}
            sx={{ borderRadius: 2, px: 3 }}
          >
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
          }}>
            Logout
          </StyledLink>
        </Typography>
      </Footer>
      {selectedUser && (
      <Dialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: 10,
            background: 'linear-gradient(to right, #fffaf0, #fefefe)',
            p: 2,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: 20, color: '#8a3b0eff' }}>
          User Profile — {selectedUser.name}
        </DialogTitle>

        <DialogContent dividers>
          {/* Basic Details */}
          <Box mb={2} sx={{ p: 2, backgroundColor: '#f1f5f9', borderRadius: 2 }}>
            <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
            <Typography><strong>Phone Number:</strong> {selectedUser.phonenumber || 'N/A'}</Typography>
            <Typography><strong>Role:</strong> {selectedUser.role}</Typography>
            <Typography>
              <strong>Status:</strong>{' '}
              <span style={{ color: selectedUser.isBanned ? 'red' : 'green' }}>
                {selectedUser.isBanned ? 'Banned' : 'Active'}
              </span>
            </Typography>
            <Typography><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</Typography>
          </Box>

          {/* Lost Items */}
          <Box mt={2}>
            <Typography variant="h6" color="error" gutterBottom fontWeight="bold">
              📦 Lost Items
            </Typography>
            {selectedUser.lostItems?.length > 0 ? (
              <Box component="ul" sx={{ pl: 3 }}>
                {selectedUser.lostItems.map(item => (
                  <li key={item._id}>
                    <strong>{item.lostitem}</strong> &mdash; {item.lostlocation} on {new Date(item.lostdatetime).toLocaleString()}
                  </li>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No lost items submitted.</Typography>
            )}
          </Box>

          {/* Found Items */}
          <Box mt={3}>
            <Typography variant="h6" color="success.main" gutterBottom fontWeight="bold">
              🎁 Found Items
            </Typography>
            {selectedUser.foundItems?.length > 0 ? (
              <Box component="ul" sx={{ pl: 3 }}>
                {selectedUser.foundItems.map(item => (
                  <li key={item._id}>
                    <strong>{item.founditem}</strong> &mdash; {item.foundlocation} on {new Date(item.founddatetime).toLocaleString()}
                  </li>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No found items submitted.</Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setProfileOpen(false)} variant="outlined" color="primary" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )}

    </GradientWrapper>
  );
};

export default AdminHomePage; 