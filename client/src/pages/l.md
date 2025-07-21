












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