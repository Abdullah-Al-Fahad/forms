const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login a user
router.post('/login', authController.login);

// Salesforce Routes 
router.post('/salesforce/create-account', authController.createSalesforceAccount);

router.post('/jira/create-ticket', authController.createJiraTicket); // Unauthenticated
router.get('/jira/tickets', authController.getJiraTickets); // Unauthenticated

module.exports = router;
