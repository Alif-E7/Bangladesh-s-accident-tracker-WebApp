const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("../utils/asyncHandler");

const prisma = new PrismaClient();

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Public
exports.getStats = asyncHandler(async (req, res) => {
    const [
        totalAccidents,
        totalDeaths,
        totalInjuries,
        zoneStats,
        weatherStats,
        peakPeriodStats,
        recentAccidents,
    ] = await Promise.all([
        prisma.accident.count(),
        prisma.accident.aggregate({ _sum: { deaths: true } }),
        prisma.accident.aggregate({ _sum: { injuries: true } }),
        prisma.alertZone.groupBy({
            by: ["alertLevel"],
            _count: true,
        }),
        prisma.weatherCondition.findMany({
            include: { _count: { select: { accidents: true } } },
        }),
        prisma.accident.groupBy({
            by: ["peakPeriod"],
            _count: true,
        }),
        prisma.accident.findMany({
            include: { location: { select: { region: true, latitude: true, longitude: true } } },
            orderBy: { accidentDatetime: "desc" },
            take: 10,
        }),
    ]);

    res.status(200).json({
        success: true,
        data: {
            overview: {
                totalAccidents,
                totalDeaths: totalDeaths._sum.deaths || 0,
                totalInjuries: totalInjuries._sum.injuries || 0,
                fatalityRate: totalAccidents
                    ? ((totalDeaths._sum.deaths || 0) / totalAccidents * 100).toFixed(2)
                    : 0,
            },
            zones: zoneStats.reduce((acc, curr) => {
                acc[curr.alertLevel] = curr._count;
                return acc;
            }, {}),
            byWeather: weatherStats.map((w) => ({
                name: w.name,
                count: w._count.accidents,
            })),
            byPeakPeriod: peakPeriodStats.map((p) => ({
                period: p.peakPeriod,
                count: p._count,
            })),
            recentAccidents: recentAccidents.map((a) => ({
                id: a.id,
                datetime: a.accidentDatetime,
                location: a.location,
                deaths: a.deaths,
                injuries: a.injuries,
            })),
        },
    });
});

// @desc    Get timeline data (accidents grouped by year/month)
// @route   GET /api/stats/timeline
// @access  Public
exports.getTimeline = asyncHandler(async (req, res) => {
    const timeline = await prisma.accident.groupBy({
        by: ["year", "month"],
        _count: true,
        _sum: {
            deaths: true,
            injuries: true,
        },
        orderBy: [{ year: "asc" }, { month: "asc" }],
    });

    res.status(200).json({
        success: true,
        data: timeline.map((t) => ({
            year: t.year,
            month: t.month,
            count: t._count,
            deaths: t._sum.deaths || 0,
            injuries: t._sum.injuries || 0,
        })),
    });
});

// @desc    Get distinct filter values for populating dropdowns
// @route   GET /api/stats/filters
// @access  Public
exports.getFilterOptions = asyncHandler(async (req, res) => {
    const [
        weatherConditions,
        roadConditions,
        vehicleTypes,
        victimCategories,
        trafficControls,
        peakPeriods,
        lightConditions,
        roadClassifications,
        placeCharacteristics,
        trafficConditions,
        junctions,
        years,
        months,
    ] = await Promise.all([
        prisma.weatherCondition.findMany({ select: { name: true }, orderBy: { name: "asc" } }),
        prisma.roadCondition.findMany({ select: { name: true }, orderBy: { name: "asc" } }),
        prisma.vehicleType.findMany({ select: { name: true }, orderBy: { name: "asc" } }),
        prisma.victimCategory.findMany({ select: { name: true }, orderBy: { name: "asc" } }),
        prisma.trafficControl.findMany({ select: { name: true }, orderBy: { name: "asc" } }),
        prisma.accident.findMany({ distinct: ["peakPeriod"], select: { peakPeriod: true }, where: { peakPeriod: { not: null } } }),
        prisma.accident.findMany({ distinct: ["lightCondition"], select: { lightCondition: true }, where: { lightCondition: { not: null } } }),
        prisma.accident.findMany({ distinct: ["roadClassification"], select: { roadClassification: true }, where: { roadClassification: { not: null } } }),
        prisma.accident.findMany({ distinct: ["placeCharacteristic"], select: { placeCharacteristic: true }, where: { placeCharacteristic: { not: null } } }),
        prisma.accident.findMany({ distinct: ["trafficCondition"], select: { trafficCondition: true }, where: { trafficCondition: { not: null } } }),
        prisma.accident.findMany({ distinct: ["junction"], select: { junction: true }, where: { junction: { not: null } } }),
        prisma.accident.findMany({ distinct: ["year"], select: { year: true }, where: { year: { not: null } }, orderBy: { year: "asc" } }),
        prisma.accident.findMany({ distinct: ["month"], select: { month: true }, where: { month: { not: null } } }),
    ]);

    res.status(200).json({
        success: true,
        data: {
            weatherConditions: weatherConditions.map((w) => w.name),
            roadConditions: roadConditions.map((r) => r.name),
            vehicleTypes: vehicleTypes.map((v) => v.name),
            victimCategories: victimCategories.map((v) => v.name),
            trafficControls: trafficControls.map((t) => t.name),
            peakPeriods: peakPeriods.map((p) => p.peakPeriod),
            lightConditions: lightConditions.map((l) => l.lightCondition),
            roadClassifications: roadClassifications.map((r) => r.roadClassification),
            placeCharacteristics: placeCharacteristics.map((p) => p.placeCharacteristic),
            trafficConditions: trafficConditions.map((t) => t.trafficCondition),
            junctions: junctions.map((j) => j.junction),
            years: years.map((y) => y.year),
            months: months.map((m) => m.month),
        },
    });
});