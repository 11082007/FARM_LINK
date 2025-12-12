const express = require('express');
const router = express.Router();
const db = require('../models');
const { generateToken, authMiddleware } = require('../utils/jwtAuth');
const { createUserValidationSchema, loginValidationSchema } = require('../utils/validationSchemas');
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');

// POST /api/auth/register
router.post('/register', createUserValidationSchema, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { firstName, lastName, emailAddress, phoneNumber, userType, location, password } = req.body;

    const existingUser = await db.User.findOne({ where: { emailAddress } });
    if (existingUser) return res.status(400).json({ success: false, message: 'User with this email already exists' });

    const existingPhone = await db.User.findOne({ where: { phoneNumber } });
    if (existingPhone) return res.status(400).json({ success: false, message: 'User with this phone number already exists' });

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await db.User.create({
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      userType: userType || 'buyer',
      location,
      password_hash: hashedPassword, // Store the hashed password
    });

    const token = generateToken(user);

    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      phoneNumber: user.phoneNumber,
      userType: user.userType,
      location: user.location,
      createdAt: user.createdAt,
    };

    if (user.userType === 'farmer') {
      try {
        const farm = await db.Farm.create({ name: `${firstName}'s Farm`, location, userId: user.id });
        userResponse.farm = farm;
      } catch (farmError) {
        console.log('Could not create default farm:', farmError.message);
      }
    }

    res.status(201).json({ success: true, message: 'User registered successfully', user: userResponse, token });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({ field: err.path, message: err.message })),
      });
    }
    res.status(500).json({ success: false, message: 'Error creating user', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

// Custom login validation that accepts both 'email' and 'emailAddress'
const customLoginValidation = [
  // Accept both 'email' and 'emailAddress' fields
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('emailAddress').optional().isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Check if we have at least one email field
      if (!req.body.email && !req.body.emailAddress) {
        errors.errors.push({
          type: 'field',
          msg: 'Email is required',
          path: 'emailAddress',
          location: 'body'
        });
      }
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// POST /api/auth/login
router.post('/login', customLoginValidation, async (req, res) => {
  try {
    // Get email from either field (frontend might send 'email' or 'emailAddress')
    const email = req.body.emailAddress || req.body.email;
    const { password } = req.body;

    console.log('Login attempt for email:', email);

    const user = await db.User.findOne({ where: { emailAddress: email } });
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    console.log('User found:', {
      id: user.id,
      email: user.emailAddress,
      hasPasswordHash: !!user.password_hash,
      passwordHashLength: user.password_hash?.length || 0
    });

    // Check if user has a validPassword method (from model), otherwise use bcrypt directly
    let isValidPassword = false;
    
    if (typeof user.validPassword === 'function') {
      // Use model's password validation method
      isValidPassword = user.validPassword(password);
      console.log('Using model.validPassword method, result:', isValidPassword);
    } else {
      // Fallback to bcrypt comparison
      if (!user.password_hash) {
        console.log('No password_hash found for user');
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }
      
      try {
        isValidPassword = await bcrypt.compare(password, user.password_hash);
        console.log('Using bcrypt.compare, result:', isValidPassword);
      } catch (bcryptError) {
        console.error('Bcrypt comparison error:', bcryptError);
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }
    }

    if (!isValidPassword) {
      console.log('Password comparison failed for user:', user.emailAddress);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken(user);

    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      phoneNumber: user.phoneNumber,
      userType: user.userType,
      location: user.location,
      createdAt: user.createdAt,
      walletAddress: user.walletAddress || null
    };

    if (user.userType === 'farmer') {
      const farm = await db.Farm.findOne({ 
        where: { userId: user.id }, 
        attributes: ['id', 'name', 'location'] 
      });
      userResponse.farm = farm;
    }

    console.log('Login successful for user:', user.emailAddress);
    
    res.json({ 
      success: true, 
      message: 'Login successful', 
      token, 
      user: userResponse 
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during login', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// POST /api/auth/login-compat - Alternative endpoint that accepts 'email' field
router.post('/login-compat', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;

    console.log('Compat login for email:', email);

    const user = await db.User.findOne({ where: { emailAddress: email } });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Try both validation methods
    let isValidPassword = false;
    
    if (typeof user.validPassword === 'function') {
      isValidPassword = user.validPassword(password);
    } else if (user.password_hash) {
      isValidPassword = await bcrypt.compare(password, user.password_hash);
    }

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken(user);

    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      phoneNumber: user.phoneNumber,
      userType: user.userType,
      location: user.location,
      createdAt: user.createdAt,
      walletAddress: user.walletAddress || null
    };

    res.json({ 
      success: true, 
      message: 'Login successful', 
      token, 
      user: userResponse 
    });
    
  } catch (error) {
    console.error('Compat login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during login' 
    });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: db.Farm, as: 'farm', include: [{ model: db.Product, as: 'products', attributes: ['id', 'name', 'price', 'quantity', 'status'] }] },
        { model: db.Inquiry, as: 'inquiries', limit: 10, order: [['createdAt', 'DESC']], include: [{ model: db.Product, as: 'product', attributes: ['id', 'name', 'price'] }] },
      ],
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Error fetching user profile' });
  }
});

module.exports = router;