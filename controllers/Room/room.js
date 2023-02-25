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

module.exports = {
  joinRoom,
};
