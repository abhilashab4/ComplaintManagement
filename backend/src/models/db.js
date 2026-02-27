const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// In-memory storage
const db = {
  users: [],
  complaints: [],
  announcements: []
};

// Seed data function
async function seedData() {
  const wardPassword = await bcrypt.hash('warden123', 10);
  const stuPassword = await bcrypt.hash('student123', 10);

  db.users = [
    {
      id: uuidv4(),
      name: 'Dr. Rajesh Kumar',
      email: 'warden@hostel.com',
      password: wardPassword,
      role: 'warden',
      hostel: 'Block A',
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Arjun Patel',
      email: 'student@hostel.com',
      password: stuPassword,
      role: 'student',
      roomNumber: 'A-204',
      hostel: 'Block A',
      rollNumber: 'CS2021001',
      createdAt: new Date().toISOString()
    }
    // add other users...
  ];

  // Add sample complaints
  const sampleComplaints = [
    { title: 'Water leaking', category: 'Plumbing', description: 'Tap leaking', status: 'pending', priority: 'high' }
    // Add more sample complaints...
  ];

  const studentUsers = db.users.filter(u => u.role === 'student');

  sampleComplaints.forEach((c, i) => {
    const student = studentUsers[i % studentUsers.length];
    db.complaints.push({
      id: uuidv4(),
      ...c,
      studentId: student.id,
      studentName: student.name,
      roomNumber: student.roomNumber,
      hostel: student.hostel,
      rollNumber: student.rollNumber,
      wardenComment: null,
      resolvedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  });

  console.log('✅ Database seeded successfully');
}

// ✅ EXPORT BOTH
module.exports = { db, seedData };