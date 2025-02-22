// migrations/YYYYMMDDHHMMSS-update-answer-value-to-text.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Answers', 'value', {
      type: Sequelize.TEXT, // Change the type to TEXT
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Answers', 'value', {
      type: Sequelize.STRING, // Revert back to STRING if needed
      allowNull: false,
    });
  },
};