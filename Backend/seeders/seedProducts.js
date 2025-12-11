const db = require('../models');

async function seedProducts(farms) {
  console.log(' Seeding products...');
  
  try {
    // If farms not provided, fetch them
    if (!farms) {
      farms = await db.Farm.findAll();
    }
    
    
    const products = [
      // Green Valley Farm products
      {
        name: 'Fresh Tomatoes',
        price: 1500.00,
        quantity: 50,
        description: 'Organic tomatoes freshly harvested daily',
        farmId: farms[0].id,
        status: 'available'
      },
      {
        name: 'Bell Peppers (Mixed)',
        price: 2200.00,
        quantity: 30,
        description: 'Red, yellow, and green bell peppers',
        farmId: farms[0].id,
        status: 'available'
      },
      {
        name: 'Organic Spinach',
        price: 800.00,
        quantity: 100,
        description: 'Fresh organic spinach leaves',
        farmId: farms[0].id,
        status: 'available'
      },
      
      // Sunrise Poultry Farm products
      {
        name: 'Free-Range Eggs (Tray)',
        price: 2800.00,
        quantity: 20,
        description: 'Eggs from free-range chickens',
        farmId: farms[1].id,
        status: 'available'
      },
      {
        name: 'Whole Chicken',
        price: 4500.00,
        quantity: 15,
        description: 'Freshly processed whole chicken',
        farmId: farms[1].id,
        status: 'available'
      },
      
      // Golden Harvest Fields products
      {
        name: 'Premium Ofada Rice (10kg)',
        price: 18500.00,
        quantity: 40,
        description: 'Authentic Ofada rice',
        farmId: farms[2].id,
        status: 'available'
      },
      {
        name: 'Yam Tubers',
        price: 3200.00,
        quantity: 60,
        description: 'Fresh yam tubers',
        farmId: farms[2].id,
        status: 'available'
      },
      
      // Fresh Produce Co-op products
      {
        name: 'Plantain (Bunch)',
        price: 3500.00,
        quantity: 25,
        description: 'Ripe and unripe plantain',
        farmId: farms[3].id,
        status: 'available'
      },
      {
        name: 'Sweet Corn',
        price: 1200.00,
        quantity: 45,
        description: 'Fresh sweet corn',
        farmId: farms[3].id,
        status: 'sold out'
      }
    ];
    
    const createdProducts = await db.Product.bulkCreate(products);
    
    console.log(`Created ${createdProducts.length} products`);
    return createdProducts;
    
  } catch (error) {
    console.error('Error seeding products:', error.message);
    throw error;
  }
}

module.exports = seedProducts;