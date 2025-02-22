const { Tag, Template, TemplateTags } = require('../models'); // Import models
const { Op } = require('sequelize'); // Import Sequelize utilities
const { sequelize } = require('../models'); // Adjust the path as needed

exports.autocompleteTags = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const tags = await Tag.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`, // Case-insensitive partial match
        },
      },
      limit: 10,
    });

    res.status(200).json(tags);
  } catch (error) {
    console.error("Error in autocompleteTags:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Tag name is required.' });
    }

    const tag = await Tag.create({ name });
    res.status(201).json(tag);
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get Popular Tags
exports.getPopularTags = async (req, res) => {
  try {
    console.log("Fetching all templates to calculate popular tags...");

    // Fetch all templates with their associated tags
    const templates = await Template.findAll({
      include: [
        { model: Tag, as: 'tags' }, // Include associated tags
      ],
    });

    console.log("Templates retrieved:", templates.length);

    // Count tag frequency
    const tagFrequency = {};

    templates.forEach((template) => {
      template.tags.forEach((tag) => {
        if (tagFrequency[tag.id]) {
          tagFrequency[tag.id].count += 1;
        } else {
          tagFrequency[tag.id] = {
            id: tag.id,
            name: tag.name,
            count: 1,
          };
        }
      });
    });

    // Convert tagFrequency object to an array
    const tagArray = Object.values(tagFrequency);

    // Sort tags by count in descending order
    tagArray.sort((a, b) => b.count - a.count);

    // Limit to top 10 popular tags
    const popularTags = tagArray.slice(0, 10);

    res.status(200).json(popularTags);
  } catch (error) {
    console.error("Error fetching popular tags:", error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};