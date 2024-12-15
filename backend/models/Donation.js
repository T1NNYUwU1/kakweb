const mongoose = require('mongoose');
const User = require('./User');

const donationSchema = new mongoose.Schema({
  project_id: {
    type: String,
    ref: 'Project',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // เชื่อมกับ User Model
    ref: 'User',
    required: true
  },
  donation_id: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
});

module.exports = mongoose.model('Donation', donationSchema);