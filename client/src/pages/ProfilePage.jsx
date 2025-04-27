// import { useNavigate } from "react-router-dom";
// import Button from "../components/Button";



// const ProfilePage = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleDeactivate = async () => {
//     const confirmDeactivate = window.confirm("Are you sure you want to deactivate your account?");
//     if (confirmDeactivate) {
//       await fetch("/api/user/deactivate", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       alert("A reactivation link has been sent to your email.");
//       logout(); // call context logout
//       navigate("/login");
//     }
//   };

//   if (!user) return <div className="p-6 text-center">Loading profile...</div>;

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold mb-1">Profile</h2>
//       <p className="text-gray-500 mb-6">You can edit your details here.</p>

//       <div className="shadow-md rounded-xl p-6 space-y-4">

//         <div className="flex gap-3 pt-4">
//           {/* <Button variant="outline" onClick={() => navigate("/medical-info")}>
//             Edit Medical Info
//           </Button>
//           <Button variant="outline" onClick={() => navigate("/qr-code")}>
//             View QR Code
//           </Button> */}
//           <Button variant="default" onClick={() => navigate("/edit-profile")}>
//             Edit Profile
//           </Button>
//           <Button variant="destructive">
//             Logout
//           </Button>
//           <Button variant="ghost" className="bg-red-700">
//             Temporarily Deactivate
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import React from 'react';
import { Avatar, Box, Button, Divider, Typography, Stack, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  console.log(user);


  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: 4,
      bgcolor: '#F4F6F8',
    }}>
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: 450,
        padding: 4,
        borderRadius: 4,
        bgcolor: '#FFFFFF',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
      }}>
        {/* Profile Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 100, height: 100, mb: 1, bgcolor: '#1E88E5' }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1E88E5' }}>
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575' }}>
            {user?.email}
          </Typography>
          <Button
            variant="text"
            size="small"
            sx={{ mt: 1, color: '#1E88E5' }}
            onClick={() => navigate('/edit-profile')}
          >
            Edit Profile
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* My Information */}
        <Stack spacing={1.5}>
          <Button
            fullWidth
            variant="outlined"
            sx={{
              borderColor: '#42A5F5',
              color: '#1E88E5',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#E3F2FD' }
            }}
            onClick={() => navigate('/dashboard/medical-info')}
          >
            Medical Information
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{
              borderColor: '#42A5F5',
              color: '#1E88E5',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#E3F2FD' }
            }}
            onClick={() => navigate('/dashboard/insurance')}
          >
            Insurance Information
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Security Settings */}
        <Stack spacing={1.5}>
          <Button
            fullWidth
            variant="outlined"
            sx={{
              borderColor: '#42A5F5',
              color: '#1E88E5',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#E3F2FD' }
            }}
            onClick={() => navigate('/change-password')}
          >
            Change Password
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{
              borderColor: '#42A5F5',
              color: '#1E88E5',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#E3F2FD' }
            }}
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#D32F2F' }
            }}
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
              navigate('/');
            }}
          >
            Logout
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProfilePage;

