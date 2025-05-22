const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, role });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("❌ Registration Error:", error); // Log error in backend
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Login User
// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // ✅ Include `name` in the token
        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
