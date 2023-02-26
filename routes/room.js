const express = require("express");
const {
  createQuiz,
  addQUestionToQuizByROomID,
} = require("../controllers/Quiz/quiz");
const { joinRoom } = require("../controllers/Room/room");
const { addTopicToRoom, summaryOfRoom } = require("../controllers/Room/topics");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

router.route("/:id").patch(verifyToken, joinRoom);

router
  .route("/:id/topics")
  .get(summaryOfRoom)
  .patch(verifyToken, addTopicToRoom);

router.route("/:id/quiz").post(verifyToken, createQuiz);

module.exports = router;
