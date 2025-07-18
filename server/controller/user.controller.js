
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import {User} from '../model/user.model.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

export const handleGoogleAuth = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Google authentication failed');
  }

  const token = generateToken(req.user);

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    token
  });
});


export const registerAccount = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields: name, email, and password');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Create new user
  const user = await User.create({
    username: name.toLowerCase().replace(/\s+/g, ''),
    name,
    email,
    password,
    provider: 'local'
  });

  if (user) {
    const token = generateToken(user);
    
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export const loginAccount = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email });

  // Check if user exists and password is available (for local authentication)
  if (!user || !user.password) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user);
  
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token
  });
});

export const switchAccount = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authenticated');
  }

  // Generate a state parameter with the current user's ID
  const state = req.user._id.toString();
  
  // Redirect to Google auth with the 'google-switch' strategy
  passport.authenticate('google-switch', {
    scope: ['profile', 'email'],
    state: state,
    session: false
  })(req, res);
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
});