const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  total_donations: {
    type: Number
  },
  goal: {
    type: Number,
    required: true
  },
  address_project: {
    type: String,
    required: true
  },
  type_project: {
    type: String,
    required: true
  },
  short_description: {
    type: String,
    required: true
  },
  long_description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Project', projectSchema);