const Student = require("../../models/student");
const Room = require("../../models/room");

const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");

const createStudentAccount = catchAsyncErrors(async (req, res) => {
  const body = req.body;

  const student = new Student(body);
  await student.save();
  const token = student.generateJWT();

  if (!student) {
    res
      .status(400)
      .json({ success: false, message: "student could not be created" });
  }
  res.status(201).json({
    success: true,
    message: "student created",
    data: { student: student, tokem: token },
  });
});

const loginForStudent = catchAsyncErrors(async (req, res) => {
  const { emailID, password } = req.body;
  const student = await Student.findOne({ emailID });
  if (!student) {
    return res.status(401).json({ success: false, message: "Login failed" });
  }
  const isMatch = await student.comparePassword(password);
  if (!isMatch) {
    return res.status(401).send({ success: false, message: "Login failed" });
  }
  const token = student.generateJWT();
  res.status(201).json({
    success: true,
    message: "Login successfully",
    data: { student: student, tokem: token },
  });
});

const getRoomsJoinedByStud = catchAsyncErrors(async (req, res) => {
  const studentID = req.userId;

  const rooms = await Room.find({ members: { $in: [studentID] } }).sort(
    "-createdAt"
  );

  if (!rooms) {
    return res
      .status(401)
      .json({ success: false, message: "Failed to find any rooms" });
  }
  res.status(201).json({
    success: true,
    message: "found the rooms",
    data: JSON.stringify(rooms),
    count: rooms.length,
  });
});

module.exports = {
  createStudentAccount,
  loginForStudent,
  getRoomsJoinedByStud,
};
