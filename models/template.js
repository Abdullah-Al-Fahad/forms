// models/Template.js
module.exports = (sequelize, DataTypes) => {
  const Template = sequelize.define(
    'Template',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      topic: { // Add the new topic column here
        type: DataTypes.STRING, // Use STRING for a simple text field
        allowNull: true,        // Allow NULL values if it's optional
      },
    },
    {
      timestamps: true,
    }
  );

  // Relationships
  Template.associate = (models) => {
    Template.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
    Template.hasMany(models.Question, { foreignKey: 'templateId', as: 'questions' });
    Template.hasMany(models.Form, { foreignKey: 'templateId', as: 'forms' });
    Template.belongsToMany(models.Tag, {
      through: 'TemplateTags',
      as: 'tags',
      foreignKey: 'templateId', 
      otherKey: 'tagId',        
    });
    Template.hasMany(models.Comment, { foreignKey: 'templateId', as: 'comments' });
    Template.hasMany(models.Like, { foreignKey: 'templateId', as: 'likes' });
  };

  return Template;
};
