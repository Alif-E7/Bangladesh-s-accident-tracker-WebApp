const express = require("express");
const router = express.Router();
const { getStats, getTimeline, getFilterOptions } = require("../controllers/statsController");

router.route("/").get(getStats);
router.route("/timeline").get(getTimeline);
router.route("/filters").get(getFilterOptions);

module.exports = router;