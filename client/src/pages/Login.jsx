import React, { useState, useContext, useEffect } from "react";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Input from "../components/Input";
import Button from "../components/Button";
import Label from "../components/Label";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff, Loader, CheckSquare, Square, LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
    const [email, setEmail] = useState(localStorage.getItem("rememberedEmail") || "");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true");
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (rememberMe && email) {
            localStorage.setItem("rememberedEmail", email);
        } else {
            localStorage.removeItem("rememberedEmail");
        }
    }, [email, rememberMe]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            if (!res.data.token) throw new Error("No token received");

            localStorage.setItem("token", res.data.token);
            setUser(jwtDecode(res.data.token));

            if (rememberMe) localStorage.setItem("rememberMe", "true");
            else localStorage.removeItem("rememberMe");

            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            setError(error.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        console.log("Google Token:", credentialResponse);
        if (!credentialResponse.credential) {
            console.error("No ID token received.");
            return;
        }
        try {
            const res = await axios.post("http://localhost:5000/api/auth/google-login", {
                token: credentialResponse.credential,
            });

            console.log("Server Response:", res.data); // Debugging

            localStorage.setItem("token", res.data.token);
            setUser(jwtDecode(res.data.token));

            console.log("Decoded User:", jwtDecode(res.data.token)); // Debugging

            navigate("/dashboard");
        } catch (error) {
            console.error("Google login failed:", error.response?.data?.message || error.message);
            setError("Google login failed. Try again.");
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen w-full">
            <Card>
                <CardContent>
                    <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-800">Welcome Back!</h2>
                    <p className="text-center text-gray-500 mb-6">Login to access your account</p>
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* Email Input */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
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
                        <Button type="submit" disabled={loading} className=" w-full flex items-center justify-center">
                            {loading ? <Loader className="animate-spin mr-2" size={20} /> : <LogIn className="mr-2" size={20} />} Login
                        </Button>
                    </form>

                    {/* Google Login */}
                    <div className="mt-6 flex justify-center w-full rounded-lg">
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                console.log("One Tap Response:", credentialResponse);
                                handleGoogleLogin(credentialResponse);
                            }}
                            onError={() => setError("Google login failed. Try again.")}
                            useOneTap
                        />
                    </div>


                    {/* Register Redirect */}
                    <p className="text-center mt-4 text-gray-600">
                        Don't have an account? <span className="text-blue-700 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/register")}>Register</span>
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