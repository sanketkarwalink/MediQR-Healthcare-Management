import { useContext, useState } from 'react';
import {
  Avatar, Box, Button, Divider, Typography, Stack, Paper, Container, Dialog, DialogTitle, DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import PersonIcon from '@mui/icons-material/Person';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate('/');
  };

  if (!user) {
    return (
      <Container maxWidth="xs" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            User not found or not logged in.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      py: 4,
    }}>
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 4,
            mt: 4,
            maxWidth: 400,
            width: "100%",
            mx: "auto",
            backgroundColor: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(8px)"
          }}
        >
          {/* Profile Avatar and Info */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main', fontSize: 44 }}>
              {user?.name ? user.name[0].toUpperCase() : <PersonIcon fontSize="inherit" />}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {user?.name || "Unknown User"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {user?.email || "No email"}
            </Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<AssignmentIndIcon />}
              sx={{ mt: 1, borderRadius: 5, bgcolor: 'primary.main', color: 'whitesmoke', px: 3 }}
              onClick={() => navigate('/edit-profile')}
              disabled={!user}
            >
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Links to Info Pages */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'primary.main', textAlign: 'center', fontSize: 18 }}>
            View & Edit Information
          </Typography>
          <Stack spacing={2} direction="row" justifyContent="center" sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<LocalHospitalIcon />}
              onClick={() => navigate('/dashboard/medical-info')}
              sx={{ borderRadius: 5, minWidth: 120 }}
            >
              Medical
            </Button>
            <Button
              variant="outlined"
              startIcon={<InfoIcon />}
              onClick={() => navigate('/dashboard/insurance')}
              sx={{ borderRadius: 5, minWidth: 120 }}
            >
              Insurance
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Security Settings */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'primary.main', textAlign: 'center', fontSize: 18 }}>
            Security
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<LockResetIcon />}
              onClick={() => navigate('/change-password')}
              sx={{ borderRadius: 5 }}
            >
              Change Password
            </Button>
            <Button
              variant="outlined"
              startIcon={<LockResetIcon />}
              onClick={() => navigate('/forgot-password')}
              sx={{ borderRadius: 5 }}
            >
              Forgot Password
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => setLogoutOpen(true)}
              sx={{ borderRadius: 5 }}
            >
              Logout
            </Button>
          </Stack>
        </Paper>

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 2,
              minWidth: 320,
              textAlign: 'center',
              backgroundColor: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(6px)"
            }
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
              fontWeight: 700,
              color: 'error.main',
              fontSize: 22,
              justifyContent: 'center'
            }}
          >
            Logout Confirmation
          </DialogTitle>
          <Typography sx={{ px: 3, pb: 2, color: 'text.secondary', fontSize: 18 }}>
            Are you sure you want to logout?
          </Typography>
          <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
            <Button onClick={() => setLogoutOpen(false)} color="primary" variant="outlined" sx={{ borderRadius: 3, minWidth: 100 }}>
              Cancel
            </Button>
            <Button onClick={handleLogout} color="error" variant="contained" sx={{ borderRadius: 3, minWidth: 100 }}>
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ProfilePage;
