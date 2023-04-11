const Clg = require("../models/clg");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const newRegistration = catchAsyncErrors(async (req, res) => {
  const data = await Clg.find({}).select("name classrooms");

  if (!data) {
    return res
      .status(400)
      .json({ success: false, message: "No colleges found" });
  }

  res.status(201).json({ success: true, message: "clgs found", data: data });
});

const createNewClg = catchAsyncErrors(async (req, res) => {
  const data = req.body;

  const newClg = new Clg(data);
  await newClg.save();

  if (!newClg) {
    return res
      .status(400)
      .json({ success: false, message: "No college createc" });
  }

  res
    .status(201)
    .json({ success: true, message: "clgs created", data: newClg });
});

module.exports = {
  newRegistration,
  createNewClg,
};
