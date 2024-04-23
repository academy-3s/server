// const mongoose = require('mongoose');

// const documentSchema = new mongoose.Schema({
//   chapterName: String,
//   courseName: String,
//   moduleIndex: Number,
//   chapterIndex: Number,
//   filePath: String,
//   //isRead: { type: Boolean, default: false } // New field for tracking read status

// });

// const Document = mongoose.model('Document', documentSchema);

// module.exports = Document;



const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  chapterName: {
    type: String,
    required: true,
  },
  moduleIndex: {
    type: Number,
    required: true,
  },
  chapterIndex: {
    type: Number,
    required: false,
  },
  filePath: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference to the 'Course' model
    required: true,
  },
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
