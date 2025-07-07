import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsGoogleUser(false);
    setLoading(true);

    try {
      const res = await api.post("/api/users/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      if (err.response?.data?.isGoogleUser) {
        setIsGoogleUser(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg mb-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
          <p className="text-gray-600 text-sm">Enter your email to receive a reset link</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          {!message ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50/50"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className={`border rounded-lg p-3 ${isGoogleUser ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                  {isGoogleUser ? (
                    <div className="flex items-start space-x-2">
                      <svg className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Google Account Detected</p>
                        <p className="text-sm text-blue-600 mt-1">{error}</p>
                        <button
                          onClick={() => navigate('/')}
                          className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Sign in with Google
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-red-700">{error}</p>
                  )}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            // Success State
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Check Your Email!</h3>
                <p className="text-gray-600 text-sm mb-3">{message}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                  <p className="text-blue-800 text-xs font-medium mb-1">Next steps:</p>
                  <ul className="text-blue-700 text-xs space-y-0.5">
                    <li>• Check your inbox (and spam)</li>
                    <li>• Click the reset link</li>
                    <li>• Link expires in 30 minutes</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => {
                  setMessage("");
                  setEmail("");
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Send another email
              </button>
            </div>
          )}
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;