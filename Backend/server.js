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

// Debug logging
console.log("=== ENVIRONMENT DEBUG ===");
console.log("NODE_ENV:", process.env.NODE_ENV || 'development');
console.log("PORT:", PORT);
console.log("Database Config Check:");
console.log("DB_HOST:", process.env.DB_HOST || process.env.MYSQLHOST || "Not set");
console.log("DB_NAME:", process.env.DB_NAME || process.env.MYSQLDATABASE || "Not set");
console.log("DB_USER:", process.env.DB_USER || process.env.MYSQLUSER || "Not set");
console.log("DB_PORT:", process.env.DB_PORT || process.env.MYSQLPORT || 3306);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "*** Set ***" : "Not set");
console.log("MYSQLPASSWORD:", process.env.MYSQLPASSWORD ? "*** Set ***" : "Not set");
console.log("==================================");

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-frontend.railway.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
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
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Health check route with DB connection test
app.get("/check", async (req, res) => {
  try {
    await sequelize.authenticate();
    
    res.status(200).json({ 
      message: "FarmLink Backend API is running",
      version: "1.0.0",
      database: "Connected",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({ 
      message: "API is running but database connection failed",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Database test endpoint
app.get("/api/test-db", async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT 1 + 1 AS result');
    res.json({ 
      success: true, 
      message: 'Database connected successfully!',
      result: results[0].result,
      database: sequelize.config.database,
      host: sequelize.config.host
    });
  } catch (error) {
    console.error("Database test error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      config: {
        database: sequelize.config.database,
        host: sequelize.config.host,
        port: sequelize.config.port
      }
    });
  }
});

// Simple database tables check
app.get('/api/db-test', async (req, res) => {
  try {
    const [results] = await sequelize.query('SHOW TABLES');
    res.json({
      success: true,
      tables: results.map(row => Object.values(row)[0]),
      count: results.length
    });
  } catch (error) {
    console.error('DB Test Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Check if Users table has data
app.get('/api/check-users-table', async (req, res) => {
  try {
    const [users] = await sequelize.query('SELECT COUNT(*) as count FROM Users');
    const [columns] = await sequelize.query('DESCRIBE Users');
    
    res.json({
      success: true,
      userCount: users[0].count,
      columns: columns.map(col => ({
        field: col.Field,
        type: col.Type,
        null: col.Null,
        key: col.Key,
        default: col.Default,
        extra: col.Extra
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Try to access User model
app.get('/api/test-models', (req, res) => {
  try {
    const models = require('./models');
    
    res.json({
      success: true,
      availableModels: Object.keys(models),
      hasUserModel: 'User' in models,
      sequelizeModels: Object.keys(sequelize.models),
      sequelizeHasUser: 'User' in sequelize.models
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get users with raw query
app.get('/api/users-raw', async (req, res) => {
  try {
    const [users] = await sequelize.query(`
      SELECT id, firstName, lastName, emailAddress, walletAddress, userType
      FROM Users 
      ORDER BY id
      LIMIT 20
    `);
    
    res.json({
      success: true,
      message: 'Users fetched with raw query',
      total: users.length,
      users: users.map(user => ({
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.emailAddress,
        wallet: user.walletAddress || 'No wallet yet',
        userType: user.userType,
        needsWalletUpdate: !user.walletAddress
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      sqlError: error.parent?.sqlMessage 
    });
  }
});

// UPDATED: Route to find existing users from your seed data
app.get('/api/existing-users', async (req, res) => {
  try {
    console.log('Fetching users...');
    
    // First try with walletAddress
    try {
      const [users] = await sequelize.query(`
        SELECT id, firstName, lastName, emailAddress, userType, walletAddress
        FROM Users 
        ORDER BY id
        LIMIT 20
      `);
      
      return res.json({
        message: 'Existing users from your database',
        total: users.length,
        users: users.map(user => ({
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.emailAddress,
          wallet: user.walletAddress || 'No wallet yet',
          userType: user.userType,
          needsWalletUpdate: !user.walletAddress
        }))
      });
    } catch (error) {
      // If walletAddress column doesn't exist, query without it
      if (error.message.includes('walletAddress')) {
        const [users] = await sequelize.query(`
          SELECT id, firstName, lastName, emailAddress, userType
          FROM Users 
          ORDER BY id
          LIMIT 20
        `);
        
        return res.json({
          message: 'Existing users (walletAddress column not found)',
          note: 'Run: curl -X POST http://localhost:3000/api/fix-users-table',
          total: users.length,
          users: users.map(user => ({
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.emailAddress,
            userType: user.userType,
            wallet: 'Column missing - needs to be added'
          }))
        });
      }
      throw error;
    }
    
  } catch (error) {
    console.error('Error in /api/existing-users:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      details: error.message
    });
  }
});

// Create test users route
app.post('/api/create-test-users', async (req, res) => {
  try {
    const bcrypt = require('bcrypt');
    
    // First check if users exist
    const [existingCount] = await sequelize.query('SELECT COUNT(*) as count FROM Users');
    
    if (existingCount[0].count > 0) {
      const [users] = await sequelize.query(`
        SELECT id, emailAddress, firstName, lastName 
        FROM Users 
        LIMIT 3
      `);
      
      return res.json({
        success: true,
        message: 'Users already exist in database',
        existingUsers: users,
        count: existingCount[0].count
      });
    }
    
    // Create test users
    const testUsers = [
      {
        firstName: 'Alice',
        lastName: 'Smith',
        emailAddress: 'alice@test.com',
        phoneNumber: '+12345678901',
        userType: 'buyer',
        location: 'New York',
        password_hash: await bcrypt.hash('password123', 10),
        walletAddress: '0xAliceWallet123456789'
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        emailAddress: 'bob@test.com',
        phoneNumber: '+19876543210',
        userType: 'farmer',
        location: 'California',
        password_hash: await bcrypt.hash('password123', 10),
        walletAddress: '0xBobWallet987654321'
      }
    ];
    
    for (const userData of testUsers) {
      await sequelize.query(`
        INSERT INTO Users (
          firstName, lastName, emailAddress, phoneNumber, 
          userType, location, password_hash, walletAddress,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, {
        replacements: [
          userData.firstName,
          userData.lastName,
          userData.emailAddress,
          userData.phoneNumber,
          userData.userType,
          userData.location,
          userData.password_hash,
          userData.walletAddress
        ]
      });
    }
    
    res.json({
      success: true,
      message: 'Test users created successfully',
      users: testUsers.map(u => ({
        email: u.emailAddress,
        password: 'password123',
        wallet: u.walletAddress
      }))
    });
    
  } catch (error) {
    console.error('Error creating test users:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
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

// Add this route to see all users with their actual data
app.get('/api/debug-all-users', async (req, res) => {
  try {
    const [users] = await sequelize.query(`
      SELECT id, firstName, lastName, emailAddress, userType, 
             createdAt, phoneNumber, location, password_hash
      FROM Users 
      ORDER BY id
    `);
    
    res.json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddress,
        userType: user.userType,
        phone: user.phoneNumber,
        location: user.location,
        password_hash_exists: !!user.password_hash,
        password_hash_length: user.password_hash?.length || 0,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Route to add missing walletAddress column
app.post('/api/fix-users-table', async (req, res) => {
  try {
    // Check if walletAddress column exists
    const [columns] = await sequelize.query(`
      SHOW COLUMNS FROM Users LIKE 'walletAddress'
    `);
    
    if (columns.length === 0) {
      // Add the missing column
      await sequelize.query(`
        ALTER TABLE Users 
        ADD COLUMN walletAddress VARCHAR(255) DEFAULT NULL
      `);
      
      res.json({
        success: true,
        message: 'walletAddress column added to Users table'
      });
    } else {
      res.json({
        success: true,
        message: 'walletAddress column already exists'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ADDED: Route to reset a user's password for testing
app.post('/api/reset-test-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const bcrypt = require('bcrypt');
    
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Email and newPassword are required'
      });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    const [result] = await sequelize.query(`
      UPDATE Users 
      SET password_hash = ?, updatedAt = NOW()
      WHERE emailAddress = ?
    `, {
      replacements: [hashedPassword, email]
    });
    
    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Password updated successfully',
      email: email,
      newPassword: newPassword
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
// Add this route
app.get('/api/deploy-info', (req, res) => {
  res.json({
    railway: {
      environment: process.env.RAILWAY_ENVIRONMENT,
      serviceName: process.env.RAILWAY_SERVICE_NAME,
      serviceId: process.env.RAILWAY_SERVICE_ID,
      projectId: process.env.RAILWAY_PROJECT_ID,
      projectName: process.env.RAILWAY_PROJECT_NAME,
      publicDomain: process.env.RAILWAY_PUBLIC_DOMAIN,
      staticUrl: process.env.RAILWAY_STATIC_URL
    },
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    host: req.get('host'),
    protocol: req.protocol,
    originalUrl: req.originalUrl,
    baseUrl: `${req.protocol}://${req.get('host')}`
  });
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
    console.log("Attempting to connect to MySQL database...");
    
    // Authenticate database connection
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    console.log(`Database: ${sequelize.config.database}`);
    console.log(`Host: ${sequelize.config.host}:${sequelize.config.port}`);
    
    // TEMPORARY FIX: Skip sync to avoid index limit errors
    console.log("Skipping table sync to avoid index limit errors");
    console.log("Assuming tables already exist from previous runs");
    
    // Check if Users table exists without trying to alter it
    try {
      const [tables] = await sequelize.query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = '${sequelize.config.database}' 
        AND TABLE_NAME = 'Users'
      `);
      
      if (tables.length === 0) {
        console.log("Users table doesn't exist, creating without altering...");
        // Create tables if they don't exist, but don't alter existing ones
        await sequelize.sync({ force: false });
      } else {
        console.log("Users table exists, skipping sync to avoid index errors");
      }
    } catch (syncError) {
      console.log("Sync check skipped due to error:", syncError.message);
    }
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Base URL: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/check`);
      console.log(`Database test: http://localhost:${PORT}/api/test-db`);
      console.log(`Escrow endpoints: http://localhost:${PORT}/api/escrow`);
      console.log(`Check existing users: GET http://localhost:${PORT}/api/existing-users`);
      console.log(`Update wallet: POST http://localhost:${PORT}/api/users/:id/wallet`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log("");
      console.log("IMPORTANT: If login fails, check if Users table has data");
      console.log("Run: curl -X POST http://localhost:3000/api/create-test-users");
      console.log("Reset password: curl -X POST http://localhost:3000/api/reset-test-password");
    });
    
  } catch (error) {
    console.error("Unable to start server:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

// Start the server
startServer();