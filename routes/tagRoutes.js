const express = require('express');
const tagController = require('../controllers/tagController');

const router = express.Router();

router.get('/autocomplete', tagController.autocompleteTags);
// Create a new tag
router.post('/', tagController.createTag);
router.get('/popular', tagController.getPopularTags);

module.exports = router;
