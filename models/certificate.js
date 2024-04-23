const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String, required: true },
  certificatePath: { type: String, required: true },
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
