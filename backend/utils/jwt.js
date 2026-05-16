// backend/utils/jwt.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Your secret key (store in .env file!)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId }, // Payload
        JWT_SECRET, // Secret key
        { expiresIn: JWT_EXPIRE } // Options
    );
};

// Verify JWT token
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

// Hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    generateToken,
    verifyToken,
    hashPassword,
    comparePassword
};