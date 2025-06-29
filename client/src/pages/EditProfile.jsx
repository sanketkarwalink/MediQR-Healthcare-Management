import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, Container, Paper, TextField, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture ? `http://${window.location.hostname}:5000${user.profilePicture}` : "");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      alert("Only image files are allowed!");
      return;
    }
    setFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let profilePicUrl = profilePicture;

    // Upload profile picture
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const host = window.location.hostname;
      const res = await fetch(`http://${host}:5000/api/users/upload-profile-picture`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      profilePicUrl = data.url;
    }

    // Update user profile
    const host = window.location.hostname;
    const res = await fetch(`http://${host}:5000/api/users/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        profilePicture: profilePicUrl,
      }),
    });
    const data = await res.json();
    setUser(data.user);
    navigate("/dashboard/profile");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 400, mx: "auto" }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: "center" }}>
          Edit Profile
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          <Avatar src={preview} sx={{ width: 80, height: 80, mb: 2 }} />
          <Button variant="outlined" component="label">
            Upload Picture
            <input
              type="file"
              hidden
              accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
              onChange={handleFileChange}
            />
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