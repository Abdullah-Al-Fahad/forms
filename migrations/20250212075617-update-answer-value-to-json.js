'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add a temporary column of type JSON
    await queryInterface.addColumn('Answers', 'value_temp', {
      type: Sequelize.JSON,
      allowNull: true, // Allow null temporarily
    });

    // Step 2: Copy and convert data from the old column to the new column
    await queryInterface.sequelize.query(`
      UPDATE "Answers"
      SET "value_temp" = CASE
        WHEN "value" IS NULL THEN NULL
        ELSE json_build_object('value', "value") -- Wrap the string value in a JSON object
      END;
    `);

    // Step 3: Drop the old column
    await queryInterface.removeColumn('Answers', 'value');

    // Step 4: Rename the temporary column to the original column name
    await queryInterface.renameColumn('Answers', 'value_temp', 'value');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes if needed
    await queryInterface.addColumn('Answers', 'value_temp', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Convert JSON back to string
    await queryInterface.sequelize.query(`
      UPDATE "Answers"
      SET "value_temp" = "value"->>'value'; -- Extract the string value from the JSON object
    `);

    await queryInterface.removeColumn('Answers', 'value');
    await queryInterface.renameColumn('Answers', 'value_temp', 'value');
  },
};