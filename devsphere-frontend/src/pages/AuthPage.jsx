import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login, register } from '../services/api';
import Button from '../components/ui/Button';
import MainLayout from '../components/layout/MainLayout';
import AnimatedBackground from '../components/animations/AnimatedBackground';

/**
 * Authentication Page
 * Login and Registration
 */

function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      let response;
      if (isLogin) {
        response = await login(formData.email, formData.password);
      } else {
        response = await register(formData.email, formData.password, formData.name);
        if (response.message) {
          // Registration successful, now login
          response = await login(formData.email, formData.password);
        }
      }

      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      } else if (response.message) {
        setError(response.message);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout showBg={true}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Join DevSphere AI'}
              </h1>
              <p className="text-slate-400">
                {isLogin
                  ? 'Sign in to your account to continue'
                  : 'Create an account to get started'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field (only for registration) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    required={!isLogin}
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading
                  ? isLogin
                    ? 'Signing in...'
                    : 'Creating account...'
                  : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            {/* Demo Credentials */}
            {isLogin && (
              <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                <p className="text-slate-400 text-xs font-semibold mb-2">Demo Credentials:</p>
                <p className="text-slate-400 text-xs">
                  Email: <span className="text-slate-300">test@example.com</span>
                </p>
                <p className="text-slate-400 text-xs">
                  Password: <span className="text-slate-300">test123</span>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}

export default AuthPage;
