'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Questions', 'options', {
      type: Sequelize.JSON, // Use JSON to store arrays of options
      allowNull: true, // Allow NULL for question types that don't use options
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Questions', 'options');
  },
};