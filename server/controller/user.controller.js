
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import {User} from '../model/user.model.js';




const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '830d' }
  );
};

export const handleGoogleAuth = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Google authentication failed');
  }

  const token = generateToken(req.user);


  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    token
  });
});


export const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
});





export const registerAccount = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }


  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ msg: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create and save user
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  return res.status(201).json({ msg: "User registered successfully" });
});



export const loginAccount = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  // Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ msg: "User not found" });
  }

  // Compare password
  const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
  if (!isPasswordCorrect) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  // Generate token
  const token = generateToken(user);

  // Remove password from response
  const { password: _, ...userData } = user.toObject();

  return res.status(200).json({
    msg: "Login successful",
    token,
    user: userData,
  });
});