import express from "express";
import multer from "multer";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post(
  "/upload-profile-picture",
  authMiddleware,
  upload.single("file"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  }
);

router.put(
  "/update-profile",
  authMiddleware,
  async (req, res) => {
    const { name, email, phone, profilePicture } = req.body;
    const userId = req.user.id;
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { name, email, phone, profilePicture },
        { new: true }
      ).select("-password");
      res.json({ user });
    } catch (err) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
);

router.get(
  "/me",
  authMiddleware,
  async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  }
);

router.post(
  "/change-password",
  authMiddleware,
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user signed up with Google
    if (user.googleId) {
      return res.status(400).json({ 
        error: "This account was created with Google. You cannot change your password as you authenticate through Google.",
        isGoogleUser: true
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  }
);

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // CRITICAL: Check if user signed up with Google BEFORE setting reset token
    if (user.googleId) {
      return res.status(400).json({ 
        error: "This account was created with Google. Please sign in with Google instead of using a password.",
        isGoogleUser: true
      });
    }

    // Additional safety check: if user has no password but has an email from Google domains,
    // it might be a corrupted Google account
    if (!user.password && email.includes('gmail.com')) {
      return res.status(400).json({ 
        error: "This appears to be a Google account. Please sign in with Google instead.",
        isGoogleUser: true
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 min
    await user.save();

    const resetUrl = `${process.env.FRONTEND_HOST}/reset-password/${token}`;
    
    await transporter.sendMail({
      to: user.email,
      subject: "Reset your MediQR password",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb;">Reset Your MediQR Password</h2>
          <p>We received a request to reset your password for your MediQR account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
          <p><strong>This link expires in 30 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">MediQR - Emergency Medical Information System</p>
        </div>
      `,
    });
    
    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to send reset email" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // CRITICAL: Absolutely prevent Google account corruption
    if (user.googleId) {
      // Clear the reset token to prevent further attempts
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(400).json({ 
        error: "This account was created with Google. Password reset is not allowed. Token has been invalidated.",
        isGoogleUser: true
      });
    }

    // Additional safety: Check if this looks like a Google account
    if (user.email && user.email.includes('gmail.com') && !user.password) {
      // Clear the reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(400).json({ 
        error: "This appears to be a Google account. Please sign in with Google instead.",
        isGoogleUser: true
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Only update password and clear reset tokens - NEVER touch googleId
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

export default router;