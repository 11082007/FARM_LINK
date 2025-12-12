// config/database.js
require('dotenv').config();

// Helper function to detect Railway
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.MYSQLHOST;

// Determine environment
const env = process.env.NODE_ENV || 'development';

console.log('Database Config Environment:', env);
console.log('Is Railway?', isRailway);

const config = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'Farm_link',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: (process.env.DB_NAME || 'Farm_link') + '_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql'
  },
  production: {
    username: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
    host: process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: isRailway ? {
        require: true,
        rejectUnauthorized: false
      } : undefined
    }
  }
};

// If Railway is detected but NODE_ENV is not production, warn
if (isRailway && env !== 'production') {
  console.log('⚠️ WARNING: Railway detected but NODE_ENV is not production!');
  console.log('Using production config for Railway...');
}

module.exports = config;