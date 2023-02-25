const express = require("express");
const {
  createStudentAccount,
  loginForStudent,
} = require("../controllers/Student/student");

const router = express.Router();

router.route("/register").post(createStudentAccount);

router.route("/login").post(loginForStudent);

module.exports = router;
