import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useState } from 'react';

const fieldLabels = {
  lostitem: 'Item Name',
  lostlocation: 'Lost Location',
  lostdescription: 'Description',
  lostdatetime: 'Date & Time Lost',
  founditem: 'Item Name',
  foundlocation: 'Found Location',
  founddescription: 'Description',
  founddatetime: 'Date & Time Found',
  ownername: 'Owner Name',
  ownerphonenumber: 'Phone Number'
};

const fieldTypes = {
  lostdatetime: 'datetime-local',
  founddatetime: 'datetime-local',
  ownerphonenumber: 'tel'
};

const toLabel = (key) => fieldLabels[key] || key;
const getFieldType = (key) => fieldTypes[key] || 'text';
const isValidPhone = (phone) => /^\d{10}$/.test(phone);

const UpdateDialog = ({ editItem, setEditItem, dialogOpen, setDialogOpen, type, handleDialogSave }) => {
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const validate = () => {
    let temp = {};
    Object.entries(editItem || {}).forEach(([key, value]) => {
      if (['ownerphonenumber'].includes(key)) {
        if (!isValidPhone(value)) temp[key] = 'Phone number must be 10 digits';
      } else if (!value && key !== '_id' && key !== '__v') {
        temp[key] = 'This field is required';
      }
    });
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const onSave = () => {
    if (validate()) {
      handleDialogSave();
      setErrors({});
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
          boxShadow: 10,
          background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffffee'
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, textAlign: 'center', pb: 0 }}>
         Update {type === 'lost' ? 'Lost' : 'Found'} Item
      </DialogTitle>

      <DialogContent dividers sx={{ mt: 1 }}>
        <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', textAlign: 'center' }}>
          Make changes to the item details below. Fields marked with * are required.
        </Typography>

        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            {Object.entries(editItem || {}).map(([key, value]) =>
              ['_id', '__v', 'matched', 'owner'].includes(key) ? null : (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    label={`${toLabel(key)} *`}
                    type={getFieldType(key)}
                    fullWidth
                    variant="filled"
                    margin="dense"
                    InputLabelProps={fieldTypes[key] ? { shrink: true } : {}}
                    value={value}
                    error={Boolean(errors[key])}
                    helperText={errors[key]}
                    onChange={(e) =>
                      setEditItem({ ...editItem, [key]: e.target.value })
                    }
                    sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 1,
                        '& .MuiFilledInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f5f5f5',
                        },
                        '& .Mui-focused': {
                        backgroundColor: '#e3f2fd'
                        }
                    }}
                  />
                </Grid>
              )
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button
          onClick={() => setDialogOpen(false)}
          variant="outlined"
          color="inherit"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 2,
            px: 4,
            boxShadow: 3,
            textTransform: 'none'
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDialog;
