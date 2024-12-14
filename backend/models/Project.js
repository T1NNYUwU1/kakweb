const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  category: { type: String, required: true },
  country: { type: String, required: true },
  projectId: { type: String, required: true },
  currentAmount: { type: Number, default: 0 },
  goalAmount: { type: Number, required: true },
  donationCount: { type: Number, default: 0 },
  summary: String,
  challenge: String,
  solution: String,
  longTermImpact: String,
  images: [String],
  donationTiers: [{
    amount: Number,
    description: String
  }]
});

module.exports = mongoose.model('Project', projectSchema);