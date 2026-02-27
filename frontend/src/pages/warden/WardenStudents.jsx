import { useState, useEffect } from 'react';
import Layout from '../../components/shared/Layout';
import { api } from '../../hooks/api';
import { Users, Search, Home, BookOpen } from 'lucide-react';

export default function WardenStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getStudents()
      .then(res => setStudents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    s.roomNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Students</h2>
        <p className="text-sm text-gray-500 mt-0.5">{students.length} students registered</p>
      </div>

      <div className="card mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input className="input pl-9" placeholder="Search by name, roll number, room..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                  <p className="text-xs text-gray-500 truncate">{s.email}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                    <BookOpen className="w-3 h-3" /> Roll No.
                  </div>
                  <p className="font-medium text-sm text-gray-800">{s.rollNumber || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                    <Home className="w-3 h-3" /> Room
                  </div>
                  <p className="font-medium text-sm text-gray-800">{s.roomNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-2 bg-purple-50 rounded-lg px-3 py-1.5 text-xs text-purple-700 font-medium">
                {s.hostel}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16">
              <Users className="w-12 h-12 mx-auto text-gray-200 mb-3" />
              <p className="text-gray-500">No students found</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
