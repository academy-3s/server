const express = require('express');
const router = express.Router();

// Import and use sub-routes
const certificateRoutes = require('./certificate');

router.use('/certificates', certificateRoutes);

module.exports = router;
