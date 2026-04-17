import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        {/* We will add the Dashboard route next! */}
        <Route path="/dashboard" element={<div className="p-10 text-2xl">Welcome to your Dashboard!</div>} />
      </Routes>
    </Router>
  );
}

export default App;