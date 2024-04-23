// const express = require('express');
// const router = express.Router();

// const ccavRequestController = require('./ccavRequestController.js');
// const ccavResponseController = require('./ccavResponseController.js');

// router.post('/ccav/request', (req, res) => {
//     const requestData = req.body.requestData;

//     const formbody = ccavRequestController.handleRequest(requestData);
//     res.status(200).send(formbody);
// });

// router.post('/ccav/response', (req, res) => {
//     const encResponse = req.body.encResponse;

//     const htmlCode = ccavResponseController.handleResponse(encResponse);
//     res.status(200).send(htmlCode);
// });

// module.exports = router;



const express = require('express');
const router = express.Router();

const ccavRequestController = require('./ccavRequestController.js');
const ccavResponseController = require('./ccavResponseController.js');

router.post('/ccav/request', (req, res) => {
    const requestData = req.body.requestData;

    const formbody = ccavRequestController.handleRequest(requestData);
    res.status(200).send(formbody);
});

router.post('/ccav/response', (req, res) => {
    const encResponse = req.body.encResponse;

    const htmlCode = ccavResponseController.handleResponse(encResponse);
    res.status(200).send(htmlCode);
});

module.exports = router;
