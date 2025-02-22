module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    'Question',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      type: {
        type: DataTypes.ENUM('single-line', 'multi-line', 'integer', 'checkbox'),
        allowNull: false,
      },
      isDisplayedInTable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      options: {
        type: DataTypes.JSON, // Add the options field
        allowNull: true, // Allow NULL for non-checkbox questions
      },
    },
    {
      timestamps: true,
    }
  );

  // Relationships
  Question.associate = (models) => {
    Question.belongsTo(models.Template, { foreignKey: 'templateId', as: 'template' });
    Question.hasMany(models.Answer, { foreignKey: 'questionId', as: 'answers' });
  };

  return Question;
};