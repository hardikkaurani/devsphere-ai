/**
 * API Endpoints Configuration
 * Centralized API route management
 * Uses environment variables for security and flexibility
 */

// Get API base URL from environment variable with fallback for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export { API_BASE_URL };

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`
  },
  AGENT: {
    CHAT: `${API_BASE_URL}/agent/chat`,
    SESSIONS: `${API_BASE_URL}/agent/sessions`,
    HISTORY: `${API_BASE_URL}/agent/history`
  }
};
