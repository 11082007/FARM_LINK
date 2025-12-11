// seeders/_runAll.js
const { sequelize } = require('../sequelize');
const db = require('../models');

async function clearAllData() {
    console.log(' Clearing ALL data in correct order...\n');
    
    try {
        // DELETE in REVERSE order of dependencies
        // Inquiries → Products → Farms → Users
        
        console.log('1. Deleting Inquiries...');
        await db.Inquiry.destroy({ where: {} });
        
        console.log('2. Deleting Products...');
        await db.Product.destroy({ where: {} });
        
        console.log('3. Deleting Farms...');
        await db.Farm.destroy({ where: {} });
        
        console.log('4. Deleting Users...');
        await db.User.destroy({ where: {} });
        
        console.log('\n All tables cleared successfully!\n');
        
    } catch (error) {
        console.error(' Error clearing data:', error.message);
        throw error;
    }
}

async function runAllSeeders() {
    try {
        await sequelize.authenticate();
        console.log(' Starting all seeders...\n');
        
        // 1. Clear everything first (in correct order)
        await clearAllData();
        
        // 2. Run seeders in FORWARD order
        // Users → Farms → Products → Inquiries
        
        console.log('👥 Seeding Users...');
        const seedUsers = require('./seedUsers');
        const users = await seedUsers();
        
        console.log('🏡 Seeding Farms...');
        const seedFarms = require('./seedFarms');
        const farms = await seedFarms(users);
        
        console.log('🥦 Seeding Products...');
        const seedProducts = require('./seedProducts');
        const products = await seedProducts(farms);
        
        console.log('📨 Seeding Inquiries...');
        const seedInquiries = require('./seedInquiries');
        const inquiries = await seedInquiries(users, products);
        
        console.log('\n🎉 ALL SEEDERS COMPLETE!');
        console.log('========================');
        console.log(` Users: ${users.length}`);
        console.log(` Farms: ${farms.length}`);
        console.log(` Products: ${products.length}`);
        console.log(` Inquiries: ${inquiries.length}`);
        
        console.log('\n🔑 TEST ACCOUNTS (Password: password123):');
        console.log('Farmer: ore@example.com');
        console.log('Buyer: vincent@example.com');
        console.log('Buyer: fiyin@example.com');
        console.log('Farmer: meme@example.com');
        
    } catch (error) {
        console.error('\n Seeding failed:', error.message);
        if (error.message.includes('foreign key')) {
            console.error('\n💡 This means database relationships are working!');
        }
    } finally {
        await sequelize.close();
        console.log('\n Database connection closed');
    }
}

// Run if called directly
if (require.main === module) {
    runAllSeeders();
}

module.exports = runAllSeeders;