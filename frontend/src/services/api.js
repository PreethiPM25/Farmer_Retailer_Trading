import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const adminAPI = {
  getPendingUsers: () => api.get('/admin/pending-users'),
  approveUser: (userId) => api.post(`/admin/approve/${userId}`),
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
};

export const userAPI = {
  getDashboard: (email) => api.get(`/user/dashboard/${email}`),
};

export default api;
