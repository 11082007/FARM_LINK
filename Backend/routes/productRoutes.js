const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');
const { authMiddleware } = require('../utils/jwtAuth');

// GET /api/products - Browse all product listings
/*router.get('/', async (req, res) => {
    try {
        console.log('GET /api/products - Fetching all products...');

        const products = await db.product.findAll({
            include: [{
                model: db.Farm,
                as: 'farm',
                attributes: ['name', 'location']
            }],
            order: [['createdAt', 'DESC']]
        });

            console.log(`Found ${products.length} products`);

        res.json({
            success: true,
            products: products
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        console.error('Full error:', error);

        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
})
*/
// Add this at the top of productRoutes.js (after the imports)
router.get('/debug-models', (req, res) => {
  try {
    console.log('Database models:', Object.keys(db));
    
    // Check specifically for product models
    const models = {
      'Product': 'Product' in db,
      'product': 'product' in db,
      'Products': 'Products' in db,
      'products': 'products' in db,
      'Farm': 'Farm' in db,
      'farm': 'farm' in db,
      'User': 'User' in db
    };
    
    res.json({
      success: true,
      models: models,
      allModelNames: Object.keys(db),
      sequelizeModels: Object.keys(db.sequelize.models)
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});
// GET /api/products - Browse all product listings
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/products - Fetching with farm data...');
    
    const products = await db.Product.findAll({
      include: [{
        model: db.Farm,
        as: 'farm',
        attributes: ['id', 'name', 'location'],
        required: false // Use LEFT JOIN in case some products don't have farms
      }],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`Found ${products.length} products with farm data`);
    
    res.json({
      success: true,
      count: products.length,
      products: products
    });
    
  } catch (error) {
    console.error('Error fetching products:', error.message);
    
    // Try without include if there's an association error
    if (error.message.includes('association') || error.message.includes('include')) {
      console.log('Trying without farm inclusion...');
      
      const simpleProducts = await db.Product.findAll({
        order: [['createdAt', 'DESC']]
      });
      
      return res.json({
        success: true,
        count: simpleProducts.length,
        products: simpleProducts
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Error fetching products",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// POST /api/products 
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, price, quantity, description, farmId, status } = req.body;

        const product = await db.Product.create({
            name,
            price,
            quantity: quantity || 0,
            description: description || '',
            farmId,
            status: status || 'available'
        });
        res.status(201).json({
            success: true,
            message: 'product created successfully',
            product: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product'
        })
        
    }
})

// GET /api/products/search - Search products (For Fiyin's feature)
router.get('/search', async (req, res) => {
  try {
    const { q = '', location = '' } = req.query;
    
    const whereConditions = {};
    
    if (q) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },   
        { description: { [Op.like]: `%${q}%` } }
      ];
    }
    
    // Include farm with location filter
    const includeOptions = [{
      model: db.Farm,
      as: 'farm',
      attributes: ['name', 'location'],
      where: location ? { location: { [Op.like]: `%${location}%` } } : undefined
    }];
    
    const results = await db.Product.findAll({
      where: whereConditions,
      include: includeOptions
    });
    
    res.json({
      success: true,
      query: q,
      location: location,
      results: results
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error searching products" 
    });
  }
});

// GET /api/products/:id .....Get single product

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await db.Product.findByPk(id, {
      include: [{
        model: db.Farm,
        as: 'farm',
        attributes: ['id', 'name', 'location']
      }]
    });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    
    res.json({
      success: true,
      product: product
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching product" 
    });
  }
});

module.exports = router;