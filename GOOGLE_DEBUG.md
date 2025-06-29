// Temporary Google Login Test Component
// Add this to your Login page if you want to test

const testGoogleLogin = () => {
  window.location.href = `https://accounts.google.com/oauth/authorize?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=code&scope=email profile`;
};

// Add this button temporarily:
// <button onClick={testGoogleLogin}>Test Google Login</button>
