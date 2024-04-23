// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        reuired: true
    },
    courses: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Course',
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    totalCartValue: {
        type: String,
        required: true
    },
    payment_type: {
        type: String,
        required: true
    },
    billing_name: {
        type: String,
        required: true
    },
    billing_email: {
        type: String,
        required: true
    },
    billing_phone: {
        type: String,
        required: true
    },
    billing_address: {
        type: String,
        required: true
    },
    billing_zip: {
        type: String,
        required: true
    },
    billing_city: {
        type: String,
        required: true
    },
    billing_state: {
        type: String,
        required: true
    },
    billing_country: {
        type: String,
        required: true
    }
    // Add more fields as needed for your order document
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;