const mongoose = require("mongoose");

const DataStructureSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DataStructure = new mongoose.model("datastructure", DataStructureSchema);

module.exports = DataStructure;
