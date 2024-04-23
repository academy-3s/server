// controllers/orderController.js
const Order = require('../models/order');
const User = require('../models/User');

const createOrder = async (data) => {
    try {
        // const {
        //     userId,
        //     courses_id,
        //     orderId,
        //     totalCartValue,
        //     payment_type,
        //     billing_name,
        //     billing_email,
        //     billing_phone,
        //     billing_address,
        //     billing_zip,
        //     billing_city,
        //     billing_state,
        //     billing_country,
        // } = req.body;

        // Create a new order instance
        const newOrder = new Order(data);

        // Save the new order to the database
        const savedOrder = await newOrder.save();

        // res.status(201).json({ message: "order created successfully" });
        return { status: true, orderId: savedOrder._id }
    } catch (error) {
        console.error('Error creating order:', error);
        // res.status(500).json({ message: 'Server error' });
        return false
    }
};

const getAllOrders = async (req, res) => {
    try {
        const allOrders = await Order.find({})
            .populate('user', 'name phone email')
            .populate('courses', 'title')
        res.status(200).json({ message: "got all orders successfully", orders: allOrders })
    } catch (e) {
        console.log("error in getAllOrders", e)
        res.status(500).json({ message: "internal server error" })
    }
}

const getEnrolledUsersCountByCourse = async (req, res) => {
    try {
        const result = await User.aggregate([
            {
                $unwind: '$enrolledCourses',
            },
            {
                $group: {
                    _id: '$enrolledCourses.courseId',
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'courses', // Collection name for the courses model
                    localField: '_id',
                    foreignField: '_id',
                    as: 'courseDetails',
                },
            },
            {
                $unwind: '$courseDetails',
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    courseTitle: '$courseDetails.title',
                },
            },
        ]);

        // result will contain an array of objects with _id as courseId and count as the enrolled users count
        console.log('Enrolled Users Count by Course:', result);
        res.status(200).json({ message: "got each course's user count", data: result })
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "internal server error" })
    }
};

const getTotalQualifiedUsers = async (req, res) => {
    try {
        // Find users where actualCompletedCourses array length is not equal to 0
        const qualifiedUsersCount = await User.countDocuments({
            actualCompletedCourses: { $exists: true, $ne: [] }
        });

        console.log("Total qualified users:", qualifiedUsersCount);
        res.status(200).json({ message: "got total qualified users", count: qualifiedUsersCount })
        return qualifiedUsersCount;
    } catch (error) {
        console.error("Error fetching qualified users:", error);
        res.status(500).json({ message: "Internal server error" })
    }
};

module.exports = { createOrder, getAllOrders, getEnrolledUsersCountByCourse, getTotalQualifiedUsers };
