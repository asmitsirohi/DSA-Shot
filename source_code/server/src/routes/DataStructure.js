const express = require("express");
const DataStructureController = require("../controllers/DataStructureController");
const { ensureAuth, ensureGuest } = require("../middlewares/auth");

const router = express.Router();
const DataStructureControllerObj = new DataStructureController();

router.get("/datastructures", DataStructureControllerObj.datastrucuture);
router.post("/questions", DataStructureControllerObj.questions);
router.post("/specificQuestion", DataStructureControllerObj.specificQuestion);
router.post(
  "/solveQuestion",
  ensureAuth,
  DataStructureControllerObj.solveQuestion
);
router.post(
  "/checkSolveQuestion",
  ensureAuth,
  DataStructureControllerObj.checkSolveQuestion
);
router.post("/saveCode", ensureAuth, DataStructureControllerObj.saveCode);

module.exports = router;
