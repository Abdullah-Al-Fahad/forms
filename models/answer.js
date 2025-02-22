module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define(
    'Answer',
    {
      value: {
        type: DataTypes.JSON, // Changed from STRING to JSON
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Questions', // Reference to the Question model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      formId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Forms', // Reference to the Form model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      timestamps: true,
    }
  );

  // Relationships
  Answer.associate = (models) => {
    Answer.belongsTo(models.Question, { foreignKey: 'questionId', as: 'question' });
    Answer.belongsTo(models.Form, { foreignKey: 'formId', as: 'form' });
  };

  return Answer;
};