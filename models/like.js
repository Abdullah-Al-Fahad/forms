module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {},
    {
      timestamps: true,
    }
  );

  // Relationships
  Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Like.belongsTo(models.Template, { foreignKey: 'templateId', as: 'template' });
  };

  return Like;
};