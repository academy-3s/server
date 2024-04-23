

// const crypto = require('crypto');
// const request = require('request');
// const express = require('express');
// const bodyParser = require('body-parser');

// const workingKey = process.env.w;
// const merchantID = '2469675';

// function generateOrderID() {
//   const timestamp = Date.now().toString(); // Get the current timestamp as a string
//   const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Generate a random 4-digit number and pad with leading zeros if necessary
//   const orderID = `${timestamp}${random}`;
//   return orderID;
// }


// const initiatePayment = (req, res) => {
//   const orderID = generateOrderID(); // Generate a unique order ID
//   const orderAmount = req.body.amount; // Amount to be paid sent from the client
//   const currency = 'INR'; // Set the currency according to your needs

//   const data = {
//     merchant_id: merchantID,
//     order_id: orderID,
//     amount: orderAmount,
//     currency,
//     language: 'EN', // Set the language of the payment page
//     billing_name: req.body.name, // Customer's name
//     billing_address: req.body.address, // Customer's address
//     billing_city: req.body.city, // Customer's city
//     billing_state: req.body.state, // Customer's state
//     billing_zip: req.body.zip, // Customer's ZIP code
//     billing_country: req.body.country, // Customer's country
//     billing_tel: req.body.phone, // Customer's phone number
//     billing_email: req.body.email, // Customer's email address
//   };

//   // Generate secure hash
//   const secureHash = generateSecureHash(data, workingKey);
//   data['checksum'] = secureHash;

//   // Make a payment request to CCAvenue
//   request.post(
//     {
//       url: 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction',
//       form: data,
//     },
//     (error, response, body) => {
//       if (error) {
//         console.error('Error in payment request:', error);
//         res.status(500).send('Payment request failed');
//       } else {
//         // Return the response from the payment gateway to the client
//         res.send(body);
//       }
//     }
//   );
// };

// // Function to generate secure hash
// function generateSecureHash(data, workingKey) {
//   // Remove empty or undefined fields
//   const filteredData = Object.keys(data)
//     .filter((key) => data[key] !== undefined && data[key] !== '')
//     .reduce((obj, key) => {
//       obj[key] = data[key];
//       return obj;
//     }, {});

//   const dataString = Object.values(filteredData).join('|');
//   const secureHash = crypto.createHmac('sha256', workingKey).update(dataString).digest('hex');
//   return secureHash;
// }

// module.exports = {
//   initiatePayment
// };




// controllers/paymentController.js
const { encryptData, decryptData } = require('../models/paymentModel');

// Simulated payment response parsing logic
function parsePaymentResponse(response) {
    try {
        // Assuming the response is in JSON format
        const parsedResponse = JSON.parse(response);

        // Check if the response contains payment status information
        if (parsedResponse && parsedResponse.status) {
            return parsedResponse.status.toLowerCase();
        } else {
            return 'unknown';
        }
    } catch (error) {
        console.error('Error parsing response:', error);
        return 'error';
    }
}

const initiatePayment = (req, res) => {
    // Construct and encrypt payment data
    const paymentData = {
        merchant_id: '2469675', // Replace with your merchant ID
        order_id: '12345',
        amount: '1000.00',
        currency: 'INR',
        redirect_url: 'http://yourwebsite.com/payment/ccavenue-response'
        // ... add more payment data fields
    };
    const encryptedData = encryptData(paymentData, req.workingKey);

    // Construct the CCAvenue URL
    const ccAvenueUrl = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encryptedData}&access_code=${req.accessCode}`;

    res.json({ redirect_url: ccAvenueUrl });
};

const handleCCavenueResponse = (req, res) => {
    const encryptedResponse = req.body.encResp; // Encrypted response from CCAvenue

    // Decrypt the response
    const decryptedResponse = decryptData(encryptedResponse, req.workingKey);

    // Parse the response and extract payment status
    const paymentStatus = parsePaymentResponse(decryptedResponse);

    if (paymentStatus === 'success') {
        res.send('Payment Successful');
    } else if (paymentStatus === 'failure') {
        res.send('Payment Failed');
    } else {
        res.send('Payment Status: ' + paymentStatus);
    }
};

module.exports = {
    initiatePayment,
    handleCCavenueResponse
};
