const express = require("express");
const {
  createTeacherAccount,
  loginForTeacher,
  createRoom,
  getTeacherRooms,
  getTeacherQuizzes,
} = require("../controllers/Teacher/teacher");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(createTeacherAccount);

router.route("/login").post(loginForTeacher);

router.route("/room").post(verifyToken, createRoom);

router.route("/:teacher_id/rooms").get(getTeacherRooms);

router.route("/:teacher_id/quizzes").get(getTeacherQuizzes);

module.exports = router;
