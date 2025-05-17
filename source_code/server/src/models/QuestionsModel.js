const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  datastructure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "datastructure",
  },
  question: {
    type: "String",
    required: true,
    unique: true,
  },
  difficulty: {
    type: "String",
    default: "easy",
    enum: ["easy", "medium", "hard"],
  },
  link: {
    type: "String",
  },
  createdAt: {
    type: Date,
    deafault: Date.now,
  },
});

const Question = new mongoose.model("question", QuestionSchema);

module.exports = Question;
