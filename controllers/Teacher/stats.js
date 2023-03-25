const Teacher = require("../../models/teacher");
const Room = require("../../models/room");
const QUiz = require("../../models/quiz");

const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");

// get count of students joined the room stats
const getCountOfStudents = catchAsyncErrors(async (req, res) => {
  const teacherID = req.userId;

  const recentRooms = await Room.find({ creator: teacherID })
    .sort("-createdAt")
    .select("title members date")
    .limit(10);

  const roomsWithMembersCount = recentRooms.map((room) => {
    const membersCount = room.members.length;
    return {
      _id: room._id,
      title: room.title,
      membersCount: membersCount,
      date: room.date,
    };
  });

  if (!roomsWithMembersCount) {
    return res.status(401).send({ success: false, message: "No data found" });
  }

  res.status(200).json({
    success: true,
    message:
      "Status to get all the recent rooms created by teacher with count of members in it",
    data: JSON.stringify(roomsWithMembersCount),
  });
});

// get session attentivness of all studnets
const getAvgAttentionOfStudents = catchAsyncErrors(async (req, res) => {
  const teacherID = req.userId;

  const recentRooms = await Room.find({ creator: teacherID })
    .sort("-createdAt")
    .select("title analysis date")
    .limit(10);

  const roomsWithAvgAttention = recentRooms.map((room) => {
    const attentions = room.analysis.map(
      (data) =>
        data.attention.reduce((a, b) => a + b, 0) / data.attention.length
    );
    const avgAttention =
      attentions.reduce((a, b) => a + b, 0) / attentions.length;
    return {
      _id: room._id,

      title: room.title,
      avgAttention: avgAttention,
      date: room.date,
    };
  });

  if (!roomsWithAvgAttention) {
    return res.status(401).send({ success: false, message: "No data found" });
  }

  res.status(200).json({
    success: true,
    message:
      "Status to get all the recent rooms created by teacher with count of members in it",
    data: roomsWithAvgAttention,
  });
});

module.exports = {
  getCountOfStudents,
  getAvgAttentionOfStudents,
};
