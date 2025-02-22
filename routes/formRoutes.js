const express = require('express');
const auth = require('../middleware/auth');
const formController = require('../controllers/formController');
const router = express.Router();

// Submit a form for a template
router.post('/:templateId', auth, formController.submitForm);


// Get all forms submitted by the logged-in user
router.get('/me/forms', auth, formController.getUserForms);

// Update a specific form submitted by the logged-in user
router.put('/:formId', auth, formController.updateForm);
module.exports = router;