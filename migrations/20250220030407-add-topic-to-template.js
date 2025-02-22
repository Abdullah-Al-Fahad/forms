// migrations/YYYYMMDDHHMMSS-add-topic-to-template.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Templates', 'topic', {
      type: Sequelize.STRING, // Use the appropriate type (STRING for simple text)
      allowNull: true,         // Set to true to make this column to be optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Templates', 'topic');
  },
};
