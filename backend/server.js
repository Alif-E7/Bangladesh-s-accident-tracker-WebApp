// backend/server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Your React frontend URL
    credentials: true
}));
const accidentRoutes = require('./routes/accidents');
// ... existing code ...
app.use('/api/accidents', accidentRoutes);
// Routes
app.use('/api/auth', authRoutes);

// Protected route example
app.get('/api/protected', authenticate, (req, res) => {
    res.json({
        success: true,
        message: 'This is a protected route',
        userId: req.userId
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});