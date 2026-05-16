const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("../utils/asyncHandler");

const prisma = new PrismaClient();

// @desc    Get all alert zones for map rendering
// @route   GET /api/zones
// @access  Public
exports.getZones = asyncHandler(async (req, res) => {
    const { level, minRisk, maxRisk } = req.query;

    const where = {};

    if (level) where.alertLevel = level.toUpperCase();
    if (minRisk || maxRisk) {
        where.riskScore = {};
        if (minRisk) where.riskScore.gte = parseFloat(minRisk);
        if (maxRisk) where.riskScore.lte = parseFloat(maxRisk);
    }

    const zones = await prisma.alertZone.findMany({
        where,
        select: {
            id: true,
            latitude: true,
            longitude: true,
            riskScore: true,
            alertLevel: true,
            accidentCount: true,
            totalDeaths: true,
            totalInjuries: true,
            radiusKm: true,
            regionName: true,
            createdAt: true,
        },
        orderBy: { riskScore: "desc" },
    });

    res.status(200).json({
        success: true,
        count: zones.length,
        data: zones,
    });
});

// @desc    Get single zone by ID with nearby accidents
// @route   GET /api/zones/:id
// @access  Public
exports.getZoneById = asyncHandler(async (req, res) => {
    const zone = await prisma.alertZone.findUnique({
        where: { id: parseInt(req.params.id) },
    });

    if (!zone) {
        return res.status(404).json({
            success: false,
            message: "Zone not found",
        });
    }

    // Find accidents near this zone
    const allAccidents = await prisma.accident.findMany({
        include: {
            location: { select: { region: true, latitude: true, longitude: true } },
            weatherCondition: { select: { name: true } },
            vehicleType: { select: { name: true } },
            victimCategory: { select: { name: true } },
        },
        orderBy: { accidentDatetime: "desc" },
    });

    // Filter accidents within zone radius
    const nearbyAccidents = allAccidents.filter((a) => {
        const dist = getDistanceFromLatLonInKm(
            zone.latitude, zone.longitude,
            a.location.latitude, a.location.longitude
        );
        return dist <= (zone.radiusKm || 0.5);
    });

    res.status(200).json({
        success: true,
        data: {
            zone,
            accidents: nearbyAccidents.slice(0, 100), // Limit to 100
            totalAccidents: nearbyAccidents.length,
        },
    });
});

// @desc    Trigger zone recalculation
// @route   POST /api/zones/calculate
// @access  Public (add auth middleware in production)
exports.calculateZones = asyncHandler(async (req, res) => {
    const { spawn } = require("child_process");
    const path = require("path");

    const scriptPath = path.join(__dirname, "../scripts/calculateZones.js");

    const child = spawn("node", [scriptPath], {
        stdio: ["ignore", "pipe", "pipe"],
    });

    let output = "";
    child.stdout.on("data", (data) => {
        output += data.toString();
    });

    child.on("close", (code) => {
        if (code === 0) {
            res.status(200).json({
                success: true,
                message: "Zone calculation completed",
                log: output,
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Zone calculation failed",
                error: output,
            });
        }
    });

    child.on("error", (err) => {
        res.status(500).json({
            success: false,
            message: "Failed to spawn calculation process",
            error: err.message,
        });
    });
});

// Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}