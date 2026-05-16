-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `region` VARCHAR(191) NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeatherCondition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `WeatherCondition_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoadCondition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RoadCondition_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VehicleType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `VehicleType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrafficControl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TrafficControl_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VictimCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `VictimCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Accident` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accidentSerialNo` VARCHAR(191) NULL,
    `accidentDatetime` DATETIME(3) NULL,
    `peakPeriod` VARCHAR(191) NULL,
    `deaths` INTEGER NULL DEFAULT 0,
    `injuries` INTEGER NULL DEFAULT 0,
    `vehicleCount` INTEGER NULL,
    `sourceFile` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `locationId` INTEGER NOT NULL,
    `weatherConditionId` INTEGER NULL,
    `roadConditionId` INTEGER NULL,
    `vehicleTypeId` INTEGER NULL,
    `trafficControlId` INTEGER NULL,
    `victimCategoryId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Accident` ADD CONSTRAINT `Accident_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Accident` ADD CONSTRAINT `Accident_weatherConditionId_fkey` FOREIGN KEY (`weatherConditionId`) REFERENCES `WeatherCondition`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Accident` ADD CONSTRAINT `Accident_roadConditionId_fkey` FOREIGN KEY (`roadConditionId`) REFERENCES `RoadCondition`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Accident` ADD CONSTRAINT `Accident_vehicleTypeId_fkey` FOREIGN KEY (`vehicleTypeId`) REFERENCES `VehicleType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Accident` ADD CONSTRAINT `Accident_trafficControlId_fkey` FOREIGN KEY (`trafficControlId`) REFERENCES `TrafficControl`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Accident` ADD CONSTRAINT `Accident_victimCategoryId_fkey` FOREIGN KEY (`victimCategoryId`) REFERENCES `VictimCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
