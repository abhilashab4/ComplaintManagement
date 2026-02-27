# 🏨 Hostel Complaint Management System

A full-stack web application for managing hostel complaints with separate interfaces for **Wardens** and **Students**.

## 🛠️ Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS + React Router v6
- **Backend:** Node.js + Express.js (in-memory storage, no DB required)
- **Auth:** JWT-based authentication with bcrypt password hashing

---

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 🔐 Demo Credentials

| Role    | Email                   | Password    |
|---------|-------------------------|-------------|
| Warden  | warden@hostel.com       | warden123   |
| Warden  | warden2@hostel.com      | warden123   |
| Student | student@hostel.com      | student123  |
| Student | student2@hostel.com     | student123  |
| Student | student3@hostel.com     | student123  |

Or **register** a new student account directly from the app.

---

## ✨ Features

### 👨‍🎓 Student Interface
- 📊 Dashboard with complaint statistics
- ➕ File new complaints (8 categories, 4 priority levels)
- 📋 View and track all personal complaints
- 💬 See warden responses and status updates
- 🔔 View hostel announcements
- 🗑️ Delete own pending complaints

### 🎓 Warden Interface
- 📊 Dashboard with full complaint analytics
- 📋 View and manage ALL student complaints
- ✅ Update complaint status (Pending → In Progress → Resolved/Rejected)
- 💬 Add responses/comments to complaints
- 👥 View all registered students
- 📣 Post announcements to students
- 🔍 Filter by status, category, priority, search

---

## 📁 Project Structure

```
hostel-cms/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express app entry point
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT middleware
│   │   ├── models/
│   │   │   └── db.js          # In-memory database with seed data
│   │   └── routes/
│   │       ├── auth.js        # Login/Register endpoints
│   │       ├── complaints.js  # CRUD + status management
│   │       └── users.js       # Student listing
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx             # Router setup
    │   ├── context/
    │   │   └── AuthContext.jsx # Auth state management
    │   ├── hooks/
    │   │   └── api.js          # Axios API calls & constants
    │   ├── components/
    │   │   └── shared/
    │   │       ├── Layout.jsx  # Sidebar + header layout
    │   │       └── Badges.jsx  # Status/Priority badges
    │   └── pages/
    │       ├── LoginPage.jsx
    │       ├── RegisterPage.jsx
    │       ├── student/        # Student-specific pages
    │       └── warden/         # Warden-specific pages
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Student registration

### Complaints
- `GET /api/complaints` - List (filtered by role)
- `POST /api/complaints` - Create (student only)
- `PATCH /api/complaints/:id/status` - Update status (warden only)
- `DELETE /api/complaints/:id` - Delete
- `GET /api/complaints/stats/overview` - Statistics

### Announcements
- `GET /api/complaints/announcements/all` - List all
- `POST /api/complaints/announcements` - Create (warden only)

### Users
- `GET /api/users/students` - All students (warden only)
- `GET /api/users/profile` - Own profile

---

## 📝 Notes
- Data is stored **in-memory** — it resets when the server restarts
- For production, replace `db.js` with MongoDB/PostgreSQL
- JWT secret should be moved to environment variables in production
