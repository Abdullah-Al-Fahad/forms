// models/TemplateTag.js
module.exports = (sequelize, DataTypes) => {
  const TemplateTag = sequelize.define(
    'TemplateTag',
    {
      templateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Templates',
          key: 'id',
        },
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Tags',
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
    }
  );

  return TemplateTag;
};