// Imports
import { Sequelize } from 'sequelize';
import Debug from 'debug';

// App Imports
import config from './config';

const debug = Debug('main');

// Load database config
const databaseConfig = config.database;

// Create new database connection
const connection = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password, {
    host: databaseConfig.host,
    dialect: databaseConfig.dialect,
    logging: false,
    operatorsAliases: Sequelize.Op,
  },
);

// Test connection
debug('SETUP - Connecting database...');

connection
  .authenticate()
  .then(() => {
    debug('INFO - Database connected.');
  })
  .catch((err) => {
    debug('ERROR - Unable to connect to the database:', err);
  });

export default connection;
