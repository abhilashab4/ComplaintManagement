import { useState, useEffect } from 'react';
import Layout from '../../components/shared/Layout';
import { api } from '../../hooks/api';
import { Bell, Plus, X, AlertCircle } from 'lucide-react';

export default function WardenAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', hostel: 'All' });
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.getAnnouncements()
      .then(res => setAnnouncements(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPosting(true);
    try {
      await api.createAnnouncement(form);
      setForm({ title: '', message: '', hostel: 'All' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
          <p className="text-sm text-gray-500 mt-0.5">Post notices and updates for students</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Announcement'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card mb-6 border-2 border-purple-100">
          <h3 className="font-semibold text-gray-900 mb-4">Create Announcement</h3>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Title *</label>
              <input className="input" placeholder="Announcement title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="label">Message *</label>
              <textarea className="input resize-none" rows={4} placeholder="Write your announcement here..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="label">Target Hostel</label>
                <select className="input" value={form.hostel} onChange={e => setForm({ ...form, hostel: e.target.value })}>
                  <option value="All">All Blocks</option>
                  <option>Block A</option>
                  <option>Block B</option>
                  <option>Block C</option>
                  <option>Block D</option>
                </select>
              </div>
              <button type="submit" className="btn-primary px-6 py-2.5 mt-5" disabled={posting}>
                {posting ? 'Posting...' : 'Post Announcement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div></div>
      ) : announcements.length === 0 ? (
        <div className="card text-center py-16">
          <Bell className="w-16 h-16 mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No announcements yet</h3>
          <p className="text-gray-500 mt-1">Post your first announcement</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a, i) => (
            <div key={a.id} className="card">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-purple-100' : 'bg-gray-100'}`}>
                  <Bell className={`w-5 h-5 ${i === 0 ? 'text-purple-600' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {i === 0 && <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-0.5 rounded-full">Latest</span>}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a.hostel}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Posted by {a.createdByName} • {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
