const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;
    try {
        // Get token from Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to the request
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } else {
            return res.status(401).json({ message: 'Not authorized, token missing' });
        }
    } catch (error) {
        console.error('Auth Error:', error.message);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Error logging middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        message: err.message || 'Server Error'
    });
};

module.exports = { protect, errorHandler };
