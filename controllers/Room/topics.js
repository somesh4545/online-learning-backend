const Teacher = require("../../models/teacher");
const Room = require("../../models/room");

const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");

const summaryOfRoom = catchAsyncErrors(async (req, res) => {
  const { id: roomID } = req.params;
  const room = await Room.find({ _id: roomID })
    .populate({
      path: "creator",
      select: "_id emailID firstName",
    })
    .select("creator topics quiz");
  if (!room) {
    return res
      .status(401)
      .send({ success: false, message: "failed to find room" });
  }
  return res.status(200).send({
    success: true,
    message: "found the topics covered in session",
    data: room,
  });
});

const addTopicToRoom = catchAsyncErrors(async (req, res) => {
  const teacherID = req.userId;
  const { id: roomID } = req.params;
  const topic = req.body.topic;
  if (topic == null) {
    return res.status(401).send({ success: false, message: "Invalid request" });
  }

  const updatedRoom = await Room.findOneAndUpdate(
    { _id: roomID, creator: teacherID },
    {
      $push: { topics: topic },
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
    .send({ success: true, message: "added topic to the room" });
});

module.exports = {
  addTopicToRoom,
  summaryOfRoom,
};
