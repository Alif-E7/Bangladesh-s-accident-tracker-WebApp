const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("../utils/asyncHandler");

const prisma = new PrismaClient();

// @desc    Get accidents with filters (supports all CSV columns)
// @route   GET /api/accidents
// @access  Public
exports.getAccidents = asyncHandler(async (req, res) => {
    const {
        location,
        startDate,
        endDate,
        minDeaths,
        maxDeaths,
        minInjuries,
        maxInjuries,
        weather,
        vehicleType,
        victimCategory,
        roadCondition,
        trafficControl,
        peakPeriod,
        lightCondition,
        roadClassification,
        placeCharacteristic,
        trafficCondition,
        junction,
        year,
        month,
        // Geospatial radius search
        lat,
        lng,
        radiusKm,
        // Sorting
        sortBy = "accidentDatetime",
        sortOrder = "desc",
        // Pagination
        page = 1,
        limit = 50,
    } = req.query;

    const where = {};

    // Location text search
    if (location) {
        where.location = {
            region: { contains: location },
        };
    }

    // Date range
    if (startDate || endDate) {
        where.accidentDatetime = {};
        if (startDate) where.accidentDatetime.gte = new Date(startDate);
        if (endDate) where.accidentDatetime.lte = new Date(endDate);
    }

    // Deaths range
    if (minDeaths || maxDeaths) {
        where.deaths = {};
        if (minDeaths) where.deaths.gte = parseInt(minDeaths);
        if (maxDeaths) where.deaths.lte = parseInt(maxDeaths);
    }

    // Injuries range
    if (minInjuries || maxInjuries) {
        where.injuries = {};
        if (minInjuries) where.injuries.gte = parseInt(minInjuries);
        if (maxInjuries) where.injuries.lte = parseInt(maxInjuries);
    }

    // Relational filters
    if (weather) {
        where.weatherCondition = { name: weather };
    }
    if (vehicleType) {
        where.vehicleType = { name: vehicleType };
    }
    if (victimCategory) {
        where.victimCategory = { name: victimCategory };
    }
    if (roadCondition) {
        where.roadCondition = { name: roadCondition };
    }
    if (trafficControl) {
        where.trafficControl = { name: trafficControl };
    }

    // Direct field filters (from additional CSV columns)
    if (peakPeriod) where.peakPeriod = peakPeriod;
    if (lightCondition) where.lightCondition = lightCondition;
    if (roadClassification) where.roadClassification = roadClassification;
    if (placeCharacteristic) where.placeCharacteristic = placeCharacteristic;
    if (trafficCondition) where.trafficCondition = trafficCondition;
    if (junction) where.junction = junction;
    if (year) where.year = parseInt(year);
    if (month) where.month = month;

    // Geospatial radius search (post-filter since MySQL doesn't have native geo)
    let useGeoFilter = false;
    let geoLat, geoLng, geoRadius;
    if (lat && lng && radiusKm) {
        useGeoFilter = true;
        geoLat = parseFloat(lat);
        geoLng = parseFloat(lng);
        geoRadius = parseFloat(radiusKm);
    }

    // Build orderBy
    const validSortFields = [
        "accidentDatetime", "deaths", "injuries", "createdAt", "year"
    ];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : "accidentDatetime";
    const orderByDir = sortOrder === "asc" ? "asc" : "desc";

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    if (useGeoFilter) {
        // For geo filtering, fetch all matching accidents then filter by distance
        const allAccidents = await prisma.accident.findMany({
            where,
            include: {
                location: { select: { region: true, latitude: true, longitude: true } },
                weatherCondition: { select: { name: true } },
                roadCondition: { select: { name: true } },
                vehicleType: { select: { name: true } },
                victimCategory: { select: { name: true } },
                trafficControl: { select: { name: true } },
            },
            orderBy: { [orderByField]: orderByDir },
        });

        // Filter by distance
        const filtered = allAccidents.filter((a) => {
            const dist = getDistanceFromLatLonInKm(
                geoLat, geoLng,
                a.location.latitude, a.location.longitude
            );
            return dist <= geoRadius;
        });

        const total = filtered.length;
        const paginated = filtered.slice(skip, skip + take);

        return res.status(200).json({
            success: true,
            count: paginated.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / take),
            data: paginated,
        });
    }

    const [accidents, total] = await Promise.all([
        prisma.accident.findMany({
            where,
            include: {
                location: { select: { region: true, latitude: true, longitude: true } },
                weatherCondition: { select: { name: true } },
                roadCondition: { select: { name: true } },
                vehicleType: { select: { name: true } },
                victimCategory: { select: { name: true } },
                trafficControl: { select: { name: true } },
            },
            orderBy: { [orderByField]: orderByDir },
            skip,
            take,
        }),
        prisma.accident.count({ where }),
    ]);

    res.status(200).json({
        success: true,
        count: accidents.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / take),
        data: accidents,
    });
});

// @desc    Get single accident by ID
// @route   GET /api/accidents/:id
// @access  Public
exports.getAccidentById = asyncHandler(async (req, res) => {
    const accident = await prisma.accident.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {
            location: true,
            weatherCondition: true,
            roadCondition: true,
            vehicleType: true,
            trafficControl: true,
            victimCategory: true,
        },
    });

    if (!accident) {
        return res.status(404).json({
            success: false,
            message: "Accident not found",
        });
    }

    res.status(200).json({
        success: true,
        data: accident,
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

// @desc    Execute raw SQL query
// @route   POST /api/accidents/query
// @access  Public
exports.executeRawQuery = asyncHandler(async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({
            success: false,
            message: "SQL query is required",
        });
    }

    try {
        const results = await prisma.$queryRawUnsafe(query);
        
        // Handle BigInt serialization issue in JSON
        const serializedResults = JSON.parse(JSON.stringify(results, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value
        ));

        res.status(200).json({
            success: true,
            count: serializedResults.length,
            data: serializedResults,
            total: serializedResults.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Query execution failed. Check your syntax.",
        });
    }
});