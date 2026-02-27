import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', roomNumber: '', hostel: 'Block A', rollNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Hostel CMS</h1>
          <p className="text-blue-200 mt-1">Student Registration</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create your account</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Full Name</label>
                <input className="input" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="col-span-2">
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="col-span-2">
                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </div>
              <div>
                <label className="label">Roll Number</label>
                <input className="input" placeholder="CS2021001" value={form.rollNumber} onChange={e => setForm({ ...form, rollNumber: e.target.value })} required />
              </div>
              <div>
                <label className="label">Room Number</label>
                <input className="input" placeholder="A-204" value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} required />
              </div>
              <div className="col-span-2">
                <label className="label">Hostel Block</label>
                <select className="input" value={form.hostel} onChange={e => setForm({ ...form, hostel: e.target.value })}>
                  <option>Block A</option>
                  <option>Block B</option>
                  <option>Block C</option>
                  <option>Block D</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
