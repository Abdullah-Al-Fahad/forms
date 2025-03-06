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
      { id: user.id, role: user.role, email: user.email }, // Include the user's role in the token payload
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







// Jira Configuration
const JIRA_BASE_URL = "https://itran.atlassian.net";
const JIRA_EMAIL = "to.abdullah.al.fahad@gmail.com";
const JIRA_API_TOKEN = "ATATT3xFfGF0INqCuYEgr5l3tojeEnmGIItsuzwjpBZeh11iJ82Q6RreuD0fgT-Kkw5cM_22J9_RkdA1Q5xt2InQ0xnypm_ld4yNPK9r41JgvnZRPZuie3gEw_jRfZZ4ItbkzZLtXnWqMa0lgmz89d2INZ1fOLBFUAYXHsBM6y2ukv-1fX_hzxQ=91839BCA";
const JIRA_PROJECT_KEY = "IT";

const base64 = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
const headers = {
  "Authorization": `Basic ${base64}`,
  "Accept": "application/json",
  "Content-Type": "application/json",
};

async function getJiraUserAccountId(email) {
  try {
    console.log(`🔍 Checking Jira account for ${email}...`);
    const response = await axios.get(
      `${JIRA_BASE_URL}/rest/api/3/user/search?query=${encodeURIComponent(email)}`,
      { headers }
    );
    if (response.data.length > 0) {
      console.log(`✅ User ${email} found in Jira.`);
      return response.data[0].accountId;
    } else {
      console.log(`⚠️ User ${email} not found in Jira. Creating user...`);
      const createResponse = await axios.post(
        `${JIRA_BASE_URL}/rest/api/3/user`,
        {
          emailAddress: email,
          displayName: email.split('@')[0],
          products: ["jira-software"],
        },
        { headers }
      );
      console.log(`✅ User ${email} created and invited. Awaiting account activation...`);
      return null;
    }
  } catch (error) {
    console.error("❌ Error checking or creating Jira user:", error.response?.data || error.message);
    return null;
  }
}

// 🔹 Create Jira Ticket (Unauthenticated)
exports.createJiraTicket = async (req, res) => {
  try {
    console.log("🔄 Received Jira Ticket Creation Request:", req.body);
    const { summary, priority, reporterEmail, link, description } = req.body;

    if (!summary || !priority || !reporterEmail || !link || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let accountId = await getJiraUserAccountId(reporterEmail);

    if (!accountId) {
      console.log(`⚠️ User ${reporterEmail} is invited but does not exist yet.`);
      return res.status(400).json({
        message: `User ${reporterEmail} has been invited to Jira. Please activate your account and try again.`,
      });
    }

    console.log("✅ Jira Reporter ID:", accountId);

    const response = await axios.post(
      `${JIRA_BASE_URL}/rest/api/3/issue`,
      {
        fields: {
          project: { key: JIRA_PROJECT_KEY },
          summary: summary,
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: `${description}\nReference Link: ${link}`,
                  },
                ],
              },
            ],
          },
          issuetype: { name: "Task" },
          priority: { name: priority },
          reporter: { accountId: accountId },
        },
      },
      { headers }
    );

    console.log("✅ Jira Ticket Created:", response.data.key);
    res.status(201).json({ ticketUrl: `${JIRA_BASE_URL}/browse/${response.data.key}` });
  } catch (error) {
    console.error("❌ Error creating Jira ticket:", error.response?.data || error.message);
    res.status(500).json({ message: "Jira Integration Failed", error: error.response?.data || error.message });
  }
};

// 🔹 Fetch Jira Tickets (Unauthenticated, Email from Query)
exports.getJiraTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10, email } = req.query; // Email from query params

    if (!email) {
      return res.status(400).json({ message: "Email is required to fetch tickets." });
    }

    console.log(`🔄 Fetching Jira tickets for ${email}, page ${page}, limit ${limit}...`);

    const accountId = await getJiraUserAccountId(email);

    if (!accountId) {
      console.log(`⚠️ User ${email} not found in Jira or account not activated.`);
      return res.status(400).json({
        message: `User ${email} not found in Jira or account not activated.`,
      });
    }

    const startAt = (page - 1) * limit;
    const maxResults = limit;

    const response = await axios.get(
      `${JIRA_BASE_URL}/rest/api/3/search`,
      {
        headers,
        params: {
          jql: `project=${JIRA_PROJECT_KEY} AND reporter="${accountId}"`,
          startAt,
          maxResults,
          fields: "summary,status,created,updated,key",
        },
      }
    );

    const tickets = response.data.issues.map((issue) => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      created: issue.fields.created,
      updated: issue.fields.updated,
      url: `${JIRA_BASE_URL}/browse/${issue.key}`,
    }));

    const totalTickets = response.data.total;

    console.log(`✅ Retrieved ${tickets.length} Jira tickets for ${email}`);

    res.status(200).json({
      tickets,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTickets / limit),
        totalTickets,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching Jira tickets:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to fetch Jira tickets",
      error: error.response?.data || error.message,
    });
  }
};