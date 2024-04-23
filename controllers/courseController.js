const Course = require("../models/Course");
const User = require("../models/User");
const Order = require("../models/order");
const multer = require("multer");

// Multer configuration
const upload = multer({ dest: "uploads/" });

const addCourse = async (req, res) => {
  const { title, description, category1, category2, NumberOfModule, price, originalPrice, DiscountPercentage } = req.body;
  const image = req.file.originalname;

  try {
    const course = await Course.create({ title, description, category1, category2, NumberOfModule, price, originalPrice, DiscountPercentage, image });
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, category1, category2, NumberOfModule, price, originalPrice, DiscountPercentage } = req.body;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (title) course.title = title;
    if (description) course.description = description;
    if (category1) course.category1 = category1;
    if (category2) course.category2 = category2;
    if (NumberOfModule) course.NumberOfModule = NumberOfModule;
    if (price) course.price = price;
    if (originalPrice) course.originalPrice = originalPrice;
    if (DiscountPercentage) course.DiscountPercentage = DiscountPercentage;


    if (req.file) {
      course.image = req.file.originalname;
    }

    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const enrollInCourse = async (userId, courseIds, orderId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return false;
    }

    if (courseIds && Array.isArray(courseIds)) {
      // If an array of courseIds is provided, enroll the user in multiple courses
      for (const courseId of courseIds) {
        const course = await Course.findById(courseId);
        if (!course) {
          return false;
        }
        user.enrolledCourses.push({ courseId, orderId });
      }
    } else {
      return false;
    }
    await user.save();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const enrollInCourseRoute = async (req, res) => {
  const { userId } = req.params;
  let { courseId, courseIds, orderId, comingFrom } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (courseId) {
      // If single courseId is provided, enroll the user in the course
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      user.enrolledCourses.push({ courseId, orderId });
    } else if (courseIds && Array.isArray(courseIds)) {
      // If an array of courseIds is provided, enroll the user in multiple courses
      if (comingFrom === "admin") {
        function generateRandomNumber() {
          var randomNumber = '';
          for (var i = 0; i < 7; i++) {
            randomNumber += Math.floor(Math.random() * 10);
          }
          return parseInt(randomNumber);
        }

        let course = await Course.findById(courseIds[0])
        let coursePrice = course.price.toString()
        const newOrder = new Order({
          user: userId,
          courses: courseIds,
          orderId: generateRandomNumber(),
          totalCartValue: coursePrice,
          payment_type: "admin",
          billing_name: user.name,
          billing_email: user.email,
          billing_phone: user.phone,
          billing_address: "dummy order address",
          billing_zip: "dummy order zip",
          billing_city: "dummy order city",
          billing_state: "dummy order state",
          billing_country: user.locationOrCountry,
        });

        // Save the new order to the database
        const order = await newOrder.save();
        orderId = order._id;
      }
      for (const courseId of courseIds) {
        const course = await Course.findById(courseId);
        if (!course) {
          return res.status(404).json({ message: `Course with ID ${courseId} not found` });
        }
        user.enrolledCourses.push({ courseId, orderId });
      }
    } else {
      return res.status(400).json({ message: "Invalid request body" });
    }

    await user.save();
    res.json({ message: "Enrolled in the course(s) successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteACourseFromAUser = async (req, res) => {
  const { userId, courseId } = req.params
  try {
    const user = await User.findById(userId)
    const newEnrolledCourses = user.enrolledCourses.filter(course => course.courseId.toString() !== courseId);
    const newCompletedChapters = user.completedCourses.filter(course => course.courseId.toString() !== courseId);
    const newMockTestCompleted = user.mockTestCompleted.filter(course => course.courseId.toString() !== courseId);
    const newActualCompletedCourses = user.actualCompletedCourses.filter(course => course.courseId.toString() !== courseId);
    user.enrolledCourses = newEnrolledCourses
    user.completedChapters = newCompletedChapters
    user.mockTestCompleted = newMockTestCompleted
    user.actualCompletedCourses = newActualCompletedCourses
    await user.save()
    res.status(200).json({ message: "Deleted the user from the course(s) successfully" });
  } catch (e) {
    console.log("error in deleteACourseFromUser", e)
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  addCourse,
  editCourse,
  deleteCourse,
  getAllCourses,
  enrollInCourse,
  getCourseById,
  enrollInCourseRoute,
  deleteACourseFromAUser
};