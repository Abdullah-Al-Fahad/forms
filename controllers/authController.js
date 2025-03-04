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
      { expiresIn: '24h' }
    );

    console.log("Login successful for user:", user.id);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in login function:", error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


//below code is for salesforce
const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID;
const SALESFORCE_CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET;
const SALESFORCE_USERNAME = process.env.SALESFORCE_USERNAME;
const SALESFORCE_PASSWORD = process.env.SALESFORCE_PASSWORD;
const SALESFORCE_SECURITY_TOKEN = process.env.SALESFORCE_SECURITY_TOKEN;
const SALESFORCE_INSTANCE_URL = process.env.SALESFORCE_INSTANCE_URL;
const SALESFORCE_LOGIN_URL = "https://login.salesforce.com/services/oauth2/token";

// Authenticate and get Salesforce access token
const getAccessToken = async () => {
  try {
    const response = await axios.post(SALESFORCE_LOGIN_URL, null, {
      params: {
        grant_type: "password",
        client_id: SALESFORCE_CLIENT_ID,
        client_secret: SALESFORCE_CLIENT_SECRET,
        username: SALESFORCE_USERNAME,
        password: `${SALESFORCE_PASSWORD}${SALESFORCE_SECURITY_TOKEN}`,
      },
    });

    return { accessToken: response.data.access_token, instanceUrl: response.data.instance_url };
  } catch (error) {
    console.error("Salesforce Authentication Error:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with Salesforce");
  }
};

exports.createSalesforceAccount = async (req, res) => {
  try {
    const { userId, company, jobTitle, industry } = req.body;

    // Ensure user exists
    const user = await User.findOne({ where: { id: userId } }); // ✅ Fix: Use `findOne`
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get Salesforce Access Token
    const { accessToken } = await getAccessToken();

    // Step 1: Create an Account in Salesforce
    const accountResponse = await axios.post(`${SALESFORCE_INSTANCE_URL}/services/data/v57.0/sobjects/Account`, 
      { Name: company, Industry: industry }, 
      { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
    );

    const accountId = accountResponse.data.id;

    // Step 2: Create a Contact linked to the Account
    const contactResponse = await axios.post(`${SALESFORCE_INSTANCE_URL}/services/data/v57.0/sobjects/Contact`, 
      { 
        LastName: user.username, 
        Email: user.email, 
        Title: jobTitle, 
        AccountId: accountId 
      },
      { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
    );

    res.status(201).json({ 
      message: 'Salesforce Account & Contact created successfully', 
      accountId, 
      contactId: contactResponse.data.id 
    });
  } catch (error) {
    console.error("Error creating Salesforce Account & Contact:", error.response?.data || error.message);
    res.status(500).json({ message: "Error in Salesforce CRM Integration" });
  }
};