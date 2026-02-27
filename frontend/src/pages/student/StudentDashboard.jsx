import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/shared/Layout';
import { api, CATEGORY_ICONS } from '../../hooks/api';
import { StatusBadge, PriorityBadge } from '../../components/shared/Badges';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, CheckCircle, Clock, AlertCircle, Plus, Bell, Home, BookOpen } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, complaintsRes, annRes] = await Promise.all([
          api.getStats(),
          api.getComplaints(),
          api.getAnnouncements()
        ]);
        setStats(statsRes.data);
        setComplaints(complaintsRes.data.slice(0, 5));
        setAnnouncements(annRes.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div></Layout>;

  const statCards = [
    { label: 'Total Complaints', value: stats?.total || 0, icon: MessageSquare, color: 'bg-blue-50 text-blue-600', bg: 'bg-blue-600' },
    { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: 'bg-amber-50 text-amber-600', bg: 'bg-amber-500' },
    { label: 'In Progress', value: stats?.inProgress || 0, icon: AlertCircle, color: 'bg-orange-50 text-orange-600', bg: 'bg-orange-500' },
    { label: 'Resolved', value: stats?.resolved || 0, icon: CheckCircle, color: 'bg-green-50 text-green-600', bg: 'bg-green-500' },
  ];

  return (
    <Layout>
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
            <p className="text-blue-100 mt-1">Room {user?.roomNumber} • {user?.hostel}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-blue-100">
              <span className="flex items-center gap-1"><Home className="w-4 h-4" /> {user?.hostel}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {user?.rollNumber}</span>
            </div>
          </div>
          <Link to="/student/complaints/new" className="bg-white text-blue-600 px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors">
            <Plus className="w-4 h-4" /> New Complaint
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className={`inline-flex p-2 rounded-xl mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Complaints</h3>
            <Link to="/student/complaints" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          {complaints.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No complaints yet</p>
              <Link to="/student/complaints/new" className="mt-3 btn-primary inline-block text-sm">
                File your first complaint
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map(c => (
                <div key={c.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <span className="text-2xl">{CATEGORY_ICONS[c.category] || '📋'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{c.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.category} • {new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Announcements</h3>
            <Link to="/student/announcements" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          {announcements.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No announcements</p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map(a => (
                <div key={a.id} className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="font-medium text-sm text-blue-900">{a.title}</p>
                  <p className="text-xs text-blue-700 mt-1 line-clamp-2">{a.message}</p>
                  <p className="text-xs text-blue-400 mt-2">{new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
