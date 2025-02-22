'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'theme', {
      type: Sequelize.STRING,
      allowNull: true, // Allows NULL values (change to false if required)
      defaultValue: 'light', // Optional default value
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'theme');
  }
};
