const express = require('express');
const router = express.Router();
const db = require('../models');
const { generateToken, authMiddleware } = require('../utils/jwtAuth');
const { createUserValidationSchema, loginValidationSchema } = require('../utils/validationSchemas');
const { validationResult } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController'); // optional if still using controller functions

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

    const user = await db.User.create({
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      userType: userType || 'buyer',
      location,
      password_hash: password,
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

// POST /api/auth/login
router.post('/login', loginValidationSchema, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { emailAddress, password } = req.body;

    const user = await db.User.findOne({ where: { emailAddress } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const isValidPassword = user.validPassword(password);
    if (!isValidPassword) return res.status(401).json({ success: false, message: 'Invalid email or password' });

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
      const farm = await db.Farm.findOne({ where: { userId: user.id }, attributes: ['id', 'name', 'location'] });
      userResponse.farm = farm;
    }

    res.json({ success: true, message: 'Login successful', token, user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error during login', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
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
