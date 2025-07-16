import passport from 'passport';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';

// Passport Google Strategy Configuration
export const configurePassport = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',//callbackURL: process.env.CALLBACK_URL, // Points to Render
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value
        });
      } else if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

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

