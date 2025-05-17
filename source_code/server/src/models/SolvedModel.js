const mongoose = require("mongoose");

const SolvedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  datastructure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "datastructure",
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "question",
  },
  answer: {
    type: "String",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Solved = new mongoose.model("solved", SolvedSchema);

module.exports = Solved;
