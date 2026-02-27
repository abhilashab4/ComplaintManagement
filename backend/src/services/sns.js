require('dotenv').config();
const express = require('express');
const { seedData } = require('./models/db');

const app = express();
app.use(express.json());

// ✅ Seed data and publish to SNS on startup (development only)
(async () => {
  await seedData();
})();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});