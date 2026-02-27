import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'warden' ? '/warden' : '/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (email, password) => {
    setForm({ email, password });
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'warden' ? '/warden' : '/student');
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Hostel CMS</h1>
          <p className="text-blue-200 mt-1">Complaint Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  className="input pl-9"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pl-9 pr-9"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">Register here</Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-3 font-medium uppercase tracking-wide">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => demoLogin('warden@hostel.com', 'warden123')}
                className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-lg transition-colors font-medium"
              >
                🎓 Warden Login
              </button>
              <button
                onClick={() => demoLogin('student@hostel.com', 'student123')}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition-colors font-medium"
              >
                📚 Student Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
