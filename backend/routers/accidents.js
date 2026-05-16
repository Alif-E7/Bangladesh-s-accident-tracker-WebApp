const express = require("express");
const router = express.Router();
const {
    getAccidents,
    getAccidentById,
    executeRawQuery,
} = require("../controllers/accidentController");

router.route("/query").post(executeRawQuery);
router.route("/").get(getAccidents);
router.route("/:id").get(getAccidentById);

module.exports = router;