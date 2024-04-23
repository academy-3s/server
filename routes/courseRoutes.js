const express = require("express");
const multer = require("multer");
const {
  addCourse,
  editCourse,
  deleteCourse,
  getAllCourses,
  enrollInCourseRoute, // Import the enrollInCourse function
  getCourseById,
  deleteACourseFromAUser
} = require("../controllers/courseController");

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const fileName = `${file.fieldname}-${Date.now()}.${ext}`;
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Enroll in courses (Should be placed before other course-related routes)
router.post("/:userId/enroll", enrollInCourseRoute); // Use enrollInCourse as the callback

router.post("/", upload.single("image"), addCourse);
router.put("/:id", upload.single("image"), editCourse);
router.delete("/:id", deleteCourse);
router.get("/", getAllCourses);

router.put("/delete-course-from-user/:userId/:courseId", deleteACourseFromAUser)

// Get course details by ID
router.get("/:id", getCourseById);

module.exports = router;
