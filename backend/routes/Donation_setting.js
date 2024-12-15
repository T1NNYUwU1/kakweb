const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Donation = require('../models/Donation.js');
const User = require('../models/User.js');
const Project = require('../models/Project.js');
const verifyToken = require('../middleware/token.js');

// Create a donation
router.post('/create', verifyToken, async (req, res) => {
    try {
      const { project_id, amount, date } = req.body;
  
      // Validate required fields
      if (!project_id || !amount) {
        return res.status(400).json({ message: 'Project ID and amount are required.' });
      }
  
      // Validate user ID from token
      const userId = req.user?.id; // Assuming verifyToken adds user id to req.user
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized - no user ID found in token.' });
      }
  
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Validate project_id (as a String)
      if (typeof project_id !== 'string') {
        return res.status(400).json({ message: 'Invalid project ID format.' });
      }
  
      // Step 1: Create a new donation
      const donation = new Donation({
        project_id,
        user_id: userId,
        donation_id: uuidv4(), // Generate a unique donation ID
        amount,
        date: date ? new Date(date) : Date.now() // Use provided date or default to now
      });
  
      await donation.save();
  
      // Step 2: Add donation to user's donation_id map
      user.donation_id = user.donation_id || new Map(); // Ensure donation_id is initialized
      const donationKey = `donation_${donation.donation_id}`;
      user.donation_id.set(donationKey, donation._id); // Add dynamically to the Map
  
      await user.save();
  
      res.status(201).json({
        message: 'Donation created and added to user successfully',
        donation
      });
    } catch (error) {
      console.error('Error creating donation:', error.message);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ดูข้อมูลบริจาคทั้งหมดของ project_id นั้น
router.get('/project/:project_id', async (req, res) => {
    try {
      const { project_id } = req.params;
  
      const donations = await Donation.find({ project_id }).populate('user_id', 'first_name last_name email');
      if (!donations || donations.length === 0) {
        return res.status(404).json({ message: 'No donations found for this project.' });
      }
  
      res.status(200).json(donations);
    } catch (error) {
      console.error('Error fetching donations:', error.message);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ดูรายการบริจาคทั้งหมดของผู้ใช้คนหนึ่ง
router.get('/user/:user_id', verifyToken, async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const donations = await Donation.find({ user_id }).populate('project_id', 'title goal');
      if (!donations || donations.length === 0) {
        return res.status(404).json({ message: 'No donations found for this user.' });
      }
  
      res.status(200).json(donations);
    } catch (error) {
      console.error('Error fetching user donations:', error.message);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// คำนวณยอดเงินบริจาคทั้งหมดของ Project_id
router.get('/total/:project_id', async (req, res) => {
    try {
      const { project_id } = req.params;
  
      const total = await Donation.aggregate([
        { $match: { project_id } },
        { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
      ]);
  
      res.status(200).json({ totalAmount: total[0]?.totalAmount || 0 });
    } catch (error) {
      console.error('Error calculating total donations:', error.message);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
  
module.exports = router;
