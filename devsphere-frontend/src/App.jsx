import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

// Helper function to check if user is authenticated
const isUserAuthenticated = () => !!localStorage.getItem('token');

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
    </Routes>
  );
}

export default App;
