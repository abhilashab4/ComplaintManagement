import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/shared/Layout';
import { api, CATEGORIES, STATUSES, PRIORITIES, CATEGORY_ICONS } from '../../hooks/api';
import { StatusBadge, PriorityBadge } from '../../components/shared/Badges';
import { Plus, Search, Trash2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

export default function StudentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', category: '', priority: '' });
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
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

  const handleDelete = async (id) => {
    try {
      await api.deleteComplaint(id);
      setComplaints(complaints.filter(c => c.id !== id));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Complaints</h2>
          <p className="text-sm text-gray-500 mt-0.5">{complaints.length} complaints found</p>
        </div>
        <Link to="/student/complaints/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Complaint
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input className="input pl-9" placeholder="Search complaints..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
          </div>
          <select className="input" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
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
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : complaints.length === 0 ? (
        <div className="card text-center py-16">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No complaints found</h3>
          <p className="text-gray-500 mt-1 mb-4">File a complaint to get started</p>
          <Link to="/student/complaints/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> File Complaint
          </Link>
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
                    <p className="font-semibold text-gray-900">{c.title}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={c.status} />
                      {expanded === c.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{c.category}</span>
                    <span>•</span>
                    <PriorityBadge priority={c.priority} />
                    <span>•</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {expanded === c.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <p className="text-sm text-gray-700 mb-3">{c.description}</p>
                  {c.wardenComment && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-blue-800 mb-1">🎓 Warden's Response:</p>
                      <p className="text-sm text-blue-700">{c.wardenComment}</p>
                    </div>
                  )}
                  {c.resolvedAt && (
                    <p className="text-xs text-green-600 mb-3">✅ Resolved on {new Date(c.resolvedAt).toLocaleDateString()}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Filed on {new Date(c.createdAt).toLocaleString()}</p>
                    {c.status === 'pending' && (
                      deleteId === c.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Sure?</span>
                          <button onClick={() => handleDelete(c.id)} className="text-xs bg-red-600 text-white px-3 py-1 rounded-lg">Delete</button>
                          <button onClick={() => setDeleteId(null)} className="text-xs btn-secondary py-1">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteId(c.id)} className="btn-danger flex items-center gap-1 text-xs py-1.5">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      )
                    )}
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
