require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const userRoutes = require('./routes/users');

const { seedData, db } = require('./models/db');
const { publishComplaint } = require('./services/sns');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hostel CMS API is running' });
});

const PORT = process.env.PORT || 5000;

// ✅ Seed DB + publish complaints on startup (dev only)
(async () => {
  await seedData();

  for (const complaint of db.complaints) {
    await publishComplaint({
      title: complaint.title,
      description: complaint.description,
      studentName: complaint.studentName,
      roomNumber: complaint.roomNumber,
      hostel: complaint.hostel,
      rollNumber: complaint.rollNumber,
      status: complaint.status,
      createdAt: complaint.createdAt
    });
  }
  console.log('✅ All seeded complaints published to SNS');
})();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});