const express = require("express");
const cors = require('cors');
const { sequelize, Op } = require('./models');
require('dotenv').config();

const smsRoutes = require('./routes/smsRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const inquiryRoutes = require('./routes/inquiryRoutes.js');
const escrowRoutes = require('./routes/escrowRoutes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/escrow', escrowRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/sms', smsRoutes);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ 
    msg: "FarmLink Backend API is running",
    endpoints: {
      escrow: {
        create: 'POST /api/escrow/create',
        release: 'POST /api/escrow/:id/release',
        verify: 'GET /api/escrow/verify/:hash',
        chain: 'GET /api/escrow/chain',
        user: 'GET /api/escrow/user',
        existingUsers: 'GET /api/existing-users',
        updateWallet: 'POST /api/users/:id/wallet'
      },
      products: '/api/products',
      auth: '/api/auth',
      inquiries: '/api/inquiries',
      sms: '/sms'
    }
  });
});

// Health check route
app.get("/check", (req, res) => {
  res.status(200).json({ 
    message: "FarmLink Backend API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Route to find existing users from your seed data
app.get('/api/existing-users', async (req, res) => {
  try {
    const { User } = require('./models');
    
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'emailAddress', 'walletAddress', 'userType'],
      order: [['id', 'ASC']],
      limit: 20
    });
    
    res.json({
      message: 'Existing users from your database',
      total: users.length,
      users: users.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddress,
        wallet: user.walletAddress || 'No wallet yet',
        userType: user.userType,
        needsWalletUpdate: !user.walletAddress
      }))
    });
    
  } catch (error) {
    console.error('Error fetching existing users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Route to add wallet addresses to existing users
app.post('/api/users/:id/wallet', async (req, res) => {
  try {
    const { User } = require('./models');
    const { id } = req.params;
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.walletAddress = walletAddress;
    await user.save();
    
    res.json({
      message: 'Wallet address updated successfully',
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        walletAddress: user.walletAddress,
        email: user.emailAddress
      }
    });
    
  } catch (error) {
    console.error('Error updating wallet:', error);
    res.status(500).json({ error: 'Failed to update wallet address' });
  }
});

// Test users route for escrow testing (updated to check existing users first)
app.post('/api/test/users', async (req, res) => {
  try {
    const { User } = require('./models');
    
    // First, check if we have existing users in the database
    const existingUsers = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'emailAddress', 'walletAddress', 'userType'],
      order: [['id', 'ASC']],
      limit: 2
    });
    
    // If we have existing users, return them
    if (existingUsers.length >= 2) {
      return res.json({
        message: 'Using existing users from your database',
        users: existingUsers.map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.emailAddress,
          wallet: user.walletAddress || 'No wallet yet',
          userType: user.userType
        })),
        note: 'Use these IDs for escrow testing. Update wallet addresses if needed.'
      });
    }
    
    // Only create test users if database has less than 2 users
    const [user1, created1] = await User.findOrCreate({
      where: { emailAddress: 'alice@test.com' },
      defaults: {
        firstName: 'Alice',
        lastName: 'Smith',
        phoneNumber: '+12345678901',
        userType: 'buyer',
        location: 'New York',
        password_hash: 'password123',
        walletAddress: '0xAliceWallet123456789'
      }
    });
    
    const [user2, created2] = await User.findOrCreate({
      where: { emailAddress: 'bob@test.com' },
      defaults: {
        firstName: 'Bob',
        lastName: 'Johnson',
        phoneNumber: '+19876543210',
        userType: 'farmer',
        location: 'California',
        password_hash: 'password123',
        walletAddress: '0xBobWallet987654321'
      }
    });
    
    res.json({
      message: 'Test users created/found',
      users: [
        { 
          id: user1.id, 
          name: `${user1.firstName} ${user1.lastName}`, 
          wallet: user1.walletAddress,
          email: user1.emailAddress 
        },
        { 
          id: user2.id, 
          name: `${user2.firstName} ${user2.lastName}`, 
          wallet: user2.walletAddress,
          email: user2.emailAddress 
        }
      ],
      created: [created1, created2]
    });
    
  } catch (error) {
    console.error('Error creating test users:', error);
    res.status(500).json({ 
      error: 'Failed to create test users',
      details: error.message 
    });
  }
});

// For undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found",
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database sync and server start
async function startServer() {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    
    // Sync database models (use alter: true for development)
    await sequelize.sync({ alter: true });
    console.log("Database models synced successfully.");
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Base URL: http://localhost:${PORT}`);
      console.log(`Escrow endpoints available at: http://localhost:${PORT}/api/escrow`);
      console.log(`Check existing users: GET http://localhost:${PORT}/api/existing-users`);
      console.log(`Update wallet: POST http://localhost:${PORT}/api/users/:id/wallet`);
    });
    
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
}

// Start the server
startServer();