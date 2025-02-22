// auth.jsx
const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.isBlocked || user.deletedAt) {
      return res.status(401).json({ message: 'Access denied. Account is blocked, deleted, or invalid.' });
    }

    req.user = user;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};