const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profileImages/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Register a new user
router.post("/register", userController.registerUser);

// Login
router.post("/login", userController.loginUser);

// Get enrolled courses for a user
router.get("/:userId/enrolled-courses", userController.getEnrolledCourses);

// Get user progress (completed chapters and modules for enrolled courses)
router.get("/:userId/progress", userController.getUserProgress);

// Update user progress for a specific course, chapter, and module
router.put("/:userId/progress", userController.updateUserProgress);

// Forgot password
router.post("/forgot-password", userController.forgotPassword);

// Verify OTP for password reset
router.post("/verify-otp", userController.verifyOTP);

// Reset password
router.post("/reset-password", userController.resetPassword);

router.get("/all", userController.getAllUsers);
router.get("/registeredUserCount", userController.countRegisteredUser)
router.post("/check-membership-code", userController.applyMembership);
router.get("/get-registered-users", userController.getAllRegisteredUsers);
router.delete("/delete-user/:id", userController.deleteUser);
router.post("/enrolledCoursesWithDetails", userController.enrolledCoursesWithDetails)
router.put("/update-user-completed-courses/:userId/:courseId", userController.updateUsersCompletedCourses)
router.put("/update-user-completed-mocktest/:userId/:courseId/:module", userController.updateUsersCompletedMockTest)
router.get("/send-enrolled-courses/:userId", userController.sendEnrolledCourses)

router.get("/enrolled", userController.getUsersWithEnrolledCourses);

router.put("/:userId/update-profile", upload.single("profileImage"), userController.updateUserProfile);

router.get("/:userId", userController.getUserById);



module.exports = router;
