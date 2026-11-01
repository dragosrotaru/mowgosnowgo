var bcrypt = require('bcrypt');
var config = require('../config');

// Development seed data. Passwords come from the environment so none are committed.
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [
    {
      name: 'Admin',
      email: 'admin@example.com',
      phone: '5555550100',
      password: bcrypt.hashSync(process.env.SEED_ADMIN_PASSWORD || 'change-me', config.saltRounds),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Test User',
      email: 'user@example.com',
      phone: '5555550101',
      password: bcrypt.hashSync(process.env.SEED_USER_PASSWORD || 'change-me', config.saltRounds),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {}),
};
