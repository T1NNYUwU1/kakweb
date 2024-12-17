const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/User_setting');
const donationRoutes = require('./routes/Donation_setting');
const projectRoutes = require('./routes/Project_setting');
const path = require('path');

// Load environment variables
dotenv.config();

// Check and install missing dependencies
try {
    require.resolve('bcryptjs');
} catch (err) {
    console.error("bcryptjs module not found. Please install it using 'npm install bcryptjs'.");
    process.exit(1);
}

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Static files
app.use("/images", express.static(path.join(__dirname, "../public")));

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.static('public')); // Serve static files from the "public" directory

// Routes
app.use('/users', userRoutes); // Routes for users
app.use('/donations', donationRoutes); // Routes for donations
app.use('/projects', projectRoutes); // Routes for projects

// Default route for unhandled requests
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
