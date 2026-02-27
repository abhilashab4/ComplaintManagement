import axios from 'axios';

// Axios instance for all API calls
const axiosInstance = axios.create({
  baseURL: '/',       // Nginx will proxy /api/ to backend
  withCredentials: true, // if backend uses cookies
});

// Automatically attach token from localStorage to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const api = {
  // Complaints
  getComplaints: (params) => axiosInstance.get('/api/complaints', { params }),
  getComplaint: (id) => axiosInstance.get(`/api/complaints/${id}`),
  createComplaint: (data) => axiosInstance.post('/api/complaints', data),
  updateStatus: (id, data) => axiosInstance.patch(`/api/complaints/${id}/status`, data),
  deleteComplaint: (id) => axiosInstance.delete(`/api/complaints/${id}`),
  getStats: () => axiosInstance.get('/api/complaints/stats/overview'),

  // Announcements
  getAnnouncements: () => axiosInstance.get('/api/complaints/announcements/all'),
  createAnnouncement: (data) => axiosInstance.post('/api/complaints/announcements', data),

  // Users
  getStudents: () => axiosInstance.get('/api/users/students'),
  getProfile: () => axiosInstance.get('/api/users/profile'),
};

// Constants
export const CATEGORIES = ['Plumbing','Electrical','Cleanliness','Food','Security','Internet','Furniture','Other'];
export const PRIORITIES = ['low','medium','high','urgent'];
export const STATUSES = ['pending','in-progress','resolved','rejected'];

export const STATUS_COLORS = {
  pending: 'badge-pending',
  'in-progress': 'badge-in-progress',
  resolved: 'badge-resolved',
  rejected: 'badge-rejected',
};

export const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export const CATEGORY_ICONS = {
  Plumbing: '🔧',
  Electrical: '⚡',
  Cleanliness: '🧹',
  Food: '🍽️',
  Security: '🔒',
  Internet: '📶',
  Furniture: '🪑',
  Other: '📋',
};

export default axiosInstance;