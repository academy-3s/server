const User = require("../models/User");

const checkPurchasedCourse = async (req, res, next) => {
    const { userId, fromAdmin } = req.body
    const { courseId } = req.params
    try {
        // if user has enrolled in that course, go to next
        const user = await User.findById(userId);
        const enrolledCourses = user?.enrolledCourses;

        let isEnrolled = false;

        if (enrolledCourses) {
            for (const course of enrolledCourses) {
                if (course.courseId.toString() === courseId) {
                    isEnrolled = true;
                    break; // exit the loop if the course is found
                }
            }
        }

        if (isEnrolled) {
            next();
        } else if (fromAdmin === "truthy") {
            next()
        } else {
            // else send error that user has not enrolled for this course
            res.status(404).json({ message: "user does not have access to this api" });
        }
    } catch (e) {
        console.log("error in checkPurchasedCourse middleware", e)
        res.status(500).json({ message: "internal server error" })
    }
}

const checkIsAdmin = async (req, res, next) => {
    // if user ID's email equals to admin@academy3s.com, then can access
    // else error permission denied to access the api
    let userId
    if (req.params.userId) {
        userId = req.params.userId
    } else {
        userId = req.body.userId
    }
    try {
        const user = await User.findById(userId);
        if (user.email === "admin@academy3s.com") {
            next()
        } else {
            res.status(404).json({ message: "user don't have permission to access this api" });
        }
    } catch (e) {
        console.log("error in checkIsAdmin middleware", e)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {
    checkPurchasedCourse, checkIsAdmin
}