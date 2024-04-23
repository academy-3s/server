const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: false,
  },
  options: {
    type: [String],
    required: true,
  },
  module: {
    type: Number,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: false,
  },
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
