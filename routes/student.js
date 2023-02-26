const express = require("express");
const {
  createStudentAccount,
  loginForStudent,
  getRoomsJoinedByStud,
} = require("../controllers/Student/student");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(createStudentAccount);

router.route("/login").post(loginForStudent);

router.route("/rooms").get(verifyToken, getRoomsJoinedByStud);

module.exports = router;
