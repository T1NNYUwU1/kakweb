const connectDB = require('./db'); // นำเข้าไฟล์ db.js
const Project = require('./models/Project'); // ชื่อไฟล์ Model ของคุณ

const seedData = [
  {
    id: 50556,
    name: "Project A",
    description: "This is a description for Project A",
    goal: 10000,
    raised: 5000,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 50557,
    name: "Project B",
    description: "This is a description for Project B",
    goal: 20000,
    raised: 15000,
    image: "https://via.placeholder.com/150",
  },
];

// ฟังก์ชันสำหรับเพิ่มข้อมูลจำลอง
const seedDatabase = async () => {
    try {
      // เรียกใช้การเชื่อมต่อฐานข้อมูลจาก db.js
      await connectDB();
  
      // ลบข้อมูลเก่า (ถ้าต้องการ)
      await Project.deleteMany({});
      console.log('Existing data cleared.');
  
      // เพิ่ม mockup data ใหม่
      await Project.insertMany(seedData);
      console.log('Mockup data added successfully!');
  
      // ปิดการเชื่อมต่อ
      process.exit(0);
    } catch (err) {
      console.error('Error seeding database:', err);
      process.exit(1); // Exit process with failure
    }
  };
  
  seedDatabase();