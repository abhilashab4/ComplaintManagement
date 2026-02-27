import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/shared/Layout';
import { api, CATEGORY_ICONS } from '../../hooks/api';
import { StatusBadge, PriorityBadge } from '../../components/shared/Badges';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, CheckCircle, Clock, XCircle, Users, TrendingUp, AlertTriangle } from 'lucide-react';

export default function WardenDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [urgentComplaints, setUrgentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, allRes, urgentRes] = await Promise.all([
          api.getStats(),
          api.getComplaints({ status: '' }),
          api.getComplaints({ priority: 'urgent', status: 'pending' })
        ]);
        setStats(statsRes.data);
        setRecentComplaints(allRes.data.slice(0, 6));
        setUrgentComplaints(urgentRes.data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div></div></Layout>;

  const statCards = [
    { label: 'Total Complaints', value: stats?.total || 0, icon: MessageSquare, color: 'text-blue-600 bg-blue-50', trend: '+12% this week' },
    { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: 'text-amber-600 bg-amber-50', trend: 'Needs attention' },
    { label: 'In Progress', value: stats?.inProgress || 0, icon: TrendingUp, color: 'text-orange-600 bg-orange-50', trend: 'Being handled' },
    { label: 'Resolved', value: stats?.resolved || 0, icon: CheckCircle, color: 'text-green-600 bg-green-50', trend: `${Math.round((stats?.resolved / (stats?.total || 1)) * 100)}% resolution rate` },
  ];

  return (
    <Layout>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Good day, {user?.name?.split(' ').slice(-1)[0]}! 🎓</h2>
            <p className="text-purple-200 mt-1">Hostel Warden • {user?.hostel}</p>
            {stats?.pending > 0 && (
              <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 w-fit">
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span className="text-sm text-amber-200">{stats.pending} complaints awaiting your review</span>
              </div>
            )}
          </div>
          <Link to="/warden/complaints" className="bg-white text-purple-700 px-4 py-2 rounded-xl font-medium text-sm hover:bg-purple-50 transition-colors">
            View All Complaints
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="card">
            <div className={`inline-flex p-2 rounded-xl mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{trend}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Complaints</h3>
            <Link to="/warden/complaints" className="text-sm text-purple-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentComplaints.map(c => (
              <div key={c.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-xl">{CATEGORY_ICONS[c.category] || '📋'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{c.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {c.studentName} • Room {c.roomNumber} • {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={c.status} />
                  <PriorityBadge priority={c.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent + Category breakdown */}
        <div className="space-y-4">
          {urgentComplaints.length > 0 && (
            <div className="card border border-red-100 bg-red-50">
              <h3 className="font-semibold text-red-800 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" /> Urgent Pending
              </h3>
              <div className="space-y-2">
                {urgentComplaints.map(c => (
                  <div key={c.id} className="bg-white rounded-lg p-3">
                    <p className="font-medium text-sm text-gray-900 truncate">{c.title}</p>
                    <p className="text-xs text-gray-500">Room {c.roomNumber} • {c.studentName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats?.byCategory && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">By Category</h3>
              <div className="space-y-2">
                {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{CATEGORY_ICONS[cat]}</span>
                      <span className="text-sm text-gray-600">{cat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(count / stats.total) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-medium text-gray-700 w-4">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
