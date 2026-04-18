import axios from 'axios';

const api = axios.create({
  // This is the key! It switches from your local laptop to 
  // your Render backend automatically.
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
});

// This attaches your JWT token to every request 
api.interceptors.request.use((config) => {
  // Use 'token' or 'access_token' depending on what you named it in your Login code
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;