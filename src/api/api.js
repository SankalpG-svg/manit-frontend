// src/lib/api.js
import axios from 'axios'

// Vite uses import.meta.env to access environment variables.
// It will use VITE_API_URL from Vercel in production, 
// and fallback to your local server during development.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api