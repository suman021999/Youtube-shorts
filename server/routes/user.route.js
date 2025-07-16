import {Router} from 'express';
import {handleGoogleAuth,loginAccount,logout,switchAccount} from '../controller/user.controller.js';
import {googleAuth,googleAuthCallback,protect} from "../middleware/auth.middleware.js";

const router = Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback, handleGoogleAuth);

// Account switching route
router.get('/google/switch', protect, switchAccount);

// Login route
router.post("/login", loginAccount);

// Logout route
router.get("/logout", logout);

export default router;