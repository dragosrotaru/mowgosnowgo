module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    email: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    phone: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    password: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    role: {
      allowNull: false,
      type: Sequelize.ENUM('user', 'admin'),
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('users'),
};
