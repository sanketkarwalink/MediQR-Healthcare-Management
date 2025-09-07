import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/ProfilePage.jsx';
import DashboardLayout from "./components/DashboardLayout.jsx";
import QRCodePage from "./pages/QRCodePage.jsx";
import InsurancePage from './pages/InsurancePage.jsx';
import MedicalDetails from './pages/MedicalDetails.jsx';
import { AuthProvider } from './context/AuthContext';
import QRResultPage from './pages/QRResultPage.jsx';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import "react-toastify/dist/ReactToastify.css";
import MedicalCard from './pages/MedicalCard.jsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EditProfile from './pages/EditProfile.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ForgotPassword from './pages/ForgotPass.jsx';
import EmergencySettings from './pages/Emergency.jsx';

const theme = createTheme({
  typography: {
    fontFamily: "Winki Sans"
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/qr-result/:userId" element={<QRResultPage />} />
            <Route path="medical-card" element={<MedicalCard />} />
            <Route path="/dashboard/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="qr-code" element={<QRCodePage />} />
              <Route path="medical-info" element={<MedicalDetails />} />
              <Route path="insurance" element={<InsurancePage />} />
              <Route path="emergency-settings" element={<EmergencySettings />} />
            </Route>
          </Routes>
        </Router>
        <ToastContainer position="top-center" autoClose={6000} />
        <Toaster position="top-center" />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

