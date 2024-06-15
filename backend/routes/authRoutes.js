import express from 'express';
import User from '../models/User.js'; // Corrected the file name to match the actual file name
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import process from 'process';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    // Generate a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: 'Login failed!' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;