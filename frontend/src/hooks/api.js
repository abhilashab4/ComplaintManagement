import axios from 'axios';

export const api = {
  // Complaints
  getComplaints: (params) => axios.get('/api/complaints', { params }),
  getComplaint: (id) => axios.get(`/api/complaints/${id}`),
  createComplaint: (data) => axios.post('/api/complaints', data),
  updateStatus: (id, data) => axios.patch(`/api/complaints/${id}/status`, data),
  deleteComplaint: (id) => axios.delete(`/api/complaints/${id}`),
  getStats: () => axios.get('/api/complaints/stats/overview'),

  // Announcements
  getAnnouncements: () => axios.get('/api/complaints/announcements/all'),
  createAnnouncement: (data) => axios.post('/api/complaints/announcements', data),

  // Users
  getStudents: () => axios.get('/api/users/students'),
  getProfile: () => axios.get('/api/users/profile'),
};

export const CATEGORIES = ['Plumbing', 'Electrical', 'Cleanliness', 'Food', 'Security', 'Internet', 'Furniture', 'Other'];
export const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
export const STATUSES = ['pending', 'in-progress', 'resolved', 'rejected'];

export const STATUS_COLORS = {
  'pending': 'badge-pending',
  'in-progress': 'badge-in-progress',
  'resolved': 'badge-resolved',
  'rejected': 'badge-rejected',
};

export const PRIORITY_COLORS = {
  'low': 'bg-gray-100 text-gray-700',
  'medium': 'bg-yellow-100 text-yellow-700',
  'high': 'bg-orange-100 text-orange-700',
  'urgent': 'bg-red-100 text-red-700',
};

export const CATEGORY_ICONS = {
  'Plumbing': '🔧',
  'Electrical': '⚡',
  'Cleanliness': '🧹',
  'Food': '🍽️',
  'Security': '🔒',
  'Internet': '📶',
  'Furniture': '🪑',
  'Other': '📋',
};
