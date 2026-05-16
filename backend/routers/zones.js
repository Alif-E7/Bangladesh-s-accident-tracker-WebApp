const express = require("express");
const router = express.Router();
const {
    getZones,
    getZoneById,
    calculateZones,
} = require("../controllers/zoneController");

router.route("/").get(getZones);
router.route("/calculate").post(calculateZones);
router.route("/:id").get(getZoneById);

module.exports = router;