import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ===== ZONES =====
export const fetchZones = (params = {}) => api.get('/zones', { params });
export const fetchZoneById = (id) => api.get(`/zones/${id}`);

// ===== ACCIDENTS =====
export const fetchAccidents = (params = {}) => api.get('/accidents', { params });
export const fetchAccidentById = (id) => api.get(`/accidents/${id}`);

// ===== STATS =====
export const fetchStats = () => api.get('/stats');
export const fetchTimeline = () => api.get('/stats/timeline');
export const fetchFilterOptions = () => api.get('/stats/filters');

// ===== EXPORT =====
export const exportCSV = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  window.open(`${API_BASE}/export/csv?${query}`, '_blank');
};

export const exportJSON = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  window.open(`${API_BASE}/export/json?${query}`, '_blank');
};

// ===== AUTH =====
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getProfile = () => api.get('/auth/profile');
export const logout = () => api.post('/auth/logout');

export default api;
