const express = require('express');
const auth = require('../middleware/auth');
const likeController = require('../controllers/likeController');

const router = express.Router();

// Like a template
router.post('/:templateId/likes', auth, likeController.likeTemplate);

// Unlike a template
router.delete('/:templateId/likes', auth, likeController.unlikeTemplate);
// New route to get like count and user like status
router.get('/:templateId/likes', auth, likeController.getLikes);
module.exports = router;