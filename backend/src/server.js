require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("../routers");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", routes);

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Road Accident Mapping API",
        version: "1.0.0",
        endpoints: {
            zones: "/api/zones",
            accidents: "/api/accidents",
            stats: "/api/stats",
            health: "/api/health",
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down gracefully...");
    await prisma.$disconnect();
    process.exit(0);
});