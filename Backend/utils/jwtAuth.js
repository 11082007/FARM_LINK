const jwt = require('jsonwebtoken');
const { config } = require('../env.js');

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.emailAddress,
            userType: user.userType
        },
        config.jwt.secret,
        {expiresIn: '24h'}
    );
};

const verifyToken = (token) => {
    try{
        return jwt.verify(token, config.jwt.secret);
    } catch (error) {
        return null;
    }
};

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
    req.user = decoded;
    next();
};




module.exports = { generateToken, verifyToken, authMiddleware };