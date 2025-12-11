const express = require('express');
const router = express.Router();
const db = require('../models');
const { authMiddleware } = require('../utils/jwtAuth');
const { sendSMS } = require('../utils/smsService');


// POST /api/inquiries - Submit an inquiry (with sms service)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, message } = req.body;
    const buyerId = req.user.id; 
    
    if (!productId || !message) {
      return res.status(400).json({ 
        success: false,
        message: "Product ID and message are required" 
      });
    }
    
    // Check if product exists
    const product = await db.Product.findByPk(productId, {
      include: [{
        model: db.Farm,
        as: 'farm',
        include: [{
          model: db.User,
          as: 'user'
        }]
      }]
    });
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    
    // Create inquiry
    const inquiry = await db.Inquiry.create({
      message,
      productId,
      buyerId,
      status: 'pending'
    });
    
    // Send SMS notification to farmer if available
    if (product.farm && product.farm.user) {
      const farmer = product.farm.user;
      const smsMessage = `New inquiry for ${product.name}: "${message}". From user ID: ${buyerId}`;
      
      try {
        await sendSMS(farmer.phoneNumber, smsMessage);
        console.log(`SMS sent to farmer: ${farmer.phoneNumber}`);
      } catch (smsError) {
        console.error('SMS failed (inquiry still saved):', smsError.message);
      }
    }
    
    // Get inquiry with product details
    const inquiryWithDetails = await db.Inquiry.findByPk(inquiry.id, {
      include: [{
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'price']
      }]
    });
    
    res.status(201).json({ 
      success: true,
      message: "Inquiry submitted successfully. Farmer will contact you shortly.",
      inquiry: inquiryWithDetails
    });
    
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ 
      success: false,
      message: "Error submitting inquiry" 
    });
  }
});

// GET /api/inquiries - Get user's inquiries
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Get from JWT token
    
    const inquiries = await db.Inquiry.findAll({
      where: { buyerId: userId },
      include: [{
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'price'],
        include: [{
          model: db.Farm,
          as: 'farm',
          attributes: ['name', 'location']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      inquiries: inquiries
    });
    
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching inquiries" 
    });
  }
});

module.exports = router;