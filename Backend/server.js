const express = require("express");
const cors = require('cors');
const { sequelize, Op } = require('./models');
require('dotenv').config();

// CRITICAL FIX: Force production mode on Railway
if (process.env.RAILWAY_ENVIRONMENT || process.env.MYSQLHOST) {
  process.env.NODE_ENV = 'production';
  console.log('Railway detected, forcing NODE_ENV=production');
  console.log('MYSQLHOST:', process.env.MYSQLHOST || 'Not set');
  console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE || 'Not set');
  console.log('MYSQLUSER:', process.env.MYSQLUSER || 'Not set');
  console.log('MYSQLPORT:', process.env.MYSQLPORT || 'Not set');
}

const smsRoutes = require('./routes/smsRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const inquiryRoutes = require('./routes/inquiryRoutes.js');
const escrowRoutes = require('./routes/escrowRoutes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Check if running on Railway
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_SERVICE_NAME;

console.log("=== DEPLOYMENT ENVIRONMENT ===");
if (isRailway) {
  console.log('Running on Railway');
  console.log('Environment:', process.env.RAILWAY_ENVIRONMENT);
  console.log('Service Name:', process.env.RAILWAY_SERVICE_NAME);
} else {
  console.log('Running locally');
}
console.log("NODE_ENV:", process.env.NODE_ENV || 'development');
console.log("==============================");

// Enhanced debug logging for database connection
console.log("=== DATABASE CONFIGURATION ===");
console.log("Sequelize Config Host:", sequelize.config.host);
console.log("Sequelize Config Port:", sequelize.config.port);
console.log("Sequelize Config Database:", sequelize.config.database);
console.log("Sequelize Config Username:", sequelize.config.username);
console.log("Sequelize Config Dialect:", sequelize.config.dialect);

// Show available environment variables
console.log("\nEnvironment Variables:");
console.log("DB_HOST:", process.env.DB_HOST || "Not set");
console.log("DB_NAME:", process.env.DB_NAME || "Not set");
console.log("DB_USER:", process.env.DB_USER || "Not set");
console.log("DB_PORT:", process.env.DB_PORT || "Not set");
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "*** Set ***" : "Not set");
console.log("MYSQLHOST:", process.env.MYSQLHOST || "Not set");
console.log("MYSQLDATABASE:", process.env.MYSQLDATABASE || "Not set");
console.log("MYSQLUSER:", process.env.MYSQLUSER || "Not set");
console.log("MYSQLPORT:", process.env.MYSQLPORT || "Not set");
console.log("MYSQLPASSWORD:", process.env.MYSQLPASSWORD ? "*** Set ***" : "Not set");
console.log("==================================");

// CORS Configuration - MORE PERMISSIVE FOR DEBUGGING
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'https://farmlink-production.up.railway.app'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple test route - ADD THIS FIRST
app.get("/test", (req, res) => {
  res.json({ 
    message: "Test route is working!",
    timestamp: new Date().toISOString(),
    success: true
  });
});

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
      test: '/test',
      check: '/check',
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

// Enhanced health check route with detailed DB info
app.get("/check", async (req, res) => {
  try {
    await sequelize.authenticate();
    
    // Get more detailed DB info
    const [tables] = await sequelize.query('SHOW TABLES');
    const [users] = await sequelize.query('SELECT COUNT(*) as count FROM Users');
    
    res.status(200).json({ 
      message: "FarmLink Backend API is running",
      version: "1.0.0",
      server: {
        status: "OK",
        port: PORT,
        host: req.hostname,
        ip: req.ip
      },
      database: {
        status: "Connected",
        host: sequelize.config.host,
        port: sequelize.config.port,
        database: sequelize.config.database,
        userCount: users[0].count,
        tableCount: tables.length
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      railway: isRailway ? true : false
    });
  } catch (error) {
    console.error("Health check database error:", error.message);
    res.status(500).json({ 
      message: "API is running but database connection failed",
      error: error.message,
      databaseConfig: {
        host: sequelize.config.host,
        port: sequelize.config.port,
        database: sequelize.config.database
      },
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
      config: {
        database: sequelize.config.database,
        host: sequelize.config.host,
        port: sequelize.config.port,
        username: sequelize.config.username,
        dialect: sequelize.config.dialect
      }
    });
  } catch (error) {
    console.error("Database test error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      config: {
        database: sequelize.config.database,
        host: sequelize.config.host,
        port: sequelize.config.port,
        username: sequelize.config.username
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

// ADDED: Debug route to check database dialect configuration
app.get('/api/test-dialect', (req, res) => {
  try {
    // Get current environment
    const env = process.env.NODE_ENV || 'development';
    
    // Load config directly
    const dbConfig = require('./config/database.js');
    const currentConfig = dbConfig[env];
    
    // Check Sequelize connection
    const sequelizeConfig = {
      host: sequelize.config.host,
      port: sequelize.config.port,
      database: sequelize.config.database,
      username: sequelize.config.username,
      dialect: sequelize.config.dialect,
      dialectOptions: sequelize.config.dialectOptions
    };
    
    res.json({
      success: true,
      environment: env,
      databaseConfig: {
        loadedFrom: 'database.js',
        config: currentConfig,
        hasDialect: !!currentConfig.dialect,
        dialect: currentConfig.dialect
      },
      sequelizeActualConfig: sequelizeConfig,
      modelsLoaded: Object.keys(sequelize.models),
      connection: {
        host: sequelize.config.host,
        connected: sequelize.authenticate ? 'Yes' : 'No'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
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

// Route to reset a user's password for testing
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

// ADDED: Server status endpoint
app.get('/api/server-status', (req, res) => {
  const os = require('os');
  res.json({
    status: 'running',
    uptime: process.uptime(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      usage: (os.totalmem() - os.freemem()) / os.totalmem() * 100
    },
    cpu: os.cpus().length,
    platform: os.platform(),
    nodeVersion: process.version
  });
});

// For undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    availableRoutes: ['/', '/test', '/check', '/api/test-db']
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

// Helper function to get local IP
function getLocalIpAddress() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Updated startServer function with better error handling
async function startServer() {
  try {
    console.log("=== STARTING SERVER ===");
    console.log("Attempting to connect to MySQL database...");
    
    // Debug: Show actual connection config
    console.log("Database Config from Sequelize:");
    console.log("- Host:", sequelize.config.host);
    console.log("- Port:", sequelize.config.port);
    console.log("- Database:", sequelize.config.database);
    console.log("- Username:", sequelize.config.username);
    console.log("- Dialect:", sequelize.config.dialect);
    
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
    
    // Get local IP address
    const localIp = getLocalIpAddress();
    
    // Start server - FIXED: Remove '0.0.0.0' binding issue
    const server = app.listen(PORT, () => {
      console.log(`\n=== SERVER STARTED SUCCESSFULLY ===`);
      console.log(`Server running on port ${PORT}`);
      console.log(`\nAvailable URLs:`);
      console.log(`- Local URL: http://localhost:${PORT}`);
      console.log(`- Network URL: http://127.0.0.1:${PORT}`);
      console.log(`- Your IP: http://${localIp}:${PORT}`);
      console.log(`\nTest Endpoints:`);
      console.log(`- Basic test: http://localhost:${PORT}/test`);
      console.log(`- Health check: http://localhost:${PORT}/check`);
      console.log(`- Database test: http://localhost:${PORT}/api/test-db`);
      console.log(`- Server status: http://localhost:${PORT}/api/server-status`);
      console.log(`\nAPI Endpoints:`);
      console.log(`- Escrow: http://localhost:${PORT}/api/escrow`);
      console.log(`- Check existing users: GET http://localhost:${PORT}/api/existing-users`);
      console.log(`- Update wallet: POST http://localhost:${PORT}/api/users/:id/wallet`);
      console.log(`\nEnvironment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`======================================\n`);
      
      if (isRailway) {
        console.log("RUNNING ON RAILWAY");
        console.log(`Public URL: https://farmlink-production.up.railway.app`);
        console.log("IMPORTANT: Database is empty, users need to be created");
        console.log("Run setup: curl -X POST https://farmlink-production.up.railway.app/api/railway-setup");
      } else {
        console.log("RUNNING LOCALLY");
        console.log("IMPORTANT: If login fails, check if Users table has data");
        console.log("Run: curl -X POST http://localhost:3000/api/create-test-users");
        console.log("Reset password: curl -X POST http://localhost:3000/api/reset-test-password");
        console.log("\nTo test connection:");
        console.log(`curl http://localhost:${PORT}/test`);
        console.log(`curl http://localhost:${PORT}/check`);
      }
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use!`);
        console.log(`Try changing PORT in .env file to 5001 or another port.`);
        console.log(`Or kill the process using: lsof -ti:${PORT} | xargs kill -9`);
      } else {
        console.error('Server error:', error.message);
      }
      process.exit(1);
    });
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error("UNABLE TO START SERVER!");
    console.error("Error:", error.message);
    console.error("\nDEBUG INFORMATION:");
    console.error("Sequelize Config:", {
      host: sequelize.config.host,
      port: sequelize.config.port,
      database: sequelize.config.database,
      username: sequelize.config.username,
      dialect: sequelize.config.dialect
    });
    
    console.error("\nTROUBLESHOOTING:");
    if (isRailway) {
      console.error("1. Check if MySQL service is linked to backend on Railway");
      console.error("2. Check Railway Variables for MYSQL* environment variables");
      console.error("3. Ensure NODE_ENV=production is set on Railway");
      console.error("4. Check your config/config.json - it should use process.env for production");
    } else {
      console.error("1. Check if MySQL is running locally (mysql -u root -p)");
      console.error("2. Verify database credentials in .env file");
      console.error("3. Check if Farm_link database exists");
      console.error("4. Check if port 3000 is already in use: lsof -i :3000");
    }
    
    console.error("\nCurrent Environment:");
    console.error("NODE_ENV:", process.env.NODE_ENV);
    console.error("RAILWAY_ENVIRONMENT:", process.env.RAILWAY_ENVIRONMENT || "Not set");
    console.error("MYSQLHOST:", process.env.MYSQLHOST || "Not set");
    console.error("MYSQLDATABASE:", process.env.MYSQLDATABASE || "Not set");
    
    process.exit(1);
  }
}

// Start the server
startServer();