const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

const config = {
    port: process.env.PORT,
    db: {
        name: process.env.DATABASE_NAME,
        pass: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER
    },
    jwt: {
        secret: process.env.JWT_SECRET
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER,
        testPhoneNumber: process.env.TEST_PHONE_NUMBER
    }
};






module.exports = { config };