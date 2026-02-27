const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// In-memory storage
const db = {
  users: [],
  complaints: [],
  announcements: []
};

// Seed data
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
      name: 'Mrs. Priya Sharma',
      email: 'warden2@hostel.com',
      password: wardPassword,
      role: 'warden',
      hostel: 'Block B',
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
    },
    {
      id: uuidv4(),
      name: 'Sneha Gupta',
      email: 'student2@hostel.com',
      password: stuPassword,
      role: 'student',
      roomNumber: 'A-301',
      hostel: 'Block A',
      rollNumber: 'CS2021002',
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Rahul Singh',
      email: 'student3@hostel.com',
      password: stuPassword,
      role: 'student',
      roomNumber: 'B-105',
      hostel: 'Block B',
      rollNumber: 'ME2021003',
      createdAt: new Date().toISOString()
    }
  ];

  const categories = ['Plumbing', 'Electrical', 'Cleanliness', 'Food', 'Security', 'Internet', 'Furniture', 'Other'];
  const statuses = ['pending', 'in-progress', 'resolved', 'rejected'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  const sampleComplaints = [
    { title: 'Water leaking from bathroom tap', category: 'Plumbing', description: 'The tap in bathroom is constantly leaking for 3 days now.', status: 'pending', priority: 'high' },
    { title: 'Room fan not working', category: 'Electrical', description: 'Ceiling fan stopped working suddenly.', status: 'in-progress', priority: 'medium' },
    { title: 'Dirty corridor near room 204', category: 'Cleanliness', description: 'Corridor has not been cleaned for a week.', status: 'resolved', priority: 'low' },
    { title: 'Poor food quality in mess', category: 'Food', description: 'Food quality has deteriorated significantly this month.', status: 'pending', priority: 'medium' },
    { title: 'WiFi not working in my room', category: 'Internet', description: 'No internet connectivity since yesterday.', status: 'in-progress', priority: 'high' },
    { title: 'Broken chair in room', category: 'Furniture', description: 'Study chair leg is broken.', status: 'pending', priority: 'low' },
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
      wardenComment: c.status === 'resolved' ? 'Issue has been fixed by maintenance team.' : c.status === 'in-progress' ? 'Our team is working on this.' : null,
      resolvedAt: c.status === 'resolved' ? new Date().toISOString() : null,
      createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date().toISOString()
    });
  });

  db.announcements = [
    {
      id: uuidv4(),
      title: 'Water Supply Interruption',
      message: 'Water supply will be interrupted on Sunday 10 AM - 2 PM for maintenance.',
      createdBy: db.users[0].id,
      createdByName: db.users[0].name,
      hostel: 'All',
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      title: 'Mess Timing Change',
      message: 'Dinner timing changed from 7:30 PM to 8:00 PM effective from next week.',
      createdBy: db.users[0].id,
      createdByName: db.users[0].name,
      hostel: 'All',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  console.log('✅ Database seeded successfully');
}

seedData();

module.exports = db;
