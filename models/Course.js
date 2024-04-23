const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category1: { type: String, required: true },
  category2: { type: String, required: true },
  NumberOfModule: { type: Number, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: false },
  DiscountPercentage: { type: Number, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;

// const mongoose = require("mongoose");

// const courseSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   category1: { type: String, required: true },
//   category2: { type: String, required: true },
//   NumberOfModule: { type: Number, required: true },
//   price: { type: Number, required: true },
//   originalPrice: { type: Number, required: true },
//   image: { type: String, required: true },
// });

// const Course = mongoose.model("Course", courseSchema);

// module.exports = Course;
