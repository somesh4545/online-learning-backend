const express = require("express");
const app = express();
const cors = require("cors");

const errorMiddleware = require("./middlewares/error");

const test = require("./routes/test");
const teacherRouter = require("./routes/teacher");
const studentRouter = require("./routes/student");
const roomRouter = require("./routes/room");
const quizRouter = require("./routes/quiz");

const connectToDB = require("./db/connect");
require("dotenv").config();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/test", test);

// teacher router
app.use("/api/v1/teacher", teacherRouter);

// room router
app.use("/api/v1/student", studentRouter);

// student router
app.use("/api/v1/room", roomRouter);

// quiz router
app.use("/api/v1/quiz", quizRouter);

const port_no = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectToDB(process.env.MONGO_URI);
    app.listen(port_no, () => {
      console.log(`listening on port ${port_no}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
app.use(errorMiddleware);
