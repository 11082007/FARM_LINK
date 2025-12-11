// seeders/seedDatabase.js - MAIN FILE
const { sequelize } = require('../sequelize');
const runAllSeeders = require('./_runAll');

async function seedDatabase() {
  console.log('STARTING DATABASE SEEDING\n');
  await runAllSeeders();
}


// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;