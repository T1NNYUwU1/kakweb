const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const projectRoutes = require('./routes/projects');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/users', require('./routes/User_setting'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});