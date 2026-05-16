const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Try creating a location
    const location = await prisma.location.create({
        data: {
            region: 'Test Highway',
            latitude: 40.7128,
            longitude: -74.0060
        }
    })
    console.log('Created location:', location)

    // Fetch all locations
    const allLocations = await prisma.location.findMany()
    console.log('All locations:', allLocations)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())