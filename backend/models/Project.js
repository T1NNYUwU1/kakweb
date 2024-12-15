const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID

const projectSchema = new mongoose.Schema({
  project_id: { 
    type: String, 
    default: uuidv4, // Generate unique projectId 
    unique: true // Ensure projectId is unique
  },
  title: {
    type: String,
    required: true
  },
  organization: {
    name: { type: String, required: true },
    address: { type: String },
    contact: { type: String },
    email: { type: String },
  },
  total_donations: { // จำนวนเงินที่ระดมทุนได้จนถึงปัจจุบัน
    type: Number
  },
  goal: { // เป้าหมายระดมทุน
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
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
},
{ timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);