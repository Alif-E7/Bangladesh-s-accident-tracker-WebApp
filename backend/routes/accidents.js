const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticate } = require('../middleware/auth'); // From Step 8

// GET /api/accidents - Get all accident data
router.get('/', authenticate, async (req, res) => {
    try {
        // Fetch all records from MySQL
        const accidents = await prisma.accident.findMany();

        res.json({
            success: true,
            data: accidents
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;