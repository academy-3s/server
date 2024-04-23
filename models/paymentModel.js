// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   orderId: { type: String, required: true },
//   amount: { type: Number, required: true },
//   status: { type: String, required: true },
//   // Add more fields as needed, such as payment gateway response data, user reference, etc.
// });

// const Payment = mongoose.model('Payment', paymentSchema);

// module.exports = Payment;


// models/paymentModel.js
const crypto = require('crypto');

// Encryption function
function encryptData(data, workingKey) {
    const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(workingKey, 'hex'), Buffer.from(workingKey, 'hex'));
    let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
}

// Decryption function
function decryptData(encryptedData, workingKey) {
    const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(workingKey, 'hex'), Buffer.from(workingKey, 'hex'));
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
}

module.exports = {
    encryptData,
    decryptData
};
