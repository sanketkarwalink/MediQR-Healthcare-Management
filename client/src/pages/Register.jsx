import { useState, useContext } from "react";
import Card from '../components/Card';
import CardContent from "../components/CardContent";
import Input from "../components/Input";
import Button from "../components/Button";
import Label from "../components/Label";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from '../services/api.js';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/api/auth/register", { name, email, phone, password });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            navigate("/dashboard");
        } catch (error) {
            console.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card>
                <CardContent>
                    <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-800">Create an Account</h2>
                    <p className="text-center text-gray-500 mb-6">Sign up to get started</p>
                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input id="fullname" type="text" placeholder="Enter your full name" required value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="Enter your phone number" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="Create a password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <Button type="submit">Register</Button>
                    </form>
                    <p className="text-center mt-4 text-gray-600">
                        Already have an account? <span className="text-blue-700 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/')}>Login</span>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;

