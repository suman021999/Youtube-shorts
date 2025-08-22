import {Router} from 'express';
import {getUserByUsername, loginAccount,logout,registerAccount} from '../controllers/user.controller.js';
import {protect} from "../middleware/auth.middleware.js";

const router = Router();

// Google OAuth routes
// router.route('/google').get( googleAuth);
// router.route('/google').get(googleAuthCallback, handleGoogleAuth);
// handleGoogleAuth,googleAuth,googleAuthCallback,


// Register route
router.route("/register").post( registerAccount);

// Login route
router.route("/login").post( loginAccount);

//Username route
router.route('/username/:username').get(getUserByUsername);

// Logout route
router.route("/logout").get(protect, logout);

export default router;