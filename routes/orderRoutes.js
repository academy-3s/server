// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET route for getting all orders
router.get('/', orderController.getAllOrders);

// GET route for getting users count according to course
router.get('/enrolled-users-according-to-course', orderController.getEnrolledUsersCountByCourse);

// GET route for total qualified users
router.get('/qualified-users-count', orderController.getTotalQualifiedUsers);

module.exports = router;
