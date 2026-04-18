import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "./components/theme-provider"

// ── AXIOS SECURITY INTERCEPTOR ──
// This ensures that if your token expires or is deleted in Atlas, 
// the app automatically kicks you back to the login page.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="manit-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
)