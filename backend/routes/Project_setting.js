const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Project = require('../models/Project.js');
const verifyToken = require('../middleware/token.js')

// Create a new project
router.post('/create', verifyToken, async (req, res) => {
  try {
    const {
      title,
      organization,
      total_donations,
      goal,
      address_project,
      type_project,
      short_description,
      long_description,
      image,
    } = req.body;

    // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาครบหรือไม่
    if (
      !title ||
      !organization?.name ||
      !goal ||
      !address_project ||
      !type_project ||
      !short_description ||
      !long_description ||
      !image
    ) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // สร้างโปรเจกต์ใหม่
    const newProject = new Project({
      title,
      organization,
      total_donations: total_donations || 0, // ตั้งค่าเริ่มต้นเป็น 0 ถ้าไม่มีการส่งค่า
      goal,
      address_project,
      type_project,
      short_description,
      long_description,
      image,
    });

    // บันทึกโปรเจกต์ลงฐานข้อมูล
    await newProject.save();

    res.status(201).json({
      message: 'Project created successfully',
      project: newProject,
    });
  } catch (error) {
    console.error('Error creating project:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get all projects
router.get('/', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get a project by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await Project.findById(id); // Find project by ID

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// API สำหรับค้นหาด้วยตัวกรอง theme, location และ sort
router.get("/projects", verifyToken, async (req, res, next) => {
  try {
    // รับค่าจาก query parameters
    const { theme, location, sort } = req.query;

    // สร้าง query object สำหรับกรองข้อมูล
    let query = {};
    if (theme) {
      query.type_project = theme; // Match theme กับ type_project ใน database
    }
    if (location) {
      query.address_project = location; // Match location กับ address_project ใน database
    }

    // สร้างตัวเลือกสำหรับ sort
    let sortOption = {};
    if (sort === "fundsRaised") {
      sortOption.total_donations = -1; // เรียงจากมากไปน้อย
    } else if (sort === "closestToGoal") {
      sortOption.goal = 1; // เรียงตามเป้าหมายที่น้อยที่สุด
    } else if (sort === "newest") {
      sortOption.createdAt = -1; // เรียงตามวันที่สร้างใหม่ล่าสุด
    }

    // ค้นหาข้อมูลโปรเจกต์ด้วย query และ sort
    const projects = await Project.find(query).sort(sortOption);

    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    next(err);
  }
});

module.exports = router;
