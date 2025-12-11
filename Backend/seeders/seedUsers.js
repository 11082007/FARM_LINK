const bcrypt = require('bcryptjs');
const db = require('../models');

async function seedUsers() {
  console.log('Seeding users...');
  
  try {
   
    // Hash password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const usersData = [
      {
        firstName: 'Oreoluwa',
        lastName: 'Owoade',
        emailAddress: 'ore@example.com',
        phoneNumber: '+2348012345678',
        password_hash: hashedPassword,
        userType: 'farmer',
        location: 'Lagos, Nigeria'
      },
      {
        firstName: 'Vincent',
        lastName: 'Buyer',
        emailAddress: 'vincent@example.com',
        phoneNumber: '+2348023456789',
        password_hash: hashedPassword,
        userType: 'buyer',
        location: 'Abuja, Nigeria'
      },
      {
        firstName: 'Fiyin',
        lastName: 'Searcher',
        emailAddress: 'fiyin@example.com',
        phoneNumber: '+2348034567890',
        password_hash: hashedPassword,
        userType: 'buyer',
        location: 'Ibadan, Nigeria'
      },
      {
        firstName: 'Meme',
        lastName: 'Farmer',
        emailAddress: 'meme@example.com',
        phoneNumber: '+2348045678901',
        password_hash: hashedPassword,
        userType: 'farmer',
        location: 'Enugu, Nigeria'
      }
    ];
   

   const createdUsers = [];
    
    // Create users one by one to get better error messages
    for (const userData of usersData) {
      try {
        console.log(`Creating user: ${userData.emailAddress}`);
        const user = await db.User.create(userData);
        createdUsers.push(user);
        console.log(` Created: ${user.emailAddress}`);
      } catch (userError) {
        console.error(` FAILED to create ${userData.emailAddress}:`);
        console.error(`   Error: ${userError.message}`);
        if (userError.errors) {
          userError.errors.forEach(err => {
            console.error(`   - ${err.path}: ${err.message} (value: "${err.value}")`);
          });
        }
        throw userError; // Stop on first error
      }
    }
    
    console.log(`\n Successfully created ${createdUsers.length} users`);
    return createdUsers;
    
  } catch (error) {
    console.error('Error in seedUsers:', error.message);
    throw error;
  }
}

module.exports = seedUsers;