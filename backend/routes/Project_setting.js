const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Project = require('../models/Project.js');
const verifyToken = require('../middleware/token.js')
const multer = require('multer'); // ใช้สำหรับรูปภาพ
const upload = require('../middleware/Image.js');

// Create a new project with multiple images
router.post('/create', verifyToken, upload.array('images', 10), /* อัปโหลดได้สูงสุด 10 รูป (เปลี่ยนตัวเลขได้) */ async (req, res) => {
    try {
      const {
        title,
        organization,
        goal,
        location,
        category,
        long_description,
        isFeatured,
      } = req.body;

      // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาครบหรือไม่
      if (
        !title ||
        !organization?.name ||
        !goal ||
        !location ||
        !category ||
        !long_description
      ) {
        return res.status(400).json({ message: 'Required fields are missing' });
      }

      // เก็บ path ของไฟล์รูปที่อัปโหลด
      const imagePaths = req.files.map((file) => file.path.replace(/\\/g, '/'));

      // สร้างโปรเจกต์ใหม่
      const newProject = new Project({
        title,
        organization,
        total_donations: 0,
        goal,
        location,
        category,
        long_description,
        image: imagePaths, // เก็บเป็น array ของ path รูปภาพ
        isFeatured: isFeatured || false,
      });

      await newProject.save();

      res.status(201).json({
        message: 'Project created successfully',
        project: newProject,
      });
    } catch (error) {
      console.error('Error creating project:', error.message);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
);

// Get a project by project_id
router.get('/:project_id', verifyToken, async (req, res) => {
  try {
    const { project_id } = req.params;

    const project = await Project.findOne({ project_id });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


// API: Get projects with filtering, sorting, and relevant sorting
router.get('/', async (req, res) => {
  try {
    const { category, location, sort, isFeatured } = req.query;

    // สร้าง query object
    let query = {};
    if (category) query.category = category; // กรองตามหมวดหมู่
    if (location) query.location = location; // กรองตามตำแหน่งที่ตั้ง

    // ตัวเลือกการ sort
    let sortOption = {};
    if (sort === 'fundsRaised') sortOption.total_donations = -1;
    else if (sort === 'closestTogoal') sortOption.goal = 1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else if (sort === 'relevant') sortOption.isFeatured = -1; // เรียง isFeatured ก่อน

    const projects = await Project.find(query).sort(sortOption);

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Search Projects
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // ค้นหาข้อมูลจาก title หรือ short_description
    const projects = await Project.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, // ค้นหาแบบ case-insensitive
        { category: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }, // ค้นหาในประเภทโปรเจกต์
        { 'organization.name': { $regex: query, $options: 'i' } }, // ค้นหาในชื่อองค์กร
      ],
    });

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found' });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error searching projects:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
