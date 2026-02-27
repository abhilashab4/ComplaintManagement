import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentComplaints from './pages/student/StudentComplaints';
import StudentNewComplaint from './pages/student/StudentNewComplaint';
import StudentAnnouncements from './pages/student/StudentAnnouncements';
import WardenDashboard from './pages/warden/WardenDashboard';
import WardenComplaints from './pages/warden/WardenComplaints';
import WardenStudents from './pages/warden/WardenStudents';
import WardenAnnouncements from './pages/warden/WardenAnnouncements';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to={user.role === 'warden' ? '/warden' : '/student'} />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Routes */}
          <Route path="/student" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
          <Route path="/student/complaints" element={<PrivateRoute role="student"><StudentComplaints /></PrivateRoute>} />
          <Route path="/student/complaints/new" element={<PrivateRoute role="student"><StudentNewComplaint /></PrivateRoute>} />
          <Route path="/student/announcements" element={<PrivateRoute role="student"><StudentAnnouncements /></PrivateRoute>} />

          {/* Warden Routes */}
          <Route path="/warden" element={<PrivateRoute role="warden"><WardenDashboard /></PrivateRoute>} />
          <Route path="/warden/complaints" element={<PrivateRoute role="warden"><WardenComplaints /></PrivateRoute>} />
          <Route path="/warden/students" element={<PrivateRoute role="warden"><WardenStudents /></PrivateRoute>} />
          <Route path="/warden/announcements" element={<PrivateRoute role="warden"><WardenAnnouncements /></PrivateRoute>} />

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
