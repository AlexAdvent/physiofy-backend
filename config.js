require('dotenv').config();

module.exports = {
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN,
    OTP_EXPIRE_MINUTE: process.env.OTP_EXPIRE_MINUTE,
}