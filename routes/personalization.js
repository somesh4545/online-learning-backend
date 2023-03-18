const express = require("express");
const {
  personalizationForStudent,
  guidanceForTeacher,
} = require("../controllers/personalization/personalization");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

router.route("/student").get(verifyToken, personalizationForStudent);

router.route("/teacher").get(verifyToken, guidanceForTeacher);

module.exports = router;
