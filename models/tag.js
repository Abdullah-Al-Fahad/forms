// models/Tag.js
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  // Relationships
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Template, {
      through: 'TemplateTags',
      as: 'templates',
    foreignKey: 'tagId',        // Matches the column name in the database
    otherKey: 'templateId',     // Matches the column name in the database
    });
  };

  return Tag;
};

