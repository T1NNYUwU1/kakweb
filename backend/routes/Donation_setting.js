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

    // ตรวจสอบ project_id ใน Project
    const project = await Project.findOne({ project_id }); // ใช้ findOne สำหรับ String
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Step 1: Create a new donation
    const donation = new Donation({
      project_id, // เก็บ project_id ที่เป็น String ตาม schema
      user_id: userId,
      donation_id: uuidv4(), // Generate unique donation ID
      amount,
      date: date ? new Date(date) : Date.now()
    });

    await donation.save();

    // Step 2: Add donation to user's donation_id map
    user.donation_id = user.donation_id || new Map();
    const donationKey = `donation_${donation.donation_id}`;
    user.donation_id.set(donationKey, donation._id);
    await user.save();

    // Step 3: Update total_donations ใน Project
    project.total_donations = (project.total_donations || 0) + amount; // อัปเดต total_donations
    await project.save();

    res.status(201).json({
      message: 'Donation created and total_donations updated successfully',
      donation
    });
  } catch (error) {
    console.error('Error creating donation:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ดูข้อมูลบริจาคทั้งหมดของ project_id นั้น
router.get('/project/:project_id', verifyToken, async (req, res) => {
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

      // ตรวจสอบว่า user_id เป็น ObjectId ที่ถูกต้องหรือไม่
      if (!mongoose.Types.ObjectId.isValid(user_id)) {
          return res.status(400).json({ message: 'Invalid user ID format.' });
      }

      // ค้นหา Donations ตาม user_id และ populate project_id ด้วย String
      const donations = await Donation.find({ user_id })
          .populate({
              path: 'project_id',
              select: 'title goal',
              match: {}, // ค้นหาทั้งหมดไม่ใช้เงื่อนไขเพิ่มเติม
              options: {}, // ไม่ใส่ค่าเพิ่มเติมใน options
              localField: 'project_id', // ระบุ field ที่เชื่อมต่อใน Donation schema
              foreignField: 'project_id', // ระบุ field ที่เชื่อมต่อใน Project schema
              justOne: true // ดึงข้อมูลโปรเจคที่ตรงกันเพียงอันเดียว
          });

      if (!donations || donations.length === 0) {
          return res.status(404).json({ message: 'No donations found for this user.' });
      }

      res.status(200).json(donations);
  } catch (error) {
      console.error('Error fetching user donations:', error.message);
      res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


// Fetch project details including total donations and remaining amount
router.get('/total/:project_id', verifyToken, async (req, res) => {
  try {
      const { project_id } = req.params;

      // Find the project by project_id
      const project = await Project.findOne({ project_id });
      if (!project) {
          return res.status(404).json({ message: 'Project not found.' });
      }

      // คำนวน remaining amount
      const remainingAmount = project.goal - project.total_donations;

      res.status(200).json({
          project_id: project.project_id,
          title: project.title,
          goal: project.goal,
          total_donations: project.total_donations,
          remaining_amount: remainingAmount > 0 ? remainingAmount : 0,
          message: remainingAmount > 0 
              ? `You need ${remainingAmount} more to reach the goal.` 
              : 'Goal has been reached!'
      });
  } catch (error) {
      console.error('Error fetching project details:', error.message);
      res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
  
module.exports = router;
