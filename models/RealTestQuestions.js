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
    required: true,
  },

}, { timestamps: true });

const RealTestQuestions = mongoose.model('RealTestQuestions', questionSchema);

module.exports = RealTestQuestions;
