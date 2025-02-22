const express = require('express');
const auth = require('../middleware/auth');
const commentController = require('../controllers/commentController');

const router = express.Router();

// Create a comment for a template
router.post('/:templateId/comments', auth, commentController.createComment);

// Get all comments for a template
router.get('/:templateId/comments', commentController.getComments);

// Update a comment
router.put('/:commentId', auth, commentController.updateComment);
// delete a comment
router.delete('/:commentId', auth, commentController.deleteComment);


module.exports = router;
