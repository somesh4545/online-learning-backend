const Room = require("../../models/room");

const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");

const joinRoom = catchAsyncErrors(async (req, res) => {
  const { id: roomID } = req.params;
  const studentID = req.userId;

  const updatedRoom = await Room.findOneAndUpdate(
    { _id: roomID },
    {
      $addToSet: { members: studentID },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedRoom) {
    return res
      .status(401)
      .send({ success: false, message: "failed to update" });
  }
  return res
    .status(201)
    .send({ success: true, message: "added member to the room" });
});

const getSpecificRoom = catchAsyncErrors(async (req, res) => {
  const { id: roomID } = req.params;

  const room = await Room.findOne({ _id: roomID })
    .populate({
      path: "members",
      model: "Student",
      select: "emailID firstName _id",
    })
    .populate({
      path: "creator",
      model: "Teacher",
      select: "emailID firstName _id",
    });

  if (!room) {
    return res
      .status(401)
      .send({ success: false, message: "failed to find room" });
  }
  return res.status(201).send({
    success: true,
    message: "found room. to view json data use json.parse()",
    data: JSON.stringify(room),
  });
});

module.exports = {
  joinRoom,
  getSpecificRoom,
};
