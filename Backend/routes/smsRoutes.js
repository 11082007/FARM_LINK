const express = require('express');
const { sendSMS } = require('../utils/smsService');  
const router = express.Router();

// Test route
router.get('/test-route', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Test SMS route
router.post('/test-sms', async (req, res) => {
    try {
        const { phoneNumber, message } = req.body;
        
        const to = phoneNumber || process.env.TEST_PHONE_NUMBER;
        const msg = message || 'Hi, testing twilio from backend server';
        
        if (!to) {
            return res.status(400).json({ 
                error: 'Phone number required. Set TEST_PHONE_NUMBER in .env or provide in request body' 
            });
        }
        
        const result = await sendSMS(to, msg);
        
        if (result.success) {
            res.json({ 
                success: true, 
                message: 'SMS sent successfully!',
                sid: result.sid 
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to send SMS', 
                details: result.error 
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;  