const { Question } = require('../models');

// Create a new question for a template
exports.createQuestion = async (req, res) => {
  try {
    const { title, description, type, isDisplayedInTable, position } = req.body;

    // Log incoming request data
    console.log("Creating a new question with data:", {
      title,
      description,
      type,
      isDisplayedInTable,
      position,
      templateId: req.params.templateId,
    });

    // Validate required fields
    if (!title || !type) {
      console.error("Validation failed: Title or type is missing.");
      return res.status(400).json({ message: 'Title and type are required.' });
    }

    // Create the question
    const question = await Question.create({
      title,
      description,
      type,
      isDisplayedInTable,
      position,
      templateId: req.params.templateId,
    });

    console.log("Question created successfully with ID:", question.id);
    res.status(201).json(question);
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Reorder questions for a template
exports.reorderQuestions = async (req, res) => {
  try {
    const { questionIds } = req.body;

    // Log incoming request data
    console.log("Reordering questions with IDs:", questionIds);

    // Validate input
    if (!Array.isArray(questionIds)) {
      console.error("Invalid input: questionIds must be an array.");
      return res.status(400).json({ message: 'Invalid input: questionIds must be an array.' });
    }

    // Ensure all question IDs exist and belong to the specified template
    console.log("Fetching questions to validate IDs...");
    const questions = await Question.findAll({
      where: { id: questionIds, templateId: req.params.templateId },
    });

    if (questions.length !== questionIds.length) {
      console.error("One or more question IDs are invalid or do not belong to this template.");
      return res.status(400).json({ message: 'One or more question IDs are invalid or do not belong to this template.' });
    }

    console.log("All question IDs are valid. Updating positions...");

    // Update positions using bulk update
    await Question.bulkCreate(
      questionIds.map((id, index) => ({
        id,
        position: index,
      })),
      { updateOnDuplicate: ['position'] }
    );

    console.log("Questions reordered successfully.");
    res.status(200).json({ message: 'Questions reordered successfully.' });
  } catch (error) {
    console.error("Error reordering questions:", error);
    res.status(500).json({ message: 'Failed to reorder questions.', error: error.message });
  }
};