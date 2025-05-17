const express = require("express");
const DashboardController = require("../controllers/DashboardController");
const { ensureAuth, ensureGuest } = require("../middlewares/auth");

const router = express.Router();
const DashboardControllerObj = new DashboardController();

router.get("/landingPage", ensureGuest, DashboardControllerObj.landingPage);
router.get("/dashboard", ensureAuth, DashboardControllerObj.dashboard);
router.get("/trackProgress", ensureAuth, DashboardControllerObj.trackProgress);
router.get("/about", ensureAuth, DashboardControllerObj.about);

module.exports = router;
