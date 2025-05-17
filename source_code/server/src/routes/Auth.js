const express = require("express");
const passport = require("passport");

const router = express.Router();

// const redirectURL = "http://localhost:3000";
const redirectURL = "https://dsashot.vercel.com/";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/dashboard" }),
  (req, res) => {
    res.redirect(redirectURL);
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/dashboard" }),
  (req, res) => {
    res.redirect(redirectURL);
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/dashboard" }),
  (req, res) => {
    res.redirect(redirectURL);
  }
);

module.exports = router;
