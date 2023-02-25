const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  title: {
    type: String,
    default: null,
    trim: true,
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "Teacher",
    required: true,
  },
  members: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Student",
      },
    ],
    default: [],
  },
  topics: {
    type: [String],
    default: [],
  },
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: "Quiz",
    default: null,
  },
  analysis: {
    type: [
      {
        student: { type: mongoose.Schema.ObjectId, ref: "Student" },
        score: Number,
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", roomSchema);
