const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/token.js');

app.use(cors());

//signup
router.post('/signup', async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number, password, street_address, country, state, postal_code } = req.body;
    const user = new User({
      first_name,
      last_name,
      email,
      phone_number,
      password,
      street_address,
      country,
      state,
      postal_code
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//login
router.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Compare the provided password with the stored hash
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
          return res.status(401).json({ message: 'Password is incorrect' });
      }

      // Load the JWT_SECRET from environment variables
      const secret = process.env.JWT_SECRET;
      if (!secret) {
          return res.status(500).json({ message: 'JWT Secret is not configured on the server' });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1h' });

      // Respond with the token
      res.status(200).json({ token });
  } catch (err) {
      // Handle unexpected errors
      console.error("Error during login:", err.message);
      res.status(500).json({ message: 'Server error' });
  }
});

//logout
router.post('/logout', verifyToken, (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out' });
  }
);

//change password
router.post('/change-password', verifyToken, async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(200).json({ message: 'Password changed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    }
);

module.exports = router;