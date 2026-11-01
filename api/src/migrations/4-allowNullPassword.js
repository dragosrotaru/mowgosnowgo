module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'users',
    'password',
    {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  ),
  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'users',
    'password',
    {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  ),
};
