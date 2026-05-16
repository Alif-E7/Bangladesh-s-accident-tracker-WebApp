// backend/scripts/importData.js

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const csvFilePath = path.join(
    __dirname,
    "../datasets/Road_Accidents.csv"
);

// -----------------------------
// GENERIC FIND OR CREATE
// -----------------------------
async function getOrCreate(model, value) {
    if (!value || value.trim() === "") {
        return null;
    }

    const cleanedValue = value.trim();

    const existing = await model.findFirst({
        where: {
            name: cleanedValue,
        },
    });

    if (existing) {
        return existing.id;
    }

    const created = await model.create({
        data: {
            name: cleanedValue,
        },
    });

    return created.id;
}

// -----------------------------
// MAIN IMPORT FUNCTION
// -----------------------------
async function importData() {
    const rows = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (row) => {
            rows.push(row);
        })
        .on("end", async () => {
            console.log(`CSV Loaded: ${rows.length} rows`);

            let successCount = 0;
            let errorCount = 0;

            for (const row of rows) {
                try {
                    // -----------------------------
                    // CREATE LOCATION
                    // -----------------------------
                    const location = await prisma.location.create({
                        data: {
                            region: row.location || null,
                            latitude: parseFloat(row.latitude),
                            longitude: parseFloat(row.longitude),
                        },
                    });

                    // -----------------------------
                    // LOOKUP TABLES
                    // -----------------------------
                    const weatherConditionId = await getOrCreate(
                        prisma.weatherCondition,
                        row.weather
                    );

                    const roadConditionId = await getOrCreate(
                        prisma.roadCondition,
                        row.road_surface_condition
                    );

                    const vehicleTypeId = await getOrCreate(
                        prisma.vehicleType,
                        row.accident_type
                    );

                    const trafficControlId = await getOrCreate(
                        prisma.trafficControl,
                        row.traffic_control
                    );

                    const victimCategoryId = await getOrCreate(
                        prisma.victimCategory,
                        row.victim_category
                    );

                    // CREATE ACCIDENT
                    // -----------------------------
                    let accidentDateTime = null;
                    if (row.accident_date && row.accident_time) {
                        const dateStr = `${row.accident_date.trim()}T${row.accident_time.trim()}`;
                        const parsedDate = new Date(dateStr);

                        // Validate that the Date object is actually valid
                        if (!isNaN(parsedDate.getTime())) {
                            accidentDateTime = parsedDate;
                        } else {
                            console.warn(`⚠️ Skipping invalid date/time for row ${row.accident_serial_no}: ${dateStr}`);
                        }
                    }

                    const deaths = parseInt(row.deaths) || 0;
                    const injuries = parseInt(row.injuries) || 0;

                    await prisma.accident.create({
                        data: {
                            accidentSerialNo: row.accident_serial_no || null,
                            accidentDatetime: accidentDateTime,
                            peakPeriod: row.peak_period || null,
                            deaths: deaths,
                            injuries: injuries,
                            vehicleCount: parseInt(row.vehicle_count) || 0,
                            sourceFile: "Road_Accidents.csv",

                            // Additional CSV fields for advanced filtering
                            lightCondition: row.light_condition || null,
                            lighting: row.lighting || null,
                            roadSurfaceType: row.road_surface_type || null,
                            roadNature: row.road_nature || null,
                            roadClassification: row.road_classification || null,
                            placeCharacteristic: row.place_characteristic || null,
                            roadConnectionPoint: row.road_connection_point || null,
                            trafficCondition: row.traffic_condition || null,
                            junction: row.junction || null,
                            year: parseInt(row.year) || null,
                            month: row.month || null,

                            // Foreign Keys
                            locationId: location.id,
                            weatherConditionId,
                            roadConditionId,
                            vehicleTypeId,
                            trafficControlId,
                            victimCategoryId,
                        },
                    });

                    successCount++;
                    if (successCount % 500 === 0) {
                        console.log(`Progress: ${successCount} / ${rows.length} accidents imported...`);
                    }

                } catch (error) {
                    errorCount++;
                    console.error(
                        `Error importing row ${row.accident_serial_no}:`,
                        error.message
                    );
                }
            }

            console.log("\n=================================");
            console.log("IMPORT FINISHED");
            console.log(`✅ Success: ${successCount}`);
            console.log(`❌ Errors: ${errorCount}`);
            console.log(`📊 Total: ${rows.length}`);
            console.log("=================================\n");

            await prisma.$disconnect();
        });
}

importData();