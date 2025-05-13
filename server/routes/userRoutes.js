import express from "express";
import multer from "multer";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";

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
    const { name, email, profilePicture } = req.body;
    const userId = req.user.id;
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { name, email, profilePicture },
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

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    user.password = newPassword;
    await user.save(); // This triggers the pre-save hook and hashes the password

    res.json({ message: "Password changed successfully" });
  }
);

export default router;