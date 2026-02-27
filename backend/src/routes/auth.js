const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...userWithoutPass } = user;
  res.json({ token, user: userWithoutPass });
});

// Register Student
router.post('/register', async (req, res) => {
  const { name, email, password, roomNumber, hostel, rollNumber } = req.body;
  if (!name || !email || !password || !roomNumber || !rollNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    name,
    email,
    password: hashed,
    role: 'student',
    roomNumber,
    hostel: hostel || 'Block A',
    rollNumber,
    createdAt: new Date().toISOString()
  };

  db.users.push(user);
  const { password: _, ...userWithoutPass } = user;
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: userWithoutPass });
});

module.exports = router;
