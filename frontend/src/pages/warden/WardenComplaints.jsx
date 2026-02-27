import { useState, useEffect } from 'react';
import Layout from '../../components/shared/Layout';
import { api, CATEGORIES, STATUSES, PRIORITIES, CATEGORY_ICONS } from '../../hooks/api';
import { StatusBadge, PriorityBadge } from '../../components/shared/Badges';
import { Search, ChevronDown, ChevronUp, MessageSquare, CheckCircle, XCircle, RotateCcw, Clock } from 'lucide-react';

const STATUS_ACTIONS = [
  { value: 'pending', label: 'Mark Pending', icon: Clock, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
  { value: 'in-progress', label: 'In Progress', icon: RotateCcw, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
  { value: 'resolved', label: 'Mark Resolved', icon: CheckCircle, color: 'text-green-600 bg-green-50 hover:bg-green-100' },
  { value: 'rejected', label: 'Reject', icon: XCircle, color: 'text-red-600 bg-red-50 hover:bg-red-100' },
];

export default function WardenComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', category: '', priority: '' });
  const [updating, setUpdating] = useState(null);
  const [comments, setComments] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getComplaints(filters);
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filters]);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id + status);
    try {
      const res = await api.updateStatus(id, { status, wardenComment: comments[id] || '' });
      setComplaints(complaints.map(c => c.id === id ? res.data : c));
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed');
    } finally {
      setUpdating(null);
    }
  };

  const counts = {
    all: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    'in-progress': complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">All Complaints</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage and respond to student complaints</p>
      </div>

      {/* Quick filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[['', 'All', counts.all], ['pending', 'Pending', counts.pending], ['in-progress', 'In Progress', counts['in-progress']], ['resolved', 'Resolved', counts.resolved]].map(([val, label, count]) => (
          <button
            key={val}
            onClick={() => setFilters({ ...filters, status: val })}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filters.status === val ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${filters.status === val ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input className="input pl-9" placeholder="Search by student, title..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
          </div>
          <select className="input" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input" value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">All Priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div></div>
      ) : complaints.length === 0 ? (
        <div className="card text-center py-16">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No complaints found</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map(c => (
            <div key={c.id} className="card p-0 overflow-hidden">
              <div
                className="flex items-start gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              >
                <span className="text-2xl mt-0.5">{CATEGORY_ICONS[c.category] || '📋'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{c.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {c.studentName} • Room {c.roomNumber} • {c.rollNumber} • {c.hostel}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={c.status} />
                      {expanded === c.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-gray-400">{c.category}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <PriorityBadge priority={c.priority} />
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {expanded === c.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</p>
                    <p className="text-sm text-gray-700">{c.description}</p>
                  </div>

                  {c.wardenComment && (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                      <p className="text-xs font-semibold text-purple-800 mb-1">Previous Response:</p>
                      <p className="text-sm text-purple-700">{c.wardenComment}</p>
                    </div>
                  )}

                  {/* Warden response textarea */}
                  <div>
                    <label className="label">Add/Update Response</label>
                    <textarea
                      className="input resize-none"
                      rows={2}
                      placeholder="Add a response or comment for the student..."
                      value={comments[c.id] || ''}
                      onChange={e => setComments({ ...comments, [c.id]: e.target.value })}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    {STATUS_ACTIONS.filter(a => a.value !== c.status).map(({ value, label, icon: Icon, color }) => (
                      <button
                        key={value}
                        onClick={() => handleStatusUpdate(c.id, value)}
                        disabled={updating === c.id + value}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${color}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {updating === c.id + value ? 'Updating...' : label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
