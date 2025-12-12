const { Sequelize } = require('sequelize');
const path = require('path');

// Load the configuration from JS file instead of JSON
const config = require(path.join(__dirname, 'config', 'config.js'))[process.env.NODE_ENV || 'development'];

// Debug log
console.log('Database Config:', {
  database: config.database,
  username: config.username,
  host: config.host,
  port: config.port,
  dialect: config.dialect
});

// Create Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  dialectOptions: config.dialectOptions,
  logging: console.log, // Enable for debugging
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err.message);
    console.error('Full error details:', err);
  });

module.exports = { sequelize };