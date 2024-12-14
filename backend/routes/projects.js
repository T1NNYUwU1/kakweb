const express = require('express');
const router = express.Router();
//const Project = require('../models/Project');
//const Donation = require('../models/Donation');

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/donate', async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { amount, isMonthly, donorName, donorEmail } = req.body;
    
    const donation = new Donation({
      projectId: project._id,
      amount,
      isMonthly,
      donorName,
      donorEmail
    });
    
    await donation.save();
    
    project.currentAmount += amount;
    project.donationCount += 1;
    await project.save();
    
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router