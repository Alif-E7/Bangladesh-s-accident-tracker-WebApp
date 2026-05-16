const express = require("express");
const router = express.Router();

router.use("/zones", require("./zones"));
router.use("/accidents", require("./accidents"));
router.use("/stats", require("./stats"));
router.use("/auth", require("./auth"));
router.use("/export", require("./export"));

// Health check
router.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

module.exports = router;