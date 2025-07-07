import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Input from "../components/Input";
import Button from "../components/Button";
import Label from "../components/Label";
import api from '../services/api.js';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post(`/api/users/reset-password/${token}`, { newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <Card>
        <CardContent>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Reset Password</h2>
          <p className="text-center text-gray-500 mb-6">Enter your new password</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            
            {message && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{message}</div>}
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Setting Password..." : "Set New Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;