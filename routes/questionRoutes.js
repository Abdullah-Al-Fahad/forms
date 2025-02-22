const express = require('express');
const auth = require('../middleware/auth');
const questionController = require('../controllers/questionController');

const router = express.Router();

// Create a new question for a template
router.post('/:templateId/questions', auth, questionController.createQuestion);

// Reorder questions for a template
router.put('/:templateId/questions/reorder', auth, questionController.reorderQuestions);




module.exports = router;