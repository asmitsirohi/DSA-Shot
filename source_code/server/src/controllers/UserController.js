const User = require("../models/UserModel");
const Solveds = require("../models/SolvedModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const sendmail = require("../middlewares/sendMail");

class UserController {
  signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await User.findOne({ email });

      if (user != null) {
        return res
          .status(200)
          .json({ status: "error", error: "already_exists" });
      }

      const OTP = Math.floor(100000 + Math.random() * 900000);

      const token = jwt.sign(
        {
          name,
          email,
          password,
          OTP,
        },
        process.env.JWT_SECRET
      );

      const subject = "OTP for DSAShot account verification";
      const body = `<h2>Hi, ${name}</h2><p>Your OTP: ${OTP}</p> <p>Your OTP will expires in 5 minutes.</p><br><br> <small>Do not share your otp with others.</small>`;

      sendmail(email, subject, body, (err) => {
        if (err) {
          return res.status(200).json({ status: "error", error: "wrong" });
        }

        res.status(200).json({ status: "ok", dsaShotToken: token });
      });
    } catch (error) {
      res.status(200).json({ status: "error", error: "something_wrong" });
    }
  };

  verifyOTP = async (req, res) => {
    const { otp, token } = req.body;

    if (token == undefined) {
      return res.json({ status: "error", error: "otp_expires" });
    }

    try {
      let verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
      const encodedPassword = await bcrypt.hash(verifyToken.password, 10);

      if (otp == verifyToken.OTP) {
        const newUser = new User({
          name: verifyToken.name,
          email: verifyToken.email,
          password: encodedPassword,
        });

        res.clearCookie("dsaShotToken");
        await newUser.save();

        res.status(200).json({ status: "ok" });
      } else {
        return res.status(200).json({ status: "error", error: "invalid_otp" });
      }
    } catch (error) {
      res.status(200).json({ status: "error", error: "something_wrong" });
    }
  };

  login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res
          .status(200)
          .json({ status: "error", error: "something_wrong" });
      }
      if (!user) {
        return res.status(200).json({ status: "error", error: "invalid" });
      }
      req.logIn(user, (err) => {
        res.status(200).json({ status: "ok" });
      });
    })(req, res, next);
  };

  checkAuth = async (req, res) => {
    const role = req.user.role;
    const name = req.user.name;

    res.status(200).json({ status: "ok", result: { name, role } });
  };

  googleAuth = (req, res) => {};

  logout = (req, res) => {
    req.logout();
    res.status(200).json({ status: "ok" });
  };

  getUserData = async (req, res) => {
    try {
      const user = await User.findOne(
        { _id: req.user._id },
        { createdAt: 0, role: 0, password: 0 }
      ).lean();

      res.status(200).json({ status: "ok", result: user });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  updateUser = async (req, res) => {
    const { name } = req.body;

    try {
      await User.findByIdAndUpdate(req.user._id, {
        name,
      });

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
      const user = await User.findOne({ _id: req.user._id }).lean();

      if (!(await bcrypt.compare(oldPassword, user.password))) {
        return res.status(200).json({ status: "error" });
      }

      const password = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(req.user._id, {
        password,
      });

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  documentCounter = async (req, res) => {
    try {
      const solvedQuestionCount = await Solveds.find({
        user: req.user._id,
      }).countDocuments();

      res.status(200).json({ status: "ok", result: solvedQuestionCount });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  addBookmark = async (req, res) => {
    const { quesId } = req.body;

    try {
      await User.updateOne(
        { _id: req.user._id },
        {
          $addToSet: { bookmarks: quesId },
        }
      );

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  removeBookmark = async (req, res) => {
    const { quesId } = req.body;

    try {
      await User.updateOne(
        { _id: req.user._id },
        {
          $pull: { bookmarks: quesId },
        }
      );

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  getBookmarks = async (req, res) => {
    try {
      const userBookmarks = await User.find(
        { _id: req.user._id },
        { bookmarks: 1, _id: 0 }
      );

      res.status(200).json({ status: "ok", result: userBookmarks });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  getBookmarkData = async (req, res) => {
    try {
      const userBookmarks = await User.find(
        { _id: req.user._id },
        { bookmarks: 1, _id: 0 }
      )
        .populate({
          path: "bookmarks",
          populate: { path: "datastructure" },
        })
        .lean();

      let solvedQues = [];

      if (req.user?._id != undefined) {
        solvedQues = await Solveds.find(
          {
            user: req.user._id,
          },
          { question: 1, _id: 0 }
        ).lean();
      }

      res.status(200).json({ status: "ok", result: userBookmarks, solvedQues });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };
}

module.exports = UserController;
