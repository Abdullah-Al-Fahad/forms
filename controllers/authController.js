const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    console.log("Incoming Register Request:", req.body);  // Log request payload

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.error("Missing required fields");
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.error("User already exists with email:", email);
      return res.status(400).json({ message: "Email is already in use." });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log("Creating user in database...");
    const user = await User.create({ username, email, password: hashedPassword });

    console.log("User registered successfully:", user.id);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error("Error in register function:", error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Incoming Login Request:", req.body);  // Log request payload

    const { email, password } = req.body;

    if (!email || !password) {
      console.error("Missing email or password");
      return res.status(400).json({ message: "Email and password are required." });
    }

    console.log("Checking user existence in database...");
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.error("User not found with email:", email);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log("Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Password does not match");
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log("Generating JWT token...");
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Include the user's role in the token payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("Login successful for user:", user.id);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in login function:", error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
