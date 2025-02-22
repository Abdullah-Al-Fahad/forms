const express = require('express');
const auth = require('../middleware/auth'); // Correct way
const templateController = require('../controllers/templateController');
const router = express.Router();
console.log('Auth middleware:', auth); // Should log a function
console.log('Template Controller:', templateController); // Should log an object
console.log('Create Template Function:', templateController.createTemplate); // Should log a function
// Create a new template
router.post('/', auth, templateController.createTemplate);

// Get all templates
router.get('/', templateController.getTemplates);

// Get a single template by ID
router.get('/:id', templateController.getTemplateById);

// Update a template
router.put('/:id', auth, templateController.updateTemplate);

// Delete a template
router.delete('/:id', auth, templateController.deleteTemplate);
// GET RESULTS
router.get('/:id/results', templateController.getTemplateResults);


module.exports = router;