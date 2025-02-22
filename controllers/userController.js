const { User } = require('../models');

// GET /api/users/me - Fetch logged-in user's profile
exports.getProfile = async (req, res) => {
  try {
    console.log("Incoming request to fetch profile. User:", req.user); // Log the user making the request

    // Fetch the logged-in user's details from the database
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role', 'theme'], // Exclude sensitive fields like password
    });

    if (!user) {
      console.log("User not found. ID:", req.user.id); // Log if user is not found
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log("Fetched profile for user:", user.username); // Log the success
    res.status(200).json(user); // Return the user's profile data
  } catch (error) {
    console.error("Error fetching profile:", error); // Log any errors
    res.status(500).json({ message: 'Server error.', error });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    console.log("Incoming request to fetch all users. User:", req.user); // Log the user making the request

    // Ensure the user making the request is an admin
    if (req.user.role !== 'admin') {
      console.log("Access denied. User role:", req.user.role); // Log access denial reason
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Fetch all users from the database
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'isBlocked', 'theme'], // Exclude sensitive fields like password
    });

    console.log("Fetched users:", users.length); // Log number of users retrieved
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error); // Log any errors
    res.status(500).json({ message: 'Server error.', error });
  }
};

// Block/unblock a user (admin only)
exports.blockUser = async (req, res) => {
  try {
    console.log("Incoming request to block/unblock user. User ID:", req.params.id, "Requesting user:", req.user); // Log the action and requesting user

    // Ensure the user making the request is an admin
    if (req.user.role !== 'admin') {
      console.log("Access denied. User role:", req.user.role); // Log access denial reason
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const userId = req.params.id;

    // Find the user to block/unblock
    const user = await User.findByPk(userId);
    if (!user) {
      console.log("User not found. ID:", userId); // Log if user is not found
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log("User found:", user.username, "Current Blocked Status:", user.isBlocked); // Log the current status before toggle

    // Toggle the `isBlocked` status
    user.isBlocked = !user.isBlocked;
    await user.save();

    console.log("User block/unblock status updated:", user.isBlocked); // Log the new status after update
    res.status(200).json({
      message: user.isBlocked ? 'User blocked successfully.' : 'User unblocked successfully.',
      user,
    });
  } catch (error) {
    console.error("Error blocking/unblocking user:", error); // Log any errors
    res.status(500).json({ message: 'Server error.', error });
  }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    console.log("Incoming request to delete user. User ID:", req.params.id, "Requesting user:", req.user); // Log the action and requesting user

    // Ensure the user making the request is an admin
    if (req.user.role !== 'admin') {
      console.log("Access denied. User role:", req.user.role); // Log access denial reason
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const userId = req.params.id;

    // Find the user to delete
    const user = await User.findByPk(userId);
    if (!user) {
      console.log("User not found. ID:", userId); // Log if user is not found
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log("User found:", user.username, "Deleting user..."); // Log user info before deletion

    // Delete the user
    await user.destroy();

    console.log("User deleted successfully. ID:", userId); // Log the success
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error("Error deleting user:", error); // Log any errors
    res.status(500).json({ message: 'Server error.', error });
  }
};

// Grant or revoke admin privileges (admin only)
exports.toggleAdminPrivilege = async (req, res) => {
  try {
    console.log("Incoming request to toggle admin privilege. User ID:", req.params.id, "Requesting user:", req.user); // Log the action and requesting user

    // Ensure the user making the request is an admin
    if (req.user.role !== 'admin') {
      console.log("Access denied. User role:", req.user.role); // Log access denial reason
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const userId = req.params.id;

    // Find the user to update
    const user = await User.findByPk(userId);
    if (!user) {
      console.log("User not found. ID:", userId); // Log if user is not found
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log("User found:", user.username, "Current Role:", user.role); // Log current role before toggle

    // Toggle the `role` between 'admin' and 'user'
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    console.log("User role updated:", user.role); // Log new role after update
    res.status(200).json({
      message: user.role === 'admin' ? 'User granted admin privileges.' : 'User admin privileges revoked.',
      user,
    });
  } catch (error) {
    console.error("Error toggling admin privilege:", error); // Log any errors
    res.status(500).json({ message: 'Server error.', error });
  }
};