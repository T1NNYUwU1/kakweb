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
      isFeatured,
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
      total_donations: total_donations || 0,
      goal,
      address_project,
      type_project,
      short_description,
      long_description,
      image,
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
});

/*
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
*/

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

// API สำหรับค้นหาด้วยตัวกรอง theme, location , isFeatured และ sort(เรียงตามจำนวนเงินบริจาคจากมากไปน้อย, เรียงตามเป้าหมายที่น้อยที่สุด, เรียงตามวันที่สร้างใหม่ล่าสุด)
router.get("/", verifyToken, async (req, res, next) => {
  try {
    // รับค่าจาก query parameters
    const { theme, location, sort, isFeatured } = req.query;

    // สร้าง query object สำหรับกรองข้อมูล
    let query = {};
    if (theme)  query.type_project = theme; // Match theme กับ type_project ใน database
    if (location) query.address_project = location; // Match location กับ address_project ใน database
    if (isFeatured) query.isFeatured = isFeatured === "true"; // Filter เฉพาะ isFeatured (true/false)
    
    // สร้างตัวเลือกสำหรับ sort
    let sortOption = {};
    if (sort === "fundsRaised") sortOption.total_donations = -1; // เรียงจากมากไปน้อย
    else if (sort === "closestToGoal") sortOption.goal = 1; // เรียงตามเป้าหมายที่น้อยที่สุด
    else if (sort === "newest") sortOption.createdAt = -1; // เรียงตามวันที่สร้างใหม่ล่าสุด

    // ค้นหาข้อมูลโปรเจกต์ด้วย query และ sort
    let projects = await Project.find(query).sort(sortOption).limit(10);

    // Fallback logic: ถ้าไม่มีโปรเจกต์ isFeatured = true ให้ใช้ isFeatured = false แทน
    if (isFeatured === "true" && projects.length === 0) {
      console.log("No featured projects found, showing fallback.");
      projects = await Project.find({ isFeatured: false }).sort(sortOption).limit(10);
    }

    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
