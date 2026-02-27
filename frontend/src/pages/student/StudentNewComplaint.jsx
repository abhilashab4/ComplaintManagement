import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/shared/Layout';
import { api, CATEGORIES, PRIORITIES, CATEGORY_ICONS } from '../../hooks/api';
import { AlertCircle, Send, ArrowLeft } from 'lucide-react';

export default function StudentNewComplaint() {
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'medium' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.createComplaint(form);
      setSuccess(true);
      setTimeout(() => navigate('/student/complaints'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto text-center py-20">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Submitted!</h2>
          <p className="text-gray-500">Your complaint has been filed successfully. Redirecting...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-1">File a Complaint</h2>
          <p className="text-sm text-gray-500 mb-6">Describe your issue and we'll address it as soon as possible.</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Category *</label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat })}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                      form.category === cat
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                    }`}
                  >
                    <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Complaint Title *</label>
              <input
                className="input"
                placeholder="Brief description of the issue"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                maxLength={100}
              />
              <p className="text-xs text-gray-400 mt-1">{form.title.length}/100 characters</p>
            </div>

            <div>
              <label className="label">Detailed Description *</label>
              <textarea
                className="input resize-none"
                rows={4}
                placeholder="Describe the issue in detail, including when it started, how it affects you, etc."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
                minLength={20}
              />
            </div>

            <div>
              <label className="label">Priority Level</label>
              <div className="grid grid-cols-4 gap-2">
                {PRIORITIES.map(p => {
                  const colors = { low: 'border-gray-400 bg-gray-50 text-gray-700', medium: 'border-yellow-400 bg-yellow-50 text-yellow-700', high: 'border-orange-400 bg-orange-50 text-orange-700', urgent: 'border-red-500 bg-red-50 text-red-700' };
                  const activeColors = { low: 'border-gray-500 bg-gray-100', medium: 'border-yellow-500 bg-yellow-100', high: 'border-orange-500 bg-orange-100', urgent: 'border-red-600 bg-red-100' };
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({ ...form, priority: p })}
                      className={`p-2 rounded-xl border-2 text-xs font-semibold uppercase transition-all ${
                        form.priority === p ? `${colors[p]} ${activeColors[p]}` : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2" disabled={loading || !form.category}>
              {loading ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Complaint</>}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
