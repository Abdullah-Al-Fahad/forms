const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const axios = require('axios');
require("dotenv").config();
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
      { expiresIn: '24h' }
    );

    console.log("Login successful for user:", user.id);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in login function:", error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.createSalesforceAccount = async (req, res) => {
  try {
    console.log("🔄 Received Salesforce Account Creation Request:", req.body);

    const { userId, company, jobTitle, industry } = req.body;

    // Validate input
    if (!userId || !company || !jobTitle || !industry) {
      return res.status(400).json({ message: "All fields are required." });
    }

    console.log("🔄 Fetching Salesforce Access Token...");

    // Authenticate with Salesforce (inline function)
    const authResponse = await axios.post("https://login.salesforce.com/services/oauth2/token", null, {
      params: {
        grant_type: "password",
        client_id: process.env.SALESFORCE_CLIENT_ID,
        client_secret: process.env.SALESFORCE_CLIENT_SECRET,
        username: process.env.SALESFORCE_USERNAME,
        password: process.env.SALESFORCE_PASSWORD, // No security token needed
      },
    });

    const accessToken = authResponse.data.access_token;
    const instanceUrl = authResponse.data.instance_url;

    console.log("✅ Salesforce Access Token Received!");

    // Step 1: Create an Account in Salesforce
    console.log("🔄 Creating Salesforce Account...");
    const accountResponse = await axios.post(
      `${instanceUrl}/services/data/v57.0/sobjects/Account`,
      { Name: company, Industry: industry },
      { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
    );

    const accountId = accountResponse.data.id;
    console.log("✅ Salesforce Account Created:", accountId);

    // Step 2: Create a Contact linked to the Account
    console.log("🔄 Creating Salesforce Contact...");
    const contactResponse = await axios.post(
      `${instanceUrl}/services/data/v57.0/sobjects/Contact`,
      { 
        LastName: "User", 
        Email: "user@example.com", 
        Title: jobTitle, 
        AccountId: accountId 
      },
      { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
    );

    console.log("✅ Salesforce Contact Created:", contactResponse.data);

    res.status(201).json({ 
      message: "Salesforce Account & Contact created successfully", 
      accountId, 
      contactId: contactResponse.data.id 
    });
  } catch (error) {
    console.error("❌ Error creating Salesforce Account & Contact:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Salesforce Integration Failed", 
      error: error.response?.data || error.message 
    });
  }
};
