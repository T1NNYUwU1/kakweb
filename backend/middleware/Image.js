// middleware/uploadImage.js
const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images')); // แก้ path ให้ถูกต้อง
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // ดึงนามสกุลไฟล์
    cb(null, `${Date.now()}-${file.originalname}`); // ชื่อไฟล์ไม่ซ้ำ
  },
});

// File validation (image only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
