-- AlterTable
ALTER TABLE `accident` ADD COLUMN `junction` VARCHAR(191) NULL,
    ADD COLUMN `lightCondition` VARCHAR(191) NULL,
    ADD COLUMN `lighting` VARCHAR(191) NULL,
    ADD COLUMN `month` VARCHAR(191) NULL,
    ADD COLUMN `placeCharacteristic` VARCHAR(191) NULL,
    ADD COLUMN `roadClassification` VARCHAR(191) NULL,
    ADD COLUMN `roadConnectionPoint` VARCHAR(191) NULL,
    ADD COLUMN `roadNature` VARCHAR(191) NULL,
    ADD COLUMN `roadSurfaceType` VARCHAR(191) NULL,
    ADD COLUMN `trafficCondition` VARCHAR(191) NULL,
    ADD COLUMN `year` INTEGER NULL;

-- CreateTable
CREATE TABLE `AlertZone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `riskScore` DOUBLE NOT NULL,
    `alertLevel` VARCHAR(191) NOT NULL,
    `accidentCount` INTEGER NOT NULL,
    `totalDeaths` INTEGER NOT NULL DEFAULT 0,
    `totalInjuries` INTEGER NOT NULL DEFAULT 0,
    `radiusKm` DOUBLE NOT NULL DEFAULT 0.5,
    `regionName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
