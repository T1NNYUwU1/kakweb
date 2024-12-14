const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  donation_id: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  project: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Donation', donationSchema);