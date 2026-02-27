import { useState, useEffect } from 'react';
import Layout from '../../components/shared/Layout';
import { api } from '../../hooks/api';
import { Bell } from 'lucide-react';

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnnouncements()
      .then(res => setAnnouncements(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
        <p className="text-sm text-gray-500 mt-0.5">Important notices from hostel administration</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : announcements.length === 0 ? (
        <div className="card text-center py-16">
          <Bell className="w-16 h-16 mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No announcements</h3>
          <p className="text-gray-500 mt-1">Check back later for updates from your warden</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a, i) => (
            <div key={a.id} className={`card border-l-4 ${i === 0 ? 'border-l-blue-500' : 'border-l-gray-200'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Bell className={`w-5 h-5 ${i === 0 ? 'text-blue-600' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{a.message}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span>By {a.createdByName}</span>
                      <span>•</span>
                      <span>{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      {a.hostel !== 'All' && <span>• {a.hostel}</span>}
                    </div>
                  </div>
                </div>
                {i === 0 && <span className="flex-shrink-0 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">Latest</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
