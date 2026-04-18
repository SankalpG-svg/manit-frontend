import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; 
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Public Faculty Directory (Homepage) */}
        <Route path="/" element={<HomePage />} />
        
        {/* 2. Login Page for existing faculty */}
        <Route path="/login" element={<Login />} />

        {/* 3. Registration Page for new faculty applications */}
        <Route path="/register" element={<Register />} />
        
        {/* 4. Admin Dashboard - PROTECTED & ADMIN ONLY */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* 5. Catch-all: Redirect unknown URLs back to Homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;