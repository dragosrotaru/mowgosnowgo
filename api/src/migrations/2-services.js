module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('services', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
    address: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    mapsURL: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    lat: {
      allowNull: false,
      type: Sequelize.FLOAT,
    },
    lng: {
      allowNull: false,
      type: Sequelize.FLOAT,
    },
    date: {
      allowNull: false,
      type: Sequelize.DATEONLY,
    },
    type: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    size: {
      type: Sequelize.STRING,
    },
    extras: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    comments: {
      type: Sequelize.TEXT,
    },
    status: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    price: {
      allowNull: false,
      type: Sequelize.FLOAT,
    },
    paymentToken: {
      allowNull: true,
      type: Sequelize.TEXT,
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
  down: queryInterface => queryInterface.dropTable('services'),
};
