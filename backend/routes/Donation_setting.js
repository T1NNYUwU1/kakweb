const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Donation = require('../models/Donation.js');
const User = require('../models/User.js');
const verifyToken = require('../middleware/token.js');

// Create a donation
router.post('/create', verifyToken, async (req, res) => {
    try {
        const { projectId, amount, date, project } = req.body;

        // Validate required fields
        if (!projectId || !amount || !date || !project) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Validate projectId as ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid projectId.' });
        }

        // Get userId from the token payload
        const userId = req.user?.id; // Assuming verifyToken adds user id to req.user
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized - no user ID found in token.' });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Step 1: Create a new donation
        const donation = new Donation({
            projectId,
            donation_id: new mongoose.Types.ObjectId(), // Generate donation_id dynamically
            amount,
            date: new Date(date),
            project
        });

        await donation.save();

        // Step 2: Add donation to user's donation_id map
        if (!user.donation_id) user.donation_id = new Map(); // Ensure donation_id is initialized
        const donationKey = `donation_${donation._id}`;
        user.donation_id.set(donationKey, donation._id); // Add dynamically to the Map

        await user.save();

        res.status(201).json({
            message: 'Donation created and added to user successfully',
            donation
        });
    } catch (error) {
        console.error('Error creating donation:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});



module.exports = router;
