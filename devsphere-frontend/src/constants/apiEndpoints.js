/**
 * API Endpoints Configuration
 * Centralized API route management
 * Uses environment variables for security and flexibility
 */

const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

// Get API base URL from environment variable with safe deploy/local fallbacks.
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return trimTrailingSlash(envUrl);
  }

  if (import.meta.env.PROD) {
    return 'https://devsphere-api.onrender.com/api/v1';
  }

  return 'http://localhost:5000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

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
  },
  PROFILE: {
    GET_CURRENT: `${API_BASE_URL}/profile/me`,
    GET_USER: (userId) => `${API_BASE_URL}/profile/${userId}`,
    UPDATE: `${API_BASE_URL}/profile/me`,
    UPDATE_AVATAR: `${API_BASE_URL}/profile/me/avatar`,
    GET_STATS: `${API_BASE_URL}/profile/me/stats`,
    DELETE: `${API_BASE_URL}/profile/me`
  }
};
