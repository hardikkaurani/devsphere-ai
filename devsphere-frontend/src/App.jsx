import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';

// Helper function to check if user is authenticated and token is not expired
const isUserAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return true;
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem('token');
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem('token');
    return false;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(isUserAuthenticated());

  useEffect(() => {
    // Listen for storage changes (token added/removed in other tabs)
    const handleStorageChange = () => {
      setIsAuthenticated(isUserAuthenticated());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            borderColor: '#334155',
            borderRadius: '12px',
            fontSize: '14px'
          }
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" />}
        />
      </Routes>
    </>
  );
}

export default App;
