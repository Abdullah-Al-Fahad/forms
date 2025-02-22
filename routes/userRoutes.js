const express = require('express');
const auth = require('../middleware/auth'); // Correct way
const userController = require('../controllers/userController'); // Controller functions

const router = express.Router();

// GET /api/users/me - Fetch logged-in user's profile
router.get('/me', auth, userController.getProfile);

// Get all users (admin only)
router.get('/', auth, userController.getAllUsers);

// Block/unblock a user (admin only)
router.put('/:id/block', auth, userController.blockUser);

// Delete a user (admin only)
router.delete('/:id', auth, userController.deleteUser);

// Grant/revoke admin privileges (admin only)
router.put('/:id/admin', auth, userController.toggleAdminPrivilege);

module.exports = router;
