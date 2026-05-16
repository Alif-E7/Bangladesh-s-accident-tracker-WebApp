const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("../utils/asyncHandler");

const prisma = new PrismaClient();

// @desc    Export accidents as CSV
// @route   GET /api/export/csv
// @access  Public
exports.exportCSV = asyncHandler(async (req, res) => {
    const accidents = await getFilteredAccidents(req.query);

    // Build CSV
    const headers = [
        "ID", "Serial No", "Date", "Peak Period", "Location", "Latitude", "Longitude",
        "Vehicle Type", "Deaths", "Injuries", "Weather", "Road Condition",
        "Victim Category", "Traffic Control", "Light Condition", "Year", "Month"
    ];

    const rows = accidents.map((a) => [
        a.id,
        a.accidentSerialNo || "",
        a.accidentDatetime ? new Date(a.accidentDatetime).toISOString().split("T")[0] : "",
        a.peakPeriod || "",
        `"${(a.location?.region || "").replace(/"/g, '""')}"`,
        a.location?.latitude || "",
        a.location?.longitude || "",
        `"${(a.vehicleType?.name || "").replace(/"/g, '""')}"`,
        a.deaths || 0,
        a.injuries || 0,
        a.weatherCondition?.name || "",
        a.roadCondition?.name || "",
        a.victimCategory?.name || "",
        a.trafficControl?.name || "",
        a.lightCondition || "",
        a.year || "",
        a.month || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=road_accidents_export.csv");
    res.send(csv);
});

// @desc    Export accidents as JSON
// @route   GET /api/export/json
// @access  Public
exports.exportJSON = asyncHandler(async (req, res) => {
    const accidents = await getFilteredAccidents(req.query);

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=road_accidents_export.json");
    res.json({
        exported_at: new Date().toISOString(),
        total: accidents.length,
        data: accidents,
    });
});

// Shared filter logic
async function getFilteredAccidents(query) {
    const {
        location, startDate, endDate, weather, vehicleType,
        victimCategory, roadCondition, peakPeriod, year, month,
        limit = 10000,
    } = query;

    const where = {};

    if (location) {
        where.location = { region: { contains: location } };
    }
    if (startDate || endDate) {
        where.accidentDatetime = {};
        if (startDate) where.accidentDatetime.gte = new Date(startDate);
        if (endDate) where.accidentDatetime.lte = new Date(endDate);
    }
    if (weather) where.weatherCondition = { name: weather };
    if (vehicleType) where.vehicleType = { name: vehicleType };
    if (victimCategory) where.victimCategory = { name: victimCategory };
    if (roadCondition) where.roadCondition = { name: roadCondition };
    if (peakPeriod) where.peakPeriod = peakPeriod;
    if (year) where.year = parseInt(year);
    if (month) where.month = month;

    return prisma.accident.findMany({
        where,
        include: {
            location: { select: { region: true, latitude: true, longitude: true } },
            weatherCondition: { select: { name: true } },
            roadCondition: { select: { name: true } },
            vehicleType: { select: { name: true } },
            victimCategory: { select: { name: true } },
            trafficControl: { select: { name: true } },
        },
        orderBy: { accidentDatetime: "desc" },
        take: parseInt(limit),
    });
}
