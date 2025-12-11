const db = require('../models');

async function seedInquiries(users, products) {
  console.log('Seeding inquiries...');
  
  try {
    // Fetch data if not provided
    if (!users) users = await db.User.findAll();
    if (!products) products = await db.Product.findAll();
    
    const inquiries = [
      {
        message: 'Is the tomatoes available for pickup tomorrow?',
        productId: products[0].id,
        buyerId: users[1].id, // Vincent's inquiry
        status: 'pending'
      },
      {
        message: 'Can I get a discount if I buy 5 trays of eggs?',
        productId: products[3].id, // Eggs
        buyerId: users[2].id, // Fiyin's inquiry
        status: 'pending'
      },
      {
        message: 'Do you deliver to Victoria Island?',
        productId: products[5].id, // Yam
        buyerId: users[1].id, // Vincent
        status: 'resolved'
      }
    ];
    
    const createdInquiries = await db.Inquiry.bulkCreate(inquiries);
    
    console.log(`Created ${createdInquiries.length} inquiries`);
    return createdInquiries;
    
  } catch (error) {
    console.error('Error seeding inquiries:', error.message);
    throw error;
  }
}

module.exports = seedInquiries;