const mongoose = require('mongoose');

const certficateGivenHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    certi_no: { type: String, required: true },
    score: { type: String, required: true },
    comingFrom: { type: String, required: true },
    result: { type: String, required: false },
    date: { type: String, required: false }
    // name: { type: String, required: true },
    // email: { type: String, required: false },
    // phone: { type: String, required: false },
    // membershipNo: { type: String, required: false },
}, { timestamps: true });

const certficateGivenHistory = mongoose.model('GivenCertificateHistory', certficateGivenHistorySchema);

module.exports = certficateGivenHistory;