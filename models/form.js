module.exports = (sequelize, DataTypes) => {
  const Form = sequelize.define(
    'Form',
    {},
    {
      timestamps: true,
    }
  );

  // Relationships
  Form.associate = (models) => {
    Form.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Form.belongsTo(models.Template, { foreignKey: 'templateId', as: 'template' });
    Form.hasMany(models.Answer, { foreignKey: 'formId', as: 'answers' });
  };

  return Form;
};