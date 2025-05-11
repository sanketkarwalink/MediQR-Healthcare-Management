import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, Container, Paper, TextField, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let profilePicUrl = profilePicture;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/users/upload-profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      profilePicUrl = res.data.url;
    }

    // Update user profile
    const res = await axios.put("/api/users/update-profile", {
      name,
      email,
      profilePicture: profilePicUrl,
    });

    setUser(res.data.user);
    navigate("/dashboard/profile");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 400, mx: "auto" }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: "center" }}>
          Edit Profile
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          <Avatar src={profilePicture} sx={{ width: 80, height: 80, mb: 2 }} />
          <Button variant="outlined" component="label">
            Upload Picture
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
        </Box>
        <Box component="form" onSubmit={handleSave} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            type="email"
          />
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => navigate("/dashboard/profile")}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" fullWidth>
              Save
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProfilePage;