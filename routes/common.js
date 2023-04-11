const express = require("express");
const verifyToken = require("../middlewares/auth");
const { newRegistration, createNewClg } = require("../controllers/common");

const router = express.Router();

router.route("/new-registration").get(newRegistration);

router.route("/create-new-clg").post(createNewClg);

module.exports = router;
