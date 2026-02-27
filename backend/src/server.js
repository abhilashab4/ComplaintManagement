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

// ✅ Seed DB on startup
(async () => {
  try {
    await seedData();
    console.log('✅ Database seeded successfully');

    // ✅ Publish complaints to SNS asynchronously
    if (process.env.AWS_REGION && process.env.SNS_TOPIC_ARN) {
      db.complaints.forEach(c => {
        publishComplaint({
          title: c.title,
          description: c.description,
          studentName: c.studentName,
          roomNumber: c.roomNumber,
          hostel: c.hostel,
          rollNumber: c.rollNumber,
          status: c.status,
          createdAt: c.createdAt
        }).catch(err => {
          console.error('❌ Failed to publish complaint to SNS:', err.message);
        });
      });
      console.log('⚡ SNS publishing started in background');
    } else {
      console.log('⚠️ AWS SNS not configured — skipping SNS publish');
    }

  } catch (err) {
    console.error('❌ Error seeding DB:', err.message);
  }
})();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});