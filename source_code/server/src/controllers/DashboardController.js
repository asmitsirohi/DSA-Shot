const DataStructure = require("../models/DataStructureModel");
const Solved = require("../models/SolvedModel");
const Question = require("../models/QuestionsModel");

class DashboardController {
  landingPage = (req, res) => {
    res.status(200).json({ status: "error" });
  };

  dashboard = (req, res) => {
    const role = req.user.role;
    const name = req.user.name;

    res.status(200).json({ status: "ok", result: { name, role } });
  };

  trackProgress = async (req, res) => {
    const userId = req.user._id;

    let bulk = {};
    const datastructures = await DataStructure.find({}, { _id: 1, name: 1 });

    for (const datastructure of datastructures) {
      const solvedCount = await Solved.find({
        $and: [{ datastructure: datastructure._id }, { user: userId }],
      }).countDocuments();

      const questionCount = await Question.find({
        datastructure: datastructure._id,
      }).countDocuments();

      bulk[datastructure.name] = (
        (solvedCount * 100) /
        questionCount
      ).toPrecision(3);
    }

    res.status(200).json({ status: "ok", progress: bulk });
  };

  about = (req, res) => {
    res.status(200).json({ status: "ok" });
  };
}

module.exports = DashboardController;
