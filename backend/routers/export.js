const express = require("express");
const router = express.Router();
const { exportCSV, exportJSON } = require("../controllers/exportController");

router.route("/csv").get(exportCSV);
router.route("/json").get(exportJSON);

module.exports = router;
