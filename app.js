const express = require("express");
const app = express();
const cors = require("cors");

const errorMiddleware = require("./middlewares/error");

const test = require("./routes/test");

const connectToDB = require("./db/connect");
require("dotenv").config();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/test", test);

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
