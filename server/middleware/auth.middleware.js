import passport from 'passport';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { User } from '../model/user.model.js';




// Middleware to initiate Google auth
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
});

// Middleware to handle Google callback
export const googleAuthCallback = passport.authenticate('google', {
  failureRedirect: '/login',
  session: false
});





// Middleware to protect routes with JWT
export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt || 
             (req.headers.authorization?.startsWith('Bearer') && 
              req.headers.authorization.split(' ')[1]);

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

