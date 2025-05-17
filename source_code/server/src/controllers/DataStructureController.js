const DataStructure = require("../models/DataStructureModel");
const Question = require("../models/QuestionsModel");
const Solved = require("../models/SolvedModel");

class DataStructureController {
  datastrucuture = async (req, res) => {
    try {
      const dataStructures = await DataStructure.find({}).lean();

      res.status(200).json({ status: "ok", result: dataStructures });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  questions = async (req, res) => {
    const { id, difficultyMeasure } = req.body;
    let questions;
    try {
      if (difficultyMeasure === "all") {
        questions = await Question.find({ datastructure: id }).lean();
      } else if (difficultyMeasure === "easy_medium") {
        questions = await Question.find({
          $and: [
            { datastructure: id },
            { $or: [{ difficulty: "easy" }, { difficulty: "medium" }] },
          ],
        }).lean();
      } else if (difficultyMeasure === "medium_hard") {
        questions = await Question.find({
          $and: [
            { datastructure: id },
            { $or: [{ difficulty: "medium" }, { difficulty: "hard" }] },
          ],
        }).lean();
      } else if (difficultyMeasure === "easy_hard") {
        questions = await Question.find({
          $and: [
            { datastructure: id },
            { $or: [{ difficulty: "easy" }, { difficulty: "hard" }] },
          ],
        }).lean();
      } else {
        questions = await Question.find({
          $and: [{ datastructure: id }, { difficulty: difficultyMeasure }],
        }).lean();
      }

      let solvedQues = [];

      if (req.user?._id != undefined) {
        solvedQues = await Solved.find(
          {
            $and: [{ user: req.user._id }, { datastructure: id }],
          },
          { question: 1, _id: 0 }
        ).lean();

        // for (const question in questions) {
        //   for (const element in solvedQues) {
        //     if (element.question === question._id) {
        //       question.solved = true;
        //       break;
        //     }
        //   }
        // }

        // console.log(solvedQues);
        // console.log(questions);
      }

      res.status(200).json({ status: "ok", result: questions, solvedQues });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  specificQuestion = async (req, res) => {
    const { quesId } = req.body;

    try {
      const question = await Question.findOne({ _id: quesId });

      res.status(200).json({ status: "ok", result: question });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  solveQuestion = async (req, res) => {
    const { question, datastructure } = req.body;
    const user = req.user._id;

    try {
      const newSolve = new Solved({
        user,
        datastructure,
        question,
      });

      await newSolve.save();

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  checkSolveQuestion = async (req, res) => {
    const { quesId, datastructureId } = req.body;
    const userId = req.user._id;
    let result = false;

    try {
      const isSolve = await Solved.findOne({
        $and: [
          { question: quesId },
          { datastructure: datastructureId },
          { user: userId },
        ],
      }).lean();

      if (isSolve != null) {
        result = true;
      }

      res.status(200).json({
        status: "ok",
        result,
        solutionId: isSolve?._id,
        answer: isSolve?.answer,
      });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };

  saveCode = async (req, res) => {
    const { answer, solutionId, question, datastructure } = req.body;
    const user = req.user._id;

    try {
      if (solutionId === "") {
        const newSolve = new Solved({
          user,
          datastructure,
          question,
          answer,
        });

        await newSolve.save();
      } else {
        const update = await Solved.updateOne(
          { _id: solutionId },
          {
            $set: {
              answer,
            },
          }
        );
      }

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(200).json({ status: "error" });
    }
  };
}

module.exports = DataStructureController;
