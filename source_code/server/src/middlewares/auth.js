module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(200).json({ status: "error" });
    }
  },

  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.status(200).json({ status: "ok" });
    } else {
      next();
    }
  },

  ensureAdmin: function (req, res, next) {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(200).json({ status: "error" });
    }
  },

  ensureCoAdmin: function (req, res, next) {
    if (req.user.role == "admin" || req.user.role == "coadmin") {
      return next();
    } else {
      res.status(200).json({ status: "error" });
    }
  },
};
