/**
 * API Service
 * Handles all HTTP requests to the backend API
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  register: (userData) => api.post('/api/register', userData),
  login: (credentials) => api.post('/api/login', credentials),
  getProfile: () => api.get('/api/profile'),
};

// Vaccination APIs
export const vaccineAPI = {
  createRequest: (requestData) => api.post('/api/vaccine-request', requestData),
  getStatus: () => api.get('/api/vaccine-status'),
  getAllRequests: (params) => api.get('/api/vaccine-requests', { params }),
  updateRequest: (id, updateData) => api.put(`/api/vaccine-request/${id}`, updateData),
};

// ML APIs
export const mlAPI = {
  verifyFace: (data) => api.post('/api/ml/verify-face', data),
  detectDeltoid: (data) => api.post('/api/ml/detect-deltoid', data),
};

// Camera APIs
export const cameraAPI = {
  getCameraInfo: () => api.get('/api/camera/info'),
  captureImage: () => api.post('/api/camera/capture'),
  verifyFaceWithCamera: (data) => api.post('/api/camera/verify-face', data),
  detectDeltoidWithCamera: (data) => api.post('/api/camera/detect-deltoid', data),
  checkMLHealth: () => api.get('/api/camera/ml-health'),
};

// Helper function to convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export default api;
