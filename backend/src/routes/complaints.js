const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { authenticate, wardenOnly } = require('../middleware/auth');

const router = express.Router();

// Get complaints (student gets own, warden gets all)
router.get('/', authenticate, (req, res) => {
  let complaints = db.complaints;

  if (req.user.role === 'student') {
    complaints = complaints.filter(c => c.studentId === req.user.id);
  }

  // Filters
  const { status, category, priority, search } = req.query;
  if (status) complaints = complaints.filter(c => c.status === status);
  if (category) complaints = complaints.filter(c => c.category === category);
  if (priority) complaints = complaints.filter(c => c.priority === priority);
  if (search) {
    const s = search.toLowerCase();
    complaints = complaints.filter(c =>
      c.title.toLowerCase().includes(s) ||
      c.description.toLowerCase().includes(s) ||
      c.studentName?.toLowerCase().includes(s)
    );
  }

  complaints = complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(complaints);
});

// Get single complaint
router.get('/:id', authenticate, (req, res) => {
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Not found' });
  if (req.user.role === 'student' && complaint.studentId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(complaint);
});

// Create complaint (student only)
router.post('/', authenticate, (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Students only' });

  const { title, description, category, priority } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description, and category are required' });
  }

  const student = db.users.find(u => u.id === req.user.id);
  const complaint = {
    id: uuidv4(),
    title,
    description,
    category,
    priority: priority || 'medium',
    status: 'pending',
    studentId: req.user.id,
    studentName: req.user.name,
    roomNumber: student?.roomNumber || 'N/A',
    hostel: student?.hostel || 'N/A',
    rollNumber: student?.rollNumber || 'N/A',
    wardenComment: null,
    resolvedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.complaints.push(complaint);
  res.status(201).json(complaint);
});

// Update complaint status (warden only)
router.patch('/:id/status', authenticate, wardenOnly, (req, res) => {
  const { status, wardenComment } = req.body;
  const idx = db.complaints.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  db.complaints[idx] = {
    ...db.complaints[idx],
    status,
    wardenComment: wardenComment || db.complaints[idx].wardenComment,
    resolvedAt: status === 'resolved' ? new Date().toISOString() : db.complaints[idx].resolvedAt,
    updatedAt: new Date().toISOString()
  };

  res.json(db.complaints[idx]);
});

// Delete complaint (student can delete own pending, warden can delete any)
router.delete('/:id', authenticate, (req, res) => {
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Not found' });

  if (req.user.role === 'student') {
    if (complaint.studentId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    if (complaint.status !== 'pending') return res.status(400).json({ error: 'Can only delete pending complaints' });
  }

  db.complaints = db.complaints.filter(c => c.id !== req.params.id);
  res.json({ message: 'Deleted' });
});

// Stats
router.get('/stats/overview', authenticate, (req, res) => {
  let complaints = req.user.role === 'student'
    ? db.complaints.filter(c => c.studentId === req.user.id)
    : db.complaints;

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    rejected: complaints.filter(c => c.status === 'rejected').length,
    byCategory: {},
    byPriority: {}
  };

  complaints.forEach(c => {
    stats.byCategory[c.category] = (stats.byCategory[c.category] || 0) + 1;
    stats.byPriority[c.priority] = (stats.byPriority[c.priority] || 0) + 1;
  });

  res.json(stats);
});

// Announcements
router.get('/announcements/all', authenticate, (req, res) => {
  res.json(db.announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

router.post('/announcements', authenticate, wardenOnly, (req, res) => {
  const { title, message, hostel } = req.body;
  if (!title || !message) return res.status(400).json({ error: 'Title and message required' });

  const ann = {
    id: uuidv4(),
    title,
    message,
    hostel: hostel || 'All',
    createdBy: req.user.id,
    createdByName: req.user.name,
    createdAt: new Date().toISOString()
  };
  db.announcements.push(ann);
  res.status(201).json(ann);
});

module.exports = router;
