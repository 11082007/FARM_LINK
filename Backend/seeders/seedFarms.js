const db = require('../models');

async function seedFarms(users) {
  console.log(' Seeding farms...');
  
  try {
    // If users not provided, fetch them
    if (!users) {
      users = await db.User.findAll();
    }
    
   
    
    const farms = [
      {
        name: 'Green Valley Organic Farm',
        location: 'Lagos, Nigeria',
        userId: users[0].id // Ore's farm
      },
      {
        name: 'Sunrise Poultry Farm',
        location: 'Ibadan, Nigeria',
        userId: users[0].id // Ore's second farm
      },
      {
        name: 'Golden Harvest Fields',
        location: 'Abuja, Nigeria',
        userId: users[3].id // Meme's farm
      },
      {
        name: 'Fresh Produce Co-op',
        location: 'Enugu, Nigeria',
        userId: users[3].id // Meme's second farm
      }
    ];
    
    const createdFarms = await db.Farm.bulkCreate(farms);
    
    console.log(`Created ${createdFarms.length} farms`);
    return createdFarms;
    
  } catch (error) {
    console.error('Error seeding farms:', error.message);
    throw error;
  }
}

module.exports = seedFarms;