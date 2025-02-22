const { Comment, User } = require('../models');

exports.createComment = async (req, res) => {
  try {
    console.log('Received request to create comment:', req.body);
    
    const { content } = req.body;
    const comment = await Comment.create({
      content,
      userId: req.user.id,
      templateId: req.params.templateId,
    });
    
    console.log('Comment created successfully:', comment);
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
};

exports.updateComment = async (req, res) => {
  try {
    console.log('Updating comment:', req.params.commentId);

    const { content } = req.body;
    const comment = await Comment.findByPk(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    // Check if the user owns the comment
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this comment.' });
    }

    comment.content = content;
    await comment.save();

    console.log('Comment updated successfully:', comment);
    res.status(200).json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
};
exports.deleteComment = async (req, res) => {
  try {
    console.log('Deleting comment:', req.params.commentId);

    const comment = await Comment.findByPk(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    // Check if the user owns the comment
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment.' });
    }

    await comment.destroy();

    console.log('Comment deleted successfully.');
    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
};


exports.getComments = async (req, res) => {
  try {
    console.log('Fetching comments for templateId:', req.params.templateId);
    
    const comments = await Comment.findAll({
      where: { templateId: req.params.templateId },
      include: [{ model: User, as: 'user' }],
      order: [['createdAt', 'ASC']]
    });
    
    console.log('Comments retrieved successfully:', comments);
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
};
