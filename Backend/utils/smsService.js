const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

/**
 * Send SMS using Twilio
 * @param {string} to - Recipient phone number in E.164 format (+1234567890)
 * @param {string} message - SMS message content
 * @returns {Promise} - Twilio message object
 */
const sendSMS = async (to, message) => {
    try {
        const sms = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: to
        });
        
        console.log(`SMS sent successfully. SID: ${sms.sid}`);
        return { success: true, sid: sms.sid, data: sms };
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        return { 
            success: false, 
            error: error.message,
            code: error.code 
        };
    }
};



module.exports = { sendSMS };