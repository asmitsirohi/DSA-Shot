const express = require("express");
const AdminController = require("../controllers/AdminController");
const {
  ensureAdmin,
  ensureAuth,
  ensureCoAdmin,
} = require("../middlewares/auth");

const router = express.Router();
const AdminControllerObj = new AdminController();

router.get(
  "/dashboard",
  ensureAuth,
  ensureCoAdmin,
  AdminControllerObj.dashboard
);
router.get(
  "/addquestion",
  ensureAuth,
  ensureCoAdmin,
  AdminControllerObj.addQuestionPage
);
router.post(
  "/addquestion",
  ensureAuth,
  ensureCoAdmin,
  AdminControllerObj.addQuestion
);
router.get(
  "/adddatastructure",
  ensureAuth,
  ensureCoAdmin,
  AdminControllerObj.addDataStructurePage
);
router.post(
  "/adddatastructure",
  ensureAuth,
  ensureCoAdmin,
  AdminControllerObj.addDataStructure
);
router.get("/roles", ensureAuth, ensureAdmin, AdminControllerObj.rolesPage);
router.post("/roles", ensureAuth, ensureAdmin, AdminControllerObj.roles);
router.post(
  "/deleteuser",
  ensureAuth,
  ensureAdmin,
  AdminControllerObj.deleteUser
);
router.get(
  "/managedatastructure",
  ensureAuth,
  ensureCoAdmin,
  AdminControllerObj.manageDataStructurePage
);
router.post(
  "/deletedatastructure",
  ensureAuth,
  ensureCoAdmin,
  AdminControllerObj.manageDataStructureDelete
);
router.post(
  "/editdatastructure",
  ensureAuth,
  ensureCoAdmin,
  AdminControllerObj.manageDataStructureEdit
);
router.get(
  "/managequestions",
  ensureAuth,
  ensureCoAdmin,
  AdminControllerObj.manageQuestionsPage
);
router.post(
  "/deletequestion",
  ensureAuth,
  ensureCoAdmin,
  AdminControllerObj.manageQuestionsDelete
);
router.post(
  "/editquestion",
  ensureAuth,
  ensureCoAdmin,
  AdminControllerObj.manageQuestionEdit
);

module.exports = router;
