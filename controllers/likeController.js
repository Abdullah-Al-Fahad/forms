const { Like } = require('../models');

exports.likeTemplate = async (req, res) => {
  try {
    const like = await Like.create({
      userId: req.user.id,
      templateId: req.params.templateId,
    });
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

exports.unlikeTemplate = async (req, res) => {
  try {
    const deleted = await Like.destroy({
      where: { userId: req.user.id, templateId: req.params.templateId },
    });
    if (deleted === 0) return res.status(404).json({ message: 'Like not found.' });
    res.status(200).json({ message: 'Template unliked successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

// 
exports.getLikes = async (req, res) => {
  try {
    const templateId = req.params.templateId;
    const userId = req.user?.id; // Optional, if user is authenticated

    // Count total likes for the template
    const count = await Like.count({ where: { templateId } });

    // Check if the user has liked the template
    let userLiked = false;
    if (userId) {
      const like = await Like.findOne({ where: { templateId, userId } });
      userLiked = !!like;
    }

    res.status(200).json({ count, userLiked });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};
