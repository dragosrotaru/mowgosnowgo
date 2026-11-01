// Service
module.exports = function model(sequelize, DataTypes) {
  const Service = sequelize.define('services', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    mapsURL: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lat: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    lng: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    date: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
    },
    extras: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    comments: {
      type: DataTypes.TEXT,
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    price: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    paymentToken: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
  });
  Service.associate = models => Service.belongsTo(models.User);
  return Service;
};
