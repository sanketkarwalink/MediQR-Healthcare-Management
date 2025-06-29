import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Paper, TextField, Button, Typography, Alert } from "@mui/material";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg(""); setError("");
    const host = window.location.hostname;
    const res = await fetch(`http://${host}:5000/api/users/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg(data.message);
      setTimeout(() => navigate("/"), 2000);
    } else setError(data.error || "Something went wrong");
  };

  return (
    <div>hello</div>
    // <Container maxWidth="xs" sx={{ py: 8 }}>
    //   <Paper sx={{ p: 4, borderRadius: 4 }}>
    //     <Typography variant="h5" fontWeight={700} mb={2}>Reset Password</Typography>
    //     <form onSubmit={handleSubmit}>
    //       <TextField
    //         label="New Password"
    //         type="password"
    //         fullWidth
    //         required
    //         value={newPassword}
    //         onChange={e => setNewPassword(e.target.value)}
    //         sx={{ mb: 2 }}
    //       />
    //       <Button type="submit" variant="contained" fullWidth>Set New Password</Button>
    //     </form>
    //     {msg && <Alert severity="success" sx={{ mt: 2 }}>{msg}</Alert>}
    //     {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    //   </Paper>
    // </Container>
  );
};

export default ResetPassword;