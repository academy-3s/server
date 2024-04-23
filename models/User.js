const mongoose = require("mongoose");
const valid = require("validator");
const Schema = mongoose.Schema;

// Subdocument schema for actual completed courses
const actualCompletedCoursesSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  score: String,
  certiNo: String,
  date: String,
}, { timestamps: true });

// Subdocument schema for individual completed mocktests in a course
const mockTestIndividualTestSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  module: Number,
  score: String,
}, { timestamps: true });

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    validate: {
      validator: (v) => {
        return valid.isEmail(v);
      },
      message: "{VALUE} is not a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  organisationName: {
    type: String,
    required: true,
  },
  desgination: {
    type: String,
    required: true,
  },
  locationOrCountry: {
    type: String,
    required: true,
  },
  membershipNo: {
    type: String,
    required: false
  },
  enrolledCourses: [{
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  }],
  profileImage: {
    type: String, // Store the image path or URL
  },
  resetPasswordOTP: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  completedCourses: [{
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    completedChapters: [{
      type: String,
      required: false,
    }],
    completedModules: [{
      type: String,
      required: false,
    }],
  }],
  mockTestCompleted: [mockTestIndividualTestSchema],
  actualCompletedCourses: [actualCompletedCoursesSchema],

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
