import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';

    // Don't show toast for auth errors (handled in components)
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    // Redirect to login on 401
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
  forgotPassword: (email) => api.post('/api/auth/forgot', { email }),
  resetPassword: (token, password) => api.post('/api/auth/reset', { token, password }),
  logout: () => api.post('/api/auth/logout'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/api/users/me'),
  updateProfile: (data) => api.put('/api/users/me', data),
};

// Expense API
export const expenseAPI = {
  getExpenses: (params) => api.get('/api/expenses', { params }),
  getExpense: (id) => api.get(`/api/expenses/${id}`),
  createExpense: (data) => api.post('/api/expenses', data),
  updateExpense: (id, data) => api.put(`/api/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/api/expenses/${id}`),
};

// Income API
export const incomeAPI = {
  getIncomes: (params) => api.get('/api/incomes', { params }),
  getIncome: (id) => api.get(`/api/incomes/${id}`),
  createIncome: (data) => api.post('/api/incomes', data),
  updateIncome: (id, data) => api.put(`/api/incomes/${id}`, data),
  deleteIncome: (id) => api.delete(`/api/incomes/${id}`),
};

// Reports API
export const reportAPI = {
  getMonthlyReport: (month, year) => api.get('/api/reports/monthly', { params: { month, year } }),
  getComparison: () => api.get('/api/reports/comparison'),
  exportReport: (format) => api.get('/api/reports/export', { params: { format } }),
};

// Settings API
export const settingsAPI = {
  getSettings: () => api.get('/api/settings'),
  updateSettings: (data) => api.put('/api/settings', data),
};

export default api;
