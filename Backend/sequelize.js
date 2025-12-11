const { Sequelize } = require('sequelize');
const path = require('path');

// Load the configuration
const config = require(path.join(__dirname, 'config', 'config.json')).development;

// Create a new Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

module.exports = { sequelize };