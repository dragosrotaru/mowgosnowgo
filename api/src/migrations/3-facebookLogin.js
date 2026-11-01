module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'facebookID',
    {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  ),
  down: queryInterface => queryInterface.removeColumn('users', 'facebookID'),
};
