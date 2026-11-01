// User
module.exports = function model(sequelize, DataTypes) {
  const User = sequelize.define('users', {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.TEXT,
    },
    phone: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.TEXT,
    },
    facebookID: {
      type: DataTypes.TEXT,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
    },
  });
  User.associate = models => User.hasMany(models.Service);
  return User;
};
