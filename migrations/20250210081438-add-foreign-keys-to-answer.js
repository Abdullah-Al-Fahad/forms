module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if questionId exists
    const questionIdExists = await queryInterface.describeTable('Answers').then(
      (table) => 'questionId' in table
    );

    if (!questionIdExists) {
      await queryInterface.addColumn('Answers', 'questionId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Questions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }

    // Check if formId exists
    const formIdExists = await queryInterface.describeTable('Answers').then(
      (table) => 'formId' in table
    );

    if (!formIdExists) {
      await queryInterface.addColumn('Answers', 'formId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Forms',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns only if they exist
    await queryInterface.removeColumn('Answers', 'questionId').catch(() => {});
    await queryInterface.removeColumn('Answers', 'formId').catch(() => {});
  },
};