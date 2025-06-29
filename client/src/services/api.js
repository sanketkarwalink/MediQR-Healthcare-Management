import axios from 'axios';

// Get the base URL dynamically based on environment
const getBaseUrl = () => {
  // Use environment variable in production
  if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In development, determine the correct host for API calls
  const host = window.location.hostname;
  
  // For network testing, you might want to force a specific IP
  // Uncomment and modify this line if needed:
  // return 'http://192.168.1.100:5000'; // Replace with your PC's IP
  
  return `http://${host}:5000`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// Add authorization header to every request if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;