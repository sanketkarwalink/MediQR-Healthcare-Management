import { useState, useContext, useEffect } from "react";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Input from "../components/Input";
import Button from "../components/Button";
import Label from "../components/Label";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff, Loader, CheckSquare, Square, LogIn } from "lucide-react";
import { toast } from "react-hot-toast";
import { useGoogleOneTapLogin, GoogleLogin } from '@react-oauth/google';
import api from '../services/api.js';

const Login = () => {
    const [email, setEmail] = useState(localStorage.getItem("rememberedEmail") || "");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true");
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, navigate]);

    // Google One Tap Login
    useGoogleOneTapLogin({
        onSuccess: credentialResponse => {
            console.log("🔵 One Tap Success:", credentialResponse);
            handleGoogleSuccess(credentialResponse);
        },
        onError: () => {
            console.log("❌ One Tap Login Failed");
        },
        disabled: !!user, // Disable if user is already logged in
        cancel_on_tap_outside: true,
        auto_select: false,
    });

    const handleGoogleSuccess = async (credentialResponse) => {
        console.log("🔵 Google Login Success:", credentialResponse);
        
        if (!credentialResponse?.credential) {
            console.error("❌ No credential received from Google");
            setError("Google login failed. No credential received.");
            toast.error("Google login failed. Please try again.");
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            console.log("🔵 Sending credential to server...");
            const res = await api.post("/api/auth/google-login", {
                token: credentialResponse.credential,
            });

            console.log("✅ Server Response:", res.data);

            if (!res.data.token) {
                throw new Error("No token received from server");
            }

            localStorage.setItem("token", res.data.token);
            const decodedUser = jwtDecode(res.data.token);
            setUser(decodedUser);

            console.log("✅ User logged in:", decodedUser);
            toast.success("Successfully logged in with Google!");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("❌ Google login failed:", error);
            const errorMessage = error.response?.data?.message || error.message || "Google login failed";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        console.log("❌ Google Login Error");
        setError("Google login failed. Please try again.");
        toast.error("Google login failed. Please try again.");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/api/auth/login", { email, password });
            if (!res.data.token) throw new Error("No token received");

            localStorage.setItem("token", res.data.token);
            setUser(jwtDecode(res.data.token));

            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberMe");
                localStorage.removeItem("rememberedEmail");
            }

            toast.success("Successfully logged in!");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            const message = error.response?.data?.message || "Invalid credentials. Please try again.";
            setError(message);
            toast.error(message);
            console.error("Login failed:", message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen w-full">
            <Card>
                <CardContent>
                    <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Welcome Back!</h2>
                    <p className="text-center text-gray-500 mb-6">Login to access your account</p>
                    
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* Email Input */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="Enter your email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>

                        {/* Password Input with Visibility Toggle */}
                        <div className="relative">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-12 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center space-x-2">
                            <button type="button" onClick={() => setRememberMe(!rememberMe)} className="text-gray-600">
                                {rememberMe ? <CheckSquare size={20} /> : <Square size={20} />}
                            </button>
                            <span className="text-gray-600">Remember Me</span>
                        </div>

                        {/* Error Message */}
                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                        {/* Login Button with Loading Spinner */}
                        <Button type="submit" disabled={loading} className="w-full flex items-center justify-center">
                            {loading ? (
                                <Loader className="animate-spin mr-2" size={20} />
                            ) : (
                                <LogIn className="mr-2" size={20} />
                            )}
                            Login
                        </Button>
                    </form>

                    {/* Google Login - One Tap + Button for New Users */}
                    <div className="mt-6">
                        <div className="text-center text-gray-500 mb-4">or</div>
                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="outline"
                                size="large"
                                text="signin_with"
                                shape="rectangular"
                                width="350"
                                useOneTap={false}
                                context="signin"
                                auto_select={false}
                            />
                        </div>
                        <div className="text-center text-gray-500 text-sm mt-2">
                            <p>One Tap may also appear automatically for returning users</p>
                        </div>
                    </div>

                    {/* Register Redirect */}
                    <p className="text-center mt-4 text-gray-600">
                        Don't have an account?{" "}
                        <span 
                            className="text-blue-700 font-semibold cursor-pointer hover:underline" 
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </span>
                    </p>
                    <p className="text-center text-gray-600 mt-2">
                        <span
                            className="text-blue-700 font-semibold cursor-pointer hover:underline"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Forgot Password?
                        </span>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;