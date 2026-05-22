import axios from 'axios';

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL;
  if (url) {
    if (url.startsWith('VITE_API_URL=')) {
      url = url.replace('VITE_API_URL=', '');
    }
    const cleanUrl = url.replace(/\/$/, '');
    if (!cleanUrl.endsWith('/api')) {
      url = cleanUrl + '/api';
    } else {
      url = cleanUrl;
    }
    return url;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.origin + '/api';
  }
  return 'http://localhost:5000/api';
};



const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically append auth JWT token
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

// Response interceptor to format error payloads
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Standardize error message formats
    const errMessage = error.response?.data?.message || 'Network communication error occurred';
    return Promise.reject(new Error(errMessage));
  }
);

export default api;
