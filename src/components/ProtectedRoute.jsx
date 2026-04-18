import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token');

  // 1. If no token exists, they aren't logged in at all
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // 2. Decode the token to see the user's details
    const decoded = jwtDecode(token);
    
    // 3. Check for Admin Access
    // If the page requires Admin (adminOnly={true}) but the user is NOT an admin
    if (adminOnly && decoded.role !== 'admin') {
      console.warn("Access denied: User is not an admin");
      return <Navigate to="/" replace />; // Kick them back to the homepage
    }

    // 4. Token is valid and user has the right role
    return children;
    
  } catch (error) {
    // If the token is corrupted or invalid, clear it and send to login
    console.error("Invalid Token:", error);
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
}