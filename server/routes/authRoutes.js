import 'dotenv/config';
import { Router } from 'express';
import { registerUser, loginUser, googleLogin } from '../controllers/authController.js';

const router = Router();

// Define Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);

export default router;