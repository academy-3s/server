const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const contactController = require('./certificateContactController');
const certificateController = require('./certificateController')

// Require models folder
const User = require("../models/User");
const Course = require("../models/Course");
const path = require("path");

// Registration
const registerUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    }

    const { name, phone, email, organisationName, desgination, locationOrCountry } = req.body;

    // for generating membership number
    const defaultNo = 1560
    const userCount = await User.countDocuments({})
    const membershipNo = defaultNo + userCount + 1 + ""

    let user = new User({
      name,
      phone,
      email,
      password: hash,
      organisationName, desgination, locationOrCountry,
      membershipNo,
      // completedChapters: {},
      // completedModules: {},
      completedChapters: [], // Initialize with an empty array
      completedModules: [], // Initialize with an empty array
    });

    user
      .save()
      .then(async (result) => {
        // const membershipCode = result._id.toString().slice(0, 7)
        // await certificateController.generatePDFForSignUp(name, membershipCode)
        // generate certificate
        await certificateController.generatePDFForSignUp(name, membershipNo)
        // send mail on first signup
        contactController.sendOnFirstTimeSignup(name, email);
        res.status(201).json({
          message: "User created successfully",
          user: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Email already exists",
          error: err,
        });
      });
  });
};


const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .populate('enrolledCourses') // Populate the enrolledCourses field with course details
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            res.status(500).json({
              message: 'Error occurred',
              error: err,
            });
          }
          if (result) {
            // Password matches, send user details along with enrolled courses
            const { _id, name, phone, email, enrolledCourses } = user;
            res.status(200).json({
              message: 'Login successful',
              user: {
                _id,
                name,
                phone,
                email,
                enrolledCourses, // Enrolled courses now include their details (id, title, description, price, image)
              },
            });
          } else {
            res.status(401).json({
              message: "Login failed. Password doesn't match",
            });
          }
        });
      } else {
        res.status(404).json({
          message: 'User not found',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Error occurred',
        error: err,
      });
    });
};

const getEnrolledCourses = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID and populate the enrolledCourses field to get course details
    const user = await User.findById(userId).populate("enrolledCourses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Enrolled courses retrieved successfully",
      enrolledCourses: user.enrolledCourses,
    });
  } catch (err) {
    res.status(500).json({ message: "Error occurred", error: err });
  }
};

const enrollInCourse = async (req, res, next) => {
  const userId = req.params.userId;
  const courseIds = req.body.courseIds; // Array of course IDs

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find courses with the provided course IDs
    const courses = await Course.find({ _id: { $in: courseIds } });
    if (courses.length !== courseIds.length) {
      return res.status(404).json({ message: "One or more courses not found" });
    }

    // Add the enrolled courses to the user's enrolledCourses array
    user.enrolledCourses.push(...courseIds);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Courses enrolled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error occurred", error: err });
  }
};



const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the OTP and its expiration time to the user document
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 600000; // OTP expires after 10 minutes
    await user.save();
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.Password,
      },
    });

    // Define the email message
    const mailOptions = {
      from: "support@academy3s.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your 6-digit password reset OTP is ${otp}.`,
    };

    // Send the email with the OTP
    await transporter.sendMail(mailOptions);


    res.json({ message: 'OTP sent to your email address' });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }, // Check if OTP is not expired
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid OTP or email" });
    }

    // Attach the user object to the request
    req.user = user;
    res.status(200).json({ message: "OTP verified successfully" });
    // Move to the next middleware
    next();
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check if the user exists in the database based on the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetPasswordOTP || !user.resetPasswordExpires) {
      return res.status(400).json({ message: "OTP verification not completed" });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    // Hash the new password before saving it
    bcrypt.hash(newPassword, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({ message: "Error occurred while hashing password" });
      }

      try {
        // Update the user's password and clear the resetPasswordOTP and resetPasswordExpires fields
        user.password = hash;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;

        // Save the updated user document
        await user.save();

        // Move the response here to ensure it is sent only once
        res.json({ message: "Password reset successful. You can now log in with the new password." });
      } catch (error) {
        // console.log(error);
        res.status(500).json({ message: "Error occurred while saving the user" });
      }
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getUsersWithEnrolledCourses = async (req, res) => {
  try {
    const users = await User.find({ enrolledCourses: { $exists: true, $not: { $size: 0 } } }, '-password')
      .populate('enrolledCourses.courseId', 'title description price image') // Populate enrolledCourses with course details
      .populate('enrolledCourses.orderId', 'orderId createdAt billing_state billing_city billing_address payment_type totalCartValue');

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUserProfile = (req, res, next) => {
  const userId = req.params.userId;
  const { name, phone } = req.body;

  let updateData = { name, phone };

  // Check if an image file is present in the request
  if (req.file) {
    const imagePath = req.file.path;
    updateData.profileImage = imagePath;
  }

  User.findByIdAndUpdate(userId, updateData, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        message: "User profile updated successfully",
        user: updatedUser,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error occurred", error: err });
    });
};

// Get user data by userId
const getUserById = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId)
      .select("-password") // Exclude the password field from the response
      .populate("enrolledCourses.courseId", "title description price image");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User data retrieved successfully",
      user: user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error occurred", error: err });
  }
};



const updateUserProgress = async (req, res, next) => {
  const userId = req.params.userId;
  const { courseId, completedChapters, completedModules } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure courseId and completedChapters are provided in the request
    if (!courseId || !completedChapters) {
      return res
        .status(400)
        .json({ message: "courseId and completedChapters are required" });
    }

    // Find the course index in completedCourses array
    const courseIndex = user.completedCourses.findIndex(
      (item) => item.courseId && item.courseId.toString() === courseId
    );

    // Update completedChapters and completedModules for the course
    if (courseIndex === -1) {
      // If the course is not found in the array, add a new entry
      user.completedCourses.push({
        courseId,
        completedChapters: [completedChapters], // Create a new array with the latest completed chapter
      });
    } else {
      // If the course is found, append the completed chapter and module to the existing arrays
      user.completedCourses[courseIndex].completedChapters.push(completedChapters);
      if (completedModules) {
        user.completedCourses[courseIndex].completedModules.push(completedModules);
      }

    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User progress updated successfully" });
  } catch (err) {
    // If an error occurs, log the error for debugging
    console.error(err);
    res.status(500).json({ message: "Error occurred", error: err.message });
  }
};



const getUserProgress = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID and populate the enrolledCourses field to get course details
    const user = await User.findById(userId).populate('enrolledCourses.courseId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract the relevant information from the user object
    const { _id, name, phone, email, enrolledCourses, completedCourses, membershipNo } = user;

    res.status(200).json({
      message: 'User progress retrieved successfully',
      user: {
        _id,
        name,
        phone,
        email,
        enrolledCourses, // Enrolled courses now include their details (id, title, description, price, image)
        completedCourses, // Completed chapters and modules for each course
        membershipNo
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error occurred', error: err });
  }
};

const countRegisteredUser = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments({})
    // console.log("userCount", userCount)
    res.status(200).json({ message: "Successful user count", count: userCount })
  } catch (err) {
    console.log("error in countRegisteredUser", err)
    res.status(500).json({ message: 'Error occurred', error: err });
  }
}

const applyMembership = async (req, res, next) => {
  try {
    const { userEnteredCode, userId } = req.body
    const user = await User.findById(userId);
    // console.log("userEnteredCode", userEnteredCode, typeof userEnteredCode)
    // console.log("userId.slice(0, 6)", userId.slice(0, 6), typeof userId.slice(0, 6))
    if (userEnteredCode === user.membershipNo) {
      if (user.enrolledCourses.length === 0) {
        res.status(200).json({ message: "Eligible for discount" })
      } else {
        res.status(404).json({ message: "Membership code used early" })
      }
    } else {
      res.status(404).json({ message: 'Membership code is invalid' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Error occurred', error: err });
  }
}

const getAllRegisteredUsers = async (req, res) => {
  try {
    const users = await User.find({ enrolledCourses: { $exists: true, $size: 0 } }, '-password');
    // console.log("users length", users.length)
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', err: error });
  }
};

const deleteUser = async (req, res, next) => {
  // console.log("req.body deleteUser", req.body)
  // console.log("req.body deleteUser", req.params)
  // const { userId } = req.body
  // console.log("user id", userId, typeof userId)
  // objectUserId = mongoose.Types.ObjectId(userId)
  // console.log("object id userId", objectUserId, typeof objectUserId)
  const id = req.params.id
  try {
    // const deleteResult = await User.deleteOne({ _id: objectUserId });
    const deleteResult = await User.findByIdAndRemove(id);
    // console.log("user deleted", deleteResult)
    res.status(200).json({ message: "user deleted" })
  } catch (err) {
    res.status(500).json({ message: 'Error occurred', error: err });
  }
}

const enrolledCoursesWithDetails = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId) // got user here
    let { password, membershipNo, enrolledCourses, completedCourses, profileImage, __v, updatedAt, actualCompletedCourses, ...userWithoutAdditionalDetails } = user._doc;
    // getting enrolled courses with details
    enrolledCourses = enrolledCourses.map(course => course.courseId.toString())
    const enrolledCoursesWithDetails = await Promise.all(enrolledCourses.map(async courseId => await Course.findById(courseId)));
    // filtering completed and in progress courses from enrolled courses
    const coursesWithDetails = enrolledCoursesWithDetails.map(enrolledCourse => {
      enrolledCourse = enrolledCourse.toObject()
      const completedCourse = actualCompletedCourses.find(course => course.courseId.toString() === enrolledCourse._id.toString())
      const moduleCourse = completedCourses.find(course => course.courseId.toString() === enrolledCourse._id.toString());
      if (completedCourse) {
        let date = completedCourse.date ? completedCourse.date : completedCourse.createdAt
        return {
          ...enrolledCourse,
          status: "completed",
          score: completedCourse.score === "admin generated" ? "admin generated" : completedCourse.score,
          certiNo: completedCourse.certiNo,
          date
        };
      } else if (moduleCourse) {
        return {
          ...enrolledCourse,
          status: "inProgress",
          modulesCompleted: moduleCourse.completedModules.length !== 0 ? moduleCourse.completedModules.length : 0
        };
      } else {
        return {
          ...enrolledCourse,
          status: "enroll",
        };
      }
    });
    delete user.password;
    res.status(200).json({ message: "data processed successfully", user: userWithoutAdditionalDetails, coursesWithDetails })
  } catch (error) {
    // Handle errors appropriately
    console.log('Error in enrolledCoursesWithCompletedCoursesStamp', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateUsersCompletedCourses = async (req, res, next) => {
  const { userId, courseId } = req.params
  const { score, certiNo, date } = req.body

  let objectToPass
  if (date) {
    objectToPass = { courseId, score, certiNo, date }
  } else {
    objectToPass = { courseId, score, certiNo }
  }

  try {
    const user = await User.findById(userId)
    if (user.actualCompletedCourses) {
      user.actualCompletedCourses.push(objectToPass)
    } else {
      user.actualCompletedCourses = [objectToPass]
    }
    const updatedUser = await user.save();
    res.status(200).json({ message: "user updated successfully" })
  } catch (e) {
    console.log("error in updating users completed course", e)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const updateUsersCompletedMockTest = async (req, res, next) => {
  const { userId, courseId, module } = req.params;
  const { score } = req.body;

  try {
    const user = await User.findById(userId);
    const moduleInNumber = parseInt(module)
    if (user.mockTestCompleted) {
      user.mockTestCompleted.push({ courseId, module: moduleInNumber, score });
    } else {
      user.mockTestCompleted = [{ courseId, module: moduleInNumber, score }]
    }

    const updatedUser = await user.save();
    res.status(200).json({ message: "user updated successfully" });
  } catch (e) {
    console.log("error in updating users completed course", e);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const sendEnrolledCourses = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    const courses = user.enrolledCourses.map(course => course.courseId)
    res.status(200).json({ message: "sent courses successfully", courses });
  } catch (e) {
    console.log("error in sending courses", e);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getEnrolledCourses,
  enrollInCourse,
  getUserProgress,
  updateUserProgress,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getAllUsers,
  getUsersWithEnrolledCourses,
  updateUserProfile,
  getUserById,
  countRegisteredUser,
  applyMembership,
  getAllRegisteredUsers,
  deleteUser,
  enrolledCoursesWithDetails,
  updateUsersCompletedCourses,
  updateUsersCompletedMockTest,
  sendEnrolledCourses
};