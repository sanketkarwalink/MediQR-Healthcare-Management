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
import "react-toastify/dist/ReactToastify.css";
import MedicalCard from './pages/MedicalCard.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/qr-result/:userId" element={<QRResultPage />} />
          <Route path="medical-card" element={<MedicalCard />} />
          <Route path="/dashboard/*" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="qr-code" element={<QRCodePage />} />
            <Route path="medical-info" element={<MedicalDetails />} />
            <Route path="insurance" element={<InsurancePage />} />
          </Route>
        </Routes>
    </Router>
    <ToastContainer position="top-center" autoClose={5000} />
    </AuthProvider>
  );
}

export default App;

