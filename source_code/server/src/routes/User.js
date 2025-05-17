const express = require("express");
const UserController = require("../controllers/UserController");
const { ensureGuest, ensureAuth } = require("../middlewares/auth");
const googleRecaptcha = require("../utils/googleRecaptcha");

const router = express.Router();
const UserControllerObj = new UserController();

router.post("/signup", ensureGuest, googleRecaptcha, UserControllerObj.signup);
router.post(
  "/verifyOTP",
  ensureGuest,
  googleRecaptcha,
  UserControllerObj.verifyOTP
);
router.post("/login", ensureGuest, googleRecaptcha, UserControllerObj.login);
router.get("/checkAuth", ensureAuth, UserControllerObj.checkAuth);
router.get("/getUserData", ensureAuth, UserControllerObj.getUserData);
router.post("/updateUser", ensureAuth, UserControllerObj.updateUser);
router.post("/changePassword", ensureAuth, UserControllerObj.changePassword);
router.get("/documentCounter", ensureAuth, UserControllerObj.documentCounter);
router.post("/addBookmark", ensureAuth, UserControllerObj.addBookmark);
router.post("/removeBookmark", ensureAuth, UserControllerObj.removeBookmark);
router.get("/getBookmarks", ensureAuth, UserControllerObj.getBookmarks);
router.get("/getBookmarkData", ensureAuth, UserControllerObj.getBookmarkData);
router.get("/logout", ensureAuth, UserControllerObj.logout);

module.exports = router;
