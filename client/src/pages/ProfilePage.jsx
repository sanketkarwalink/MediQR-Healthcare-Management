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


import React, { useContext } from 'react';
import { Avatar, Box, Button, Divider, Typography, Stack, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 8 }}>
        {/* Profile Avatar and Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 90, height: 90, mb: 1, bgcolor: 'primary.main' }}>
            {user?.name?.[0]}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            sx={{ mt: 1, borderRadius: 5, bgcolor: 'primary.main', color: 'whitesmoke', padding: 1 }}
            onClick={() => navigate('/edit-profile')}
          >
            Edit Profile
          </Button>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Links to Info Pages */}
        <Stack spacing={2}>
          <Button variant="outlined" onClick={() => navigate('/dashboard/medical-info')} sx={{ borderRadius: 5 }}>
            Medical Information
          </Button>
          <Button variant="outlined" onClick={() => navigate('/dashboard/insurance')} sx={{ borderRadius: 5 }}>
            Insurance Information
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Security Settings */}
        <Stack spacing={2}>
          <Button variant="outlined" onClick={() => navigate('/change-password')} sx={{ borderRadius: 5 }}>
            Change Password
          </Button>
          <Button variant="outlined" onClick={() => navigate('/forgot-password')} sx={{ borderRadius: 5 }}>
            Forgot Password
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout} sx={{ borderRadius: 5 }}>
            Logout
          </Button>
        </Stack>

      </Paper>
    </Container>
  );
};

export default ProfilePage;
