const express = require("express");
const {
  createTeacherAccount,
  loginForTeacher,
  createRoom,
} = require("../controllers/Teacher/teacher");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(createTeacherAccount);

router.route("/login").post(loginForTeacher);

router.route("/room").post(verifyToken, createRoom);

module.exports = router;
