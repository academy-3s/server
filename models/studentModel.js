const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // name: String,
  // email: String,
  // phone: String,
  // membershipNo: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  score: String,
  status: { type: String, default: "active" }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
