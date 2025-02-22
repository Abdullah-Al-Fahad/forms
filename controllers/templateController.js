const { Template, Question, Tag, Form, Answer, User } = require('../models');

// Fetch results for a template
exports.getTemplateResults = async (req, res) => {
  try {
    const { id } = req.params; // Template ID
    console.log("Fetching results for template ID:", id);

    // Fetch all forms (submissions) for the template
    const forms = await Form.findAll({
      where: { templateId: id },
      include: [
        {
          model: Answer,
          as: 'answers',
          attributes: ['questionId', 'value'], // Include question ID and answer value
        },
        {
          model: User,
          as: 'user',
          attributes: ['username'], // Include the username of the submitter
        },
      ],
    });
    console.log("Fetched forms:", forms.length);
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching template results:", error);
    res.status(500).json({ message: 'Server error.', error });
  }
};

// Validation function for questions
const validateQuestions = (questions) => {
  if (!Array.isArray(questions)) {
    throw new Error('Questions must be an array.');
  }
  questions.forEach((q, index) => {
    console.log(`Validating question at index ${index}:`, q);
    if (!q.title || !q.type) {
      throw new Error(`Question at index ${index} is missing required fields (title, type).`);
    }
    if (q.type === 'checkbox' && (!Array.isArray(q.options) || q.options.length === 0)) {
      throw new Error(`Checkbox question at index ${index} must have valid options.`);
    }
  });
  console.log("All questions passed validation.");
};

// Create a new template
exports.createTemplate = async (req, res) => {
  try {
    const { title, description, imageUrl, isPublic, tags, questions, topic } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    // Create the template
    const template = await Template.create({
      title,
      description,
      imageUrl,
      isPublic,
      topic,
      userId: req.user.id, // Assuming user is authenticated
    });

    // Handle tags
    if (tags && Array.isArray(tags)) {
      const tagPromises = tags.map(async (tagName) => {
        let tag = await Tag.findOne({ where: { name: tagName } });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        return tag.id;
      });

      const tagIds = await Promise.all(tagPromises);
      await template.setTags(tagIds); // Associate tags with the template
    }

    // Handle questions
    if (questions && Array.isArray(questions)) {
      const questionPromises = questions.map((q, index) =>
        Question.create({
          title: q.title,
          description: q.description || null,
          type: q.type,
          options: q.type === 'checkbox' ? q.options : null,
          isDisplayedInTable: q.isDisplayedInTable || false,
          position: q.position || index,
          templateId: template.id,
        })
      );
      await Promise.all(questionPromises);
    }

    res.status(201).json(template);
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get all templates
exports.getTemplates = async (req, res) => {
  try {
    console.log("Fetching all templates...");
    const templates = await Template.findAll({
      include: [
        { model: Tag, as: 'tags' }, // Include associated tags
        {
          model: Question,
          as: 'questions',
          attributes: ['id', 'title', 'type', 'options', 'position'], // Ensure options are included
          order: [['position', 'ASC']],
        },
      ],
    });
    console.log("Templates retrieved:", templates.length);
    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get a single template by ID
exports.getTemplateById = async (req, res) => {
  try {
    console.log("Fetching template by ID:", req.params.id);
    
    const template = await Template.findByPk(req.params.id, {
      include: [
        {
          model: Question,
          as: 'questions',
          attributes: ['id', 'title', 'type', 'options', 'position'], // Include necessary fields
        },
        { model: Tag, as: 'tags' }, // Include tags if needed
      ],
      order: [[{ model: Question, as: 'questions' }, 'position', 'ASC']], // ✅ Correct ordering here
    });

    if (!template) {
      console.error("Template not found with ID:", req.params.id);
      return res.status(404).json({ message: 'Template not found.' });
    }

    console.log("Template found with ID:", template.id);
    res.status(200).json(template);
  } catch (error) {
    console.error("Error fetching template by ID:", error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Update a template
exports.updateTemplate = async (req, res) => {
  try {
    const { title, description, imageUrl, isPublic, tags, questions, topic } = req.body;
    console.log("Updating template with data:", { title, description, imageUrl, isPublic, tags, questions, topic });

    const template = await Template.findByPk(req.params.id);
    if (!template) {
      console.error("Template not found with ID:", req.params.id);
      return res.status(404).json({ message: 'Template not found.' });
    }

    console.log("Updating template fields:", { title, description, imageUrl, isPublic, topic });
    await template.update({ 
      title, 
      description, 
      imageUrl, 
      isPublic,
      topic, // Add topic here
    });

    // Handle tags if provided
    if (tags && Array.isArray(tags)) {
      console.log("Updating tags:", tags);

      // Find or create tags
      const tagPromises = tags.map(async (tagName) => {
        let tag = await Tag.findOne({ where: { name: tagName } });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        return tag.id;
      });

      const tagIds = await Promise.all(tagPromises);

      // Associate tags with the template
      await template.setTags(tagIds);
      console.log("Tags updated successfully:", tagIds);
    }

    // Update or create questions if provided
    if (questions && Array.isArray(questions)) {
      validateQuestions(questions); // Validate questions
      const existingQuestions = await template.getQuestions();
      const updatedQuestionIds = questions.map((q) => q.id);
      const questionsToDelete = existingQuestions.filter((q) => !updatedQuestionIds.includes(q.id));

      console.log("Deleting questions:", questionsToDelete.map((q) => q.id));
      await Promise.all(questionsToDelete.map((q) => q.destroy()));

      const questionPromises = questions.map(async (q, index) => {
        if (q.id) {
          // Update existing question
          const existingQuestion = await Question.findByPk(q.id);
          if (existingQuestion) {
            await existingQuestion.update({
              title: q.title,
              description: q.description || null,
              type: q.type,
              options: q.type === 'checkbox' ? q.options : null,
              isDisplayedInTable: q.isDisplayedInTable || false,
              position: q.position !== undefined ? q.position : index,
            });
          }
        } else {
          // Create new question
          console.log(`Creating new question with title: ${q.title}`);
          await Question.create({
            title: q.title,
            description: q.description || null,
            type: q.type,
            options: q.type === 'checkbox' ? q.options : null,
            isDisplayedInTable: q.isDisplayedInTable || false,
            position: q.position || index,
            templateId: template.id,
          });
        }
      });

      await Promise.all(questionPromises);
      console.log("Questions updated successfully.");
    }

    res.status(200).json({ message: 'Template updated successfully.' });
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
// Delete a template (soft delete)
exports.deleteTemplate = async (req, res) => {
  try {
    console.log("Deleting template with ID:", req.params.id);
    const template = await Template.findByPk(req.params.id);

    if (!template) {
      console.error("Template not found with ID:", req.params.id);
      return res.status(404).json({ message: 'Template not found.' });
    }

    console.log("Template found, deleting template...");
    await template.destroy(); // Use soft delete if enabled
    res.status(200).json({ message: 'Template deleted successfully.' });
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};