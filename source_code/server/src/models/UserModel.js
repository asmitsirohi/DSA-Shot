const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  authId: {
    type: String,
  },
  role: {
    type: "String",
    default: "user",
    enum: ["user", "admin", "coadmin"],
  },
  loginMethod: {
    type: String,
    default: "local",
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "question",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = new mongoose.model("user", UserSchema);

module.exports = User;
