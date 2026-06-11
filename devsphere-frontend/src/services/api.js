import { API_ENDPOINTS, API_BASE_URL } from '../constants/apiEndpoints';

// Helper function to check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
};

// Helper function to get token and clear if expired
export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    return null;
  }
  return token;
};

// Centralized Fetch Wrapper with Auth, Expiry Check, and Error Handling
const authenticatedFetch = async (url, options = {}) => {
  const token = getToken();

  // If there was a token but it just expired, we throw session expired
  if (localStorage.getItem("token") && !token) {
    window.location.href = '/auth';
    throw new Error("Your session has expired. Please log in again.");
  }

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized globally
  if (response.status === 401) {
    localStorage.removeItem("token");
    // Redirect if it's not a pre-login / auth route
    if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
      window.location.href = '/auth';
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return data;
};

// ============================================
// 🔐 AUTHENTICATION
// ============================================

// Register User
export const register = async (email, password, name) => {
  try {
    const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, name })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}: ${res.statusText}`);
    }
    return data;
  } catch (err) {
    console.error("Register Error:", err.message);
    return { success: false, error: err.message };
  }
};

// Login User
export const login = async (email, password) => {
  try {
    const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}: ${res.statusText}`);
    }
    return data;
  } catch (err) {
    console.error("Login Fetch Error:", err.message);
    return { success: false, error: err.message };
  }
};

// ============================================
// 💬 AGENT & CHAT
// ============================================

// Send Message to AI (includes optional model selector)
export const sendMessage = async ({ agentType, message, sessionId, model }) => {
  try {
    const data = await authenticatedFetch(API_ENDPOINTS.AGENT.CHAT, {
      method: "POST",
      body: JSON.stringify({
        agentType,
        message,
        sessionId,
        model
      })
    });
    return { success: true, ...data };
  } catch (err) {
    console.error("Send Message Error:", err.message);
    return { success: false, error: err.message };
  }
};

// Get All Sessions
export const getSessions = async () => {
  try {
    const data = await authenticatedFetch(API_ENDPOINTS.AGENT.SESSIONS);
    return { success: true, ...data };
  } catch (err) {
    console.error("Get Sessions Error:", err.message);
    return { success: false, error: err.message };
  }
};

// Get Messages of One Session
export const getMessages = async (sessionId) => {
  try {
    const data = await authenticatedFetch(`${API_BASE_URL}/agent/messages/${sessionId}`);
    return { success: true, ...data };
  } catch (err) {
    console.error("Get Messages Error:", err.message);
    return { success: false, error: err.message };
  }
};

// Rename Session
export const renameSession = async (sessionId, title) => {
  try {
    const data = await authenticatedFetch(`${API_BASE_URL}/agent/sessions/${sessionId}`, {
      method: "PUT",
      body: JSON.stringify({ title })
    });
    return { success: true, ...data };
  } catch (err) {
    console.error("Rename Session Error:", err.message);
    return { success: false, error: err.message };
  }
};

// Delete Session
export const deleteSession = async (sessionId) => {
  try {
    const data = await authenticatedFetch(`${API_BASE_URL}/agent/sessions/${sessionId}`, {
      method: "DELETE"
    });
    return { success: true, ...data };
  } catch (err) {
    console.error("Delete Session Error:", err.message);
    return { success: false, error: err.message };
  }
};

// ============================================
// 👤 PROFILE
// ============================================

// Get Current User Profile
export const getCurrentProfile = async () => {
  try {
    const data = await authenticatedFetch(API_ENDPOINTS.PROFILE.GET_CURRENT);
    return { success: true, ...data };
  } catch (err) {
    console.error("Get Profile Error:", err.message);
    return { success: false, error: err.message };
  }
};

// Get User Profile by ID (does not enforce auth, but attaches token if present)
export const getUserProfile = async (userId) => {
  try {
    const data = await authenticatedFetch(API_ENDPOINTS.PROFILE.GET_USER(userId));
    return { success: true, ...data };
  } catch (err) {
    console.error("Get User Profile Error:", err.message);
    return { success: false, error: err.message };
  }
};

// Update User Profile
export const updateProfile = async (profileData) => {
  try {
    const data = await authenticatedFetch(API_ENDPOINTS.PROFILE.UPDATE, {
      method: "PUT",
      body: JSON.stringify(profileData)
    });
    return { success: true, ...data };
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    return { success: false, error: err.message };
  }
};

// Update User Avatar
export const updateAvatar = async (avatarUrl) => {
  try {
    const data = await authenticatedFetch(API_ENDPOINTS.PROFILE.UPDATE_AVATAR, {
      method: "PUT",
      body: JSON.stringify({ avatar: avatarUrl })
    });
    return { success: true, ...data };
  } catch (err) {
    console.error("Update Avatar Error:", err.message);
    return { success: false, error: err.message };
  }
};

// Change User Password
export const changePassword = async ({ currentPassword, newPassword }) => {
  try {
    const data = await authenticatedFetch(`${API_BASE_URL}/profile/me/password`, {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return { success: true, ...data };
  } catch (err) {
    console.error("Change Password Error:", err.message);
    return { success: false, error: err.message };
  }
};

// Get Profile Stats
export const getProfileStats = async () => {
  try {
    const data = await authenticatedFetch(API_ENDPOINTS.PROFILE.GET_STATS);
    return { success: true, ...data };
  } catch (err) {
    console.error("Get Profile Stats Error:", err.message);
    return { success: false, error: err.message };
  }
};

// Delete profile (schedule deletion)
export const deleteProfile = async () => {
  try {
    const data = await authenticatedFetch(API_ENDPOINTS.PROFILE.DELETE, {
      method: "DELETE"
    });
    return { success: true, ...data };
  } catch (err) {
    console.error("Delete Profile Error:", err.message);
    return { success: false, error: err.message };
  }
};

// Get Chat Analytics & Stats
export const getChatStats = async () => {
  try {
    const data = await authenticatedFetch(`${API_BASE_URL}/agent/stats`);
    return { success: true, ...data };
  } catch (err) {
    console.error("Get Chat Stats Error:", err.message);
    return { success: false, error: err.message };
  }
};

// Review PDF Resume (Mulitpart upload)
export const reviewResume = async (pdfFile, model = 'gemma:2b') => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("resume", pdfFile);
    formData.append("model", model);

    const response = await fetch(`${API_BASE_URL}/agent/resume/review`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to review resume");
    }
    return { success: true, ...data };
  } catch (err) {
    console.error("Review Resume Error:", err.message);
    return { success: false, error: err.message };
  }
};