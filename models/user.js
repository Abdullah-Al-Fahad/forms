module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      theme: {
        type: DataTypes.ENUM('light', 'dark'),
        defaultValue: 'light',
      },
    },
    {
      timestamps: true,
    }
  );

  // Relationships
  User.associate = (models) => {
    User.hasMany(models.Template, { foreignKey: 'userId', as: 'templates' });
    User.hasMany(models.Form, { foreignKey: 'userId', as: 'forms' });
    User.hasMany(models.Comment, { foreignKey: 'userId', as: 'comments' });
    User.hasMany(models.Like, { foreignKey: 'userId', as: 'likes' });
  };

  return User;
};