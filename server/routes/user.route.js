import {Router} from 'express';
import {getUserByUsername, handleGoogleAuth,loginAccount,logout,registerAccount} from '../controller/user.controller.js';
import {googleAuth,googleAuthCallback,protect} from "../middleware/auth.middleware.js";

const router = Router();

// Google OAuth routes
router.route('/google').get( googleAuth);
router.route('/google/callback').get(googleAuthCallback, handleGoogleAuth);



// Register route
router.route("/register").post( registerAccount);

// Login route
router.route("/login").post( loginAccount);

//Username route
router.route('/username/:username').get(getUserByUsername);

// Logout route
router.route("/logout").get(protect, logout);

export default router;