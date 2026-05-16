// backend/scripts/calculateZones.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// -----------------------------
// CONFIGURATION
// -----------------------------
const CONFIG = {
    // Distance threshold in kilometers for grouping nearby accidents
    CLUSTER_DISTANCE_KM: 0.5, // 500 meters

    // Weights for calculating risk score
    WEIGHTS: {
        DEATH: 3,
        INJURY: 1
    },

    // Percentile-based risk thresholds (calculated dynamically)
    PERCENTILES: {
        RED: 0.85,    // Top 15% = RED
        YELLOW: 0.50, // Middle 35% = YELLOW
        // Bottom 50% = GREEN
    }
};

// -----------------------------
// HELPER: CALCULATE DISTANCE (Haversine Formula)
// -----------------------------
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// -----------------------------
// HELPER: CALCULATE RISK SCORE
// Improved formula: weighted casualties × log(accidentCount + 1)
// -----------------------------
function calculateRiskScore(accidents) {
    let totalDeaths = 0;
    let totalInjuries = 0;

    accidents.forEach((accident) => {
        totalDeaths += accident.deaths || 0;
        totalInjuries += accident.injuries || 0;
    });

    const casualtyScore =
        totalDeaths * CONFIG.WEIGHTS.DEATH +
        totalInjuries * CONFIG.WEIGHTS.INJURY;

    // Scale by log of accident count for density factor
    const riskScore = casualtyScore * Math.log(accidents.length + 1);

    return {
        riskScore: Math.round(riskScore * 100) / 100,
        totalDeaths,
        totalInjuries,
        accidentCount: accidents.length,
    };
}

// -----------------------------
// MAIN: CLUSTER LOCATIONS
// -----------------------------
async function clusterLocations() {
    console.log("📍 Fetching all locations with accidents...");

    const locations = await prisma.location.findMany({
        include: {
            accidents: {
                select: {
                    id: true,
                    deaths: true,
                    injuries: true,
                    accidentDatetime: true,
                },
            },
        },
    });

    console.log(`Found ${locations.length} locations`);

    const clusters = [];
    const visited = new Set();

    // Cluster locations based on distance
    for (let i = 0; i < locations.length; i++) {
        if (visited.has(i)) continue;

        const cluster = [locations[i]];
        visited.add(i);

        for (let j = i + 1; j < locations.length; j++) {
            if (visited.has(j)) continue;

            const distance = getDistanceFromLatLonInKm(
                locations[i].latitude,
                locations[i].longitude,
                locations[j].latitude,
                locations[j].longitude
            );

            if (distance <= CONFIG.CLUSTER_DISTANCE_KM) {
                cluster.push(locations[j]);
                visited.add(j);
            }
        }

        clusters.push(cluster);
    }

    console.log(`📊 Created ${clusters.length} clusters`);

    return clusters;
}

// -----------------------------
// HELPER: Get most common region name in a cluster
// -----------------------------
function getMostCommonRegion(cluster) {
    const regionCounts = {};
    cluster.forEach((loc) => {
        if (loc.region) {
            regionCounts[loc.region] = (regionCounts[loc.region] || 0) + 1;
        }
    });

    let maxCount = 0;
    let mostCommon = null;
    for (const [region, count] of Object.entries(regionCounts)) {
        if (count > maxCount) {
            maxCount = count;
            mostCommon = region;
        }
    }

    return mostCommon;
}

// -----------------------------
// MAIN: CREATE/UPDATE ALERT ZONES
// -----------------------------
async function calculateAndStoreZones() {
    try {
        console.log("🚀 Starting zone calculation...\n");

        // Clear existing alert zones
        console.log("🗑️  Clearing existing alert zones...");
        await prisma.alertZone.deleteMany({});
        console.log("✅ Existing zones cleared\n");

        // Get clustered locations
        const clusters = await clusterLocations();

        // First pass: calculate all risk scores
        const zoneData = [];

        for (const cluster of clusters) {
            const allAccidents = cluster.flatMap((loc) => loc.accidents);

            if (allAccidents.length === 0) continue;

            const centroidLat =
                cluster.reduce((sum, loc) => sum + loc.latitude, 0) / cluster.length;
            const centroidLon =
                cluster.reduce((sum, loc) => sum + loc.longitude, 0) / cluster.length;

            const { riskScore, totalDeaths, totalInjuries, accidentCount } =
                calculateRiskScore(allAccidents);

            const regionName = getMostCommonRegion(cluster);

            zoneData.push({
                latitude: centroidLat,
                longitude: centroidLon,
                riskScore,
                totalDeaths,
                totalInjuries,
                accidentCount,
                regionName,
            });
        }

        // Second pass: determine alert levels based on percentiles
        const sortedScores = zoneData.map((z) => z.riskScore).sort((a, b) => a - b);
        const redThreshold = sortedScores[Math.floor(sortedScores.length * CONFIG.PERCENTILES.RED)] || 10;
        const yellowThreshold = sortedScores[Math.floor(sortedScores.length * CONFIG.PERCENTILES.YELLOW)] || 5;

        console.log(`\n📊 Risk Score Thresholds:`);
        console.log(`   🔴 RED: >= ${redThreshold}`);
        console.log(`   🟡 YELLOW: >= ${yellowThreshold}`);
        console.log(`   🟢 GREEN: < ${yellowThreshold}\n`);

        let zoneId = 1;

        for (const zone of zoneData) {
            let alertLevel;
            if (zone.riskScore >= redThreshold) {
                alertLevel = "RED";
            } else if (zone.riskScore >= yellowThreshold) {
                alertLevel = "YELLOW";
            } else {
                alertLevel = "GREEN";
            }

            await prisma.alertZone.create({
                data: {
                    latitude: zone.latitude,
                    longitude: zone.longitude,
                    riskScore: zone.riskScore,
                    alertLevel: alertLevel,
                    accidentCount: zone.accidentCount,
                    totalDeaths: zone.totalDeaths,
                    totalInjuries: zone.totalInjuries,
                    radiusKm: CONFIG.CLUSTER_DISTANCE_KM,
                    regionName: zone.regionName,
                },
            });

            const colorCode =
                alertLevel === "RED"
                    ? "🔴"
                    : alertLevel === "YELLOW"
                        ? "🟡"
                        : "🟢";

            if (zoneId <= 20 || alertLevel === "RED") {
                console.log(
                    `${colorCode} Zone #${zoneId}: ${alertLevel} | Risk: ${zone.riskScore} | Accidents: ${zone.accidentCount} | Deaths: ${zone.totalDeaths} | Injuries: ${zone.totalInjuries} | ${zone.regionName || "Unknown"}`
                );
            }
            zoneId++;
        }

        // Summary statistics
        const zoneStats = await prisma.alertZone.groupBy({
            by: ["alertLevel"],
            _count: true,
        });

        console.log("\n=================================");
        console.log("📊 ZONE CALCULATION SUMMARY");
        console.log("=================================");

        const totalZones = await prisma.alertZone.count();
        console.log(`Total Zones Created: ${totalZones}`);

        zoneStats.forEach((stat) => {
            const icon =
                stat.alertLevel === "RED"
                    ? "🔴"
                    : stat.alertLevel === "YELLOW"
                        ? "🟡"
                        : "🟢";
            console.log(`${icon} ${stat.alertLevel} Zones: ${stat._count}`);
        });

        console.log("=================================\n");
        console.log("✅ Zone calculation completed successfully!");

    } catch (error) {
        console.error("❌ Error calculating zones:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// -----------------------------
// RUN THE SCRIPT
// -----------------------------
calculateAndStoreZones();