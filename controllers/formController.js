const { Form, Answer, Template,Question } = require('../models');

exports.submitForm = async (req, res) => {
  try {
    console.log('Request received:', req.body);
    const { answers } = req.body;
    console.log('Extracted answers:', answers);

    // Create a new form record
    const form = await Form.create({ userId: req.user.id, templateId: req.params.templateId });
    console.log('Form created:', form);

    // Iterate over the answers object using Object.entries()
    for (const [questionId, value] of Object.entries(answers)) {
      console.log(`Processing answer - questionId: ${questionId}, value: ${value}`);
      await Answer.create({
        value: value,
        questionId: questionId,
        formId: form.id,
      });
      console.log(`Answer saved - questionId: ${questionId}, value: ${value}`);
    }

    console.log('All answers saved successfully');
    res.status(201).json({ message: 'Form submitted successfully.' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
};

// Fetch all forms submitted by the logged-in user
exports.getUserForms = async (req, res) => {
  try {
    const userId = req.user.id;
    const forms = await Form.findAll({
      where: { userId },
      include: [
        {
          model: Template,
          as: 'template',
          attributes: ['title'],
        },
        {
          model: Answer,
          as: 'answers',
          attributes: ['questionId', 'value'],
          include: [
            {
              model: Question,
              as: 'question',
              attributes: ['title'], // Include the question title
            },
          ],
        },
      ],
    });
    res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching user forms:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
};

// Update a specific form submitted by the logged-in user
exports.updateForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    // Find the form to ensure it belongs to the user
    const form = await Form.findOne({
      where: { id: formId, userId },
      include: [{ model: Answer, as: 'answers' }],
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found or unauthorized.' });
    }

    // Update or create answers
    for (const [questionId, value] of Object.entries(answers)) {
      const answer = form.answers.find((a) => a.questionId === parseInt(questionId));
      if (answer) {
        answer.value = value;
        await answer.save();
      } else {
        await Answer.create({
          value: value,
          questionId: questionId,
          formId: form.id,
        });
      }
    }

    res.status(200).json({ message: 'Form updated successfully.' });
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
};