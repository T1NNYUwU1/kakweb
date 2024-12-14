const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  amount: { 
    type: Number, 
    required: true 
  },
  isMonthly: { 
    type: Boolean, 
    default: false 
  },
  donorName: String,
  donorEmail: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', donationSchema);