const express = require('express');
const db = require('../models/db');
const { authenticate, wardenOnly } = require('../middleware/auth');

const router = express.Router();

// Get all students (warden only)
router.get('/students', authenticate, wardenOnly, (req, res) => {
  const students = db.users
    .filter(u => u.role === 'student')
    .map(({ password, ...u }) => u);
  res.json(students);
});

// Get profile
router.get('/profile', authenticate, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  const { password, ...u } = user;
  res.json(u);
});

module.exports = router;
