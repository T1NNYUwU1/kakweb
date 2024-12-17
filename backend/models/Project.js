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
    address: { type: String, required: true  },
    contact: { type: String, required: true  },
    email: { type: String, required: true  },
  },
  total_donations: { // จำนวนเงินที่ระดมทุนได้จนถึงปัจจุบัน
    type: Number,
    default: 0
  },
  goal: { // เป้าหมายระดมทุน
    type: Number,
    required: true
  },
  location: { 
    type: String, 
    enum: ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania','Australia'], 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Education', 'Health', 'Technology', 'Environment', 'Arts & Culture', 'Disaster'], 
    required: true 
  },
  long_description: {
    type: String,
    required: true
  },
  image: {
    type: [String], // เก็บเป็น Array ของ Path รูปภาพ
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