import axios from 'axios';

// URL dapre anvironman an
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

console.log('API URL:', API_URL); // Pou debug

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... rès kòd la rete menm jan

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Transaction API
export const transactionAPI = {
  getAll: () => api.get('/transactions'),
  create: (transactionData) => api.post('/transactions', transactionData),
  update: (id, transactionData) => api.put(`/transactions/${id}`, transactionData),
  delete: (id) => api.delete(`/transactions/${id}`),
};

export default api;