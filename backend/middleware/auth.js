// backend/middleware/auth.js
const { verifyToken } = require('../utils/jwt');

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
    try {
        // Get token from header or cookie
        let token = req.headers.authorization;

        if (token && token.startsWith('Bearer ')) {
            // Extract token from "Bearer <token>"
            token = token.slice(7, token.length);
        } else if (req.cookies.token) {
            // Get token from cookie
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify token
        const decoded = await verifyToken(token);

        // Add user ID to request
        req.userId = decoded.userId;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.'
        });
    }
};

module.exports = { authenticate, checkAdmin };