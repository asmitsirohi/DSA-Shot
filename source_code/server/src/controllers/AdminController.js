const DataStructure = require("../models/DataStructureModel");
const Question = require("../models/QuestionsModel");
const User = require("../models/UserModel");

class AdminController {
  dashboard = async (req, res) => {
    const usersCount = await User.find({}).countDocuments();
    const dataStructuresCount = await DataStructure.find({}).countDocuments();
    const questionsCount = await Question.find({}).countDocuments();

    res
      .status(200)
      .json({ status: "ok", usersCount, dataStructuresCount, questionsCount });
  };

  addQuestionPage = async (req, res) => {
    try {
      const dataStructures = await DataStructure.find({}).lean();

      res.status(200).json({ status: "ok", result: dataStructures });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  addQuestion = async (req, res) => {
    try {
      const { dataStructure, question, difficulty, link } = req.body;

      const nextquestion = await Question.findOne({ question });

      if (nextquestion != null) {
        return res.status(200).json({ status: "already_exists" });
      }

      const newQuestion = new Question({
        datastructure: dataStructure,
        question,
        difficulty,
        link,
      });

      await newQuestion.save();

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  addDataStructurePage = (req, res) => {
    res.status(200).json({ status: "ok" });
  };

  addDataStructure = async (req, res) => {
    try {
      const { name } = req.body;

      const newDataStructure = new DataStructure({
        name,
      });

      await newDataStructure.save();

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  rolesPage = async (req, res) => {
    try {
      const users = await User.find(
        {},
        { password: 0, email: 0, createdAt: 0 }
      ).lean();

      res.status(200).json({ status: "ok", result: users });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  roles = async (req, res) => {
    try {
      const { userId, roleName } = req.body;

      const user = await User.findByIdAndUpdate(
        { _id: userId },
        { role: roleName }
      );

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  };

  deleteUser = async (req, res) => {
    const { id } = req.body;

    try {
      await User.deleteOne({ _id: id });

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  };

  manageDataStructurePage = async (req, res) => {
    try {
      const datastructures = await DataStructure.find(
        {},
        { createdAt: 0 }
      ).lean();

      res.status(200).json({ status: "ok", result: datastructures });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  };

  manageDataStructureDelete = async (req, res) => {
    const { id } = req.body;

    try {
      await DataStructure.deleteOne({ _id: id });

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  };

  manageDataStructureEdit = async (req, res) => {
    const { id, dataStructure } = req.body;

    try {
      await DataStructure.findByIdAndUpdate(
        { _id: id },
        { name: dataStructure }
      );

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  };

  manageQuestionsPage = async (req, res) => {
    try {
      const questions = await Question.find({}, { createdAt: 0 })
        .populate("datastructure")
        .lean();

      res.status(200).json({ status: "ok", result: questions });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  };

  manageQuestionsDelete = async (req, res) => {
    const { id } = req.body;

    try {
      await Question.deleteOne({ _id: id });

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  };

  manageQuestionEdit = async (req, res) => {
    const { editId, question, datastructureId, difficulty, link } = req.body;

    try {
      await Question.findByIdAndUpdate(
        { _id: editId },
        {
          dataStructure: datastructureId,
          question: question,
          difficulty: difficulty,
          link: link,
        }
      );

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  };
}

module.exports = AdminController;
