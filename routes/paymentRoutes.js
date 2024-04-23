// const express = require('express');
// const paymentController = require('../controllers/paymentController');

// const router = express.Router();

// router.post('/initiatePayment', paymentController.initiatePayment);
// //router.post('/paymentResponse', paymentController.paymentResponse);

// module.exports = router;



// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Middleware to set workingKey and accessCode
router.use((req, res, next) => {
    req.workingKey = 'C07F0C53B127E007D4F09B6D66F0D9CF'; // Replace with your working key
    req.accessCode = 'AVAF94KG19CN72FANC'; // Replace with your access code
    next();
});

// Routes
router.get('/initiate-payment', paymentController.initiatePayment);
router.post('/ccavenue-response', paymentController.handleCCavenueResponse);

module.exports = router;
