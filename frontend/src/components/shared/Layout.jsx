import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2, LayoutDashboard, MessageSquare, Bell, Users,
  LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const studentNav = [
  { path: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/student/complaints', label: 'My Complaints', icon: MessageSquare },
  { path: '/student/announcements', label: 'Announcements', icon: Bell },
];

const wardenNav = [
  { path: '/warden', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/warden/complaints', label: 'All Complaints', icon: MessageSquare },
  { path: '/warden/students', label: 'Students', icon: Users },
  { path: '/warden/announcements', label: 'Announcements', icon: Bell },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user?.role === 'warden' ? wardenNav : studentNav;
  const isWarden = user?.role === 'warden';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isWarden ? 'bg-purple-900' : 'bg-blue-900'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Hostel CMS</p>
              <p className="text-white/50 text-xs capitalize">{user?.role} Portal</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 mx-4 mt-4 bg-white/10 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg mb-2">
            {user?.name?.charAt(0)}
          </div>
          <p className="text-white font-medium text-sm truncate">{user?.name}</p>
          <p className="text-white/60 text-xs truncate">{user?.email}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 w-full transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-4 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-gray-900">
              {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${isWarden ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
            {isWarden ? '🎓 Warden' : '📚 Student'}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
