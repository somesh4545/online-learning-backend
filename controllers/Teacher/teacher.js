const Teacher = require("../../models/teacher");
const Room = require("../../models/room");
const QUiz = require("../../models/quiz");

const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const auth = require("../../middlewares/auth");

const createTeacherAccount = catchAsyncErrors(async (req, res) => {
  const body = req.body;

  const teacher = new Teacher(body);
  await teacher.save();
  const token = teacher.generateJWT();

  if (!teacher) {
    res
      .status(400)
      .json({ success: false, message: "Teacher could not be created" });
  }
  res.status(201).json({
    success: true,
    message: "Teacher created",
    data: { teacher: teacher, tokem: token },
  });
});

const loginForTeacher = catchAsyncErrors(async (req, res) => {
  const { emailID, password } = req.body;
  const teacher = await Teacher.findOne({ emailID });
  if (!teacher) {
    return res.status(401).json({ success: false, message: "Login failed" });
  }
  const isMatch = await teacher.comparePassword(password);
  if (!isMatch) {
    return res.status(401).send({ success: false, message: "Login failed" });
  }
  const token = teacher.generateJWT();
  res.status(201).json({
    success: true,
    message: "Login successfully",
    data: { teacher: teacher, tokem: token },
  });
});

const createRoom = catchAsyncErrors(async (req, res) => {
  const teacherID = req.userId;
  const data = {
    creator: teacherID,
  };
  if (req.body && req.body.title) {
    data.title = req.body.title;
  } else {
    return res
      .status(401)
      .send({ success: false, message: "Missing parameters" });
  }

  const newRoom = await Room.create(data);

  if (!newRoom) {
    return res
      .status(401)
      .send({ success: false, message: "Failed to create room" });
  }
  const quizData = {
    creator: teacherID,
    room: newRoom._id,
    title: req.body.title,
  };

  const newQuiz = await QUiz.create(quizData);

  if (!newQuiz) {
    return res
      .status(401)
      .send({ success: false, message: "Failed to create quiz" });
  }

  const updatedRoom = await Room.findOneAndUpdate(
    { _id: newRoom._id },
    { quiz: newQuiz._id },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    success: true,
    message: "Room created successfully with quiz instance",
    data: updatedRoom,
  });
});

module.exports = {
  createTeacherAccount,
  loginForTeacher,
  createRoom,
};
