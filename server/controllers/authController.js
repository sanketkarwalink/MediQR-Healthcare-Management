import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email, phone: user.phone },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Register Route
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, phone, password: hashedPassword });
        await newUser.save();

        const token = generateToken(newUser);
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone }
        });

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

// Login Route
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

// Google Login Route
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: "No token provided" });

        console.log("Verifying Google Token...");
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log('Google payload:', payload);
        console.log("Token Verified:", payload);

        const { email, name, picture, sub: googleId } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            // Create new user with Google authentication
            user = await User.create({ email, name, profilePicture: picture, googleId });
        } else {
            // CRITICAL FIX: Always restore/update Google ID for existing users
            // This fixes corrupted accounts that lost their googleId
            user.googleId = googleId;
            
            // Update profile picture if not set or if it's not a Google picture
            if (picture && (!user.profilePicture || !user.profilePicture.includes('googleusercontent'))) {
                user.profilePicture = picture;
            }
            
            // SECURITY: Clear any password-related fields for Google accounts
            // This prevents mixed authentication methods
            if (user.password || user.resetPasswordToken) {
                console.log(`Cleaning up corrupted Google account: ${email}`);
                user.password = undefined;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
            }
            
            await user.save();
            console.log(`Google account restored/updated: ${email}`);
        }

        const jwtToken = generateToken(user);

        res.status(200).json({ token: jwtToken, user });

    } catch (error) {
        console.error("Google login error:", error);
        res.status(400).json({ message: "Google login failed" });
    }
};

export { registerUser, loginUser, googleLogin };