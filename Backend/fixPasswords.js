const db = require('./models');
const bcrypt = require('bcryptjs');

async function fixPasswords() {
  console.log('Fixing passwords with unique hashes...');
  
  const users = await db.User.findAll();
  
  for (const user of users) {
    // Generate a UNIQUE hash for each user (even with same password)
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash('password123', salt);
    
    await user.update({
      password_hash: newHash
    });
    
    console.log(`Updated ${user.emailAddress}`);
    console.log(`   New hash: ${newHash.substring(0, 30)}...`);
  }
  
  console.log('\nAll passwords reset to "password123" (with unique hashes)');
  
  // Verify the fix
  console.log('\nVerifying fix...');
  for (const user of users) {
    const isValid = bcrypt.compareSync('password123', user.password_hash);
    console.log(`${user.emailAddress}: ${isValid ? 'OK' : 'ERROR'} password123 works`);
  }
  
  process.exit();
}

fixPasswords();