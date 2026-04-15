import { API_ENDPOINTS, API_BASE_URL } from '../constants/apiEndpoints';

// Debug logging helper
const API_DEBUG = process.env.DEBUG === 'true' || localStorage.getItem('API_DEBUG');

const logApiCall = (method, endpoint, status = null, duration = null) => {
  if (!API_DEBUG) return;
  const timestamp = new Date().toISOString();
  if (status) {
    console.debug(`[${timestamp}] ${method} ${endpoint} → ${status} (${duration}ms)`);
  } else {
    console.debug(`[${timestamp}] ${method} ${endpoint}`);
  }
};

// ============================================
// 🔐 AUTHENTICATION
// ============================================

// Register User
export const register = async (email, password, name) => {
  const startTime = performance.now();
  logApiCall("POST", API_ENDPOINTS.AUTH.REGISTER);
  try {
    const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, name })
    })
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const duration = Math.round(performance.now() - startTime);
    logApiCall("POST", API_ENDPOINTS.AUTH.REGISTER, res.status, duration);
    return await res.json()
  } catch (err) {
    console.error("Register Error:", err.message)
    return { success: false, error: err.message }
  }
}

// Login User
export const login = async (email, password) => {
  const startTime = performance.now();
  logApiCall("POST", API_ENDPOINTS.AUTH.LOGIN);
  try {
    const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const duration = Math.round(performance.now() - startTime);
    logApiCall("POST", API_ENDPOINTS.AUTH.LOGIN, res.status, duration);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Login Fetch Error:", err.message)
    return { success: false, error: err.message }
  }
}

// ============================================
// 💬 AGENT & CHAT
// ============================================

// Send Message to AI
export const sendMessage = async ({ agentType, message, sessionId }) => {
  const startTime = performance.now();
  logApiCall("POST", API_ENDPOINTS.AGENT.CHAT);
  try {
    const token = localStorage.getItem("token")

    const res = await fetch(API_ENDPOINTS.AGENT.CHAT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        agentType,
        message,
        sessionId
      })
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const duration = Math.round(performance.now() - startTime);
    logApiCall("POST", API_ENDPOINTS.AGENT.CHAT, res.status, duration);
    return await res.json()

  } catch (err) {
    console.error("Send Message Error:", err.message)
    return { success: false, error: err.message }
  }
}

// Get All Sessions
export const getSessions = async () => {
  const startTime = performance.now();
  logApiCall("GET", API_ENDPOINTS.AGENT.SESSIONS);
  try {
    const token = localStorage.getItem("token")

    const res = await fetch(API_ENDPOINTS.AGENT.SESSIONS, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const duration = Math.round(performance.now() - startTime);
    logApiCall("GET", API_ENDPOINTS.AGENT.SESSIONS, res.status, duration);
    return await res.json()

  } catch (err) {
    console.error("Get Sessions Error:", err.message)
    return { success: false, error: err.message }
  }
}

// Get Messages of One Session
export const getMessages = async (sessionId) => {
  try {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_BASE_URL}/agent/messages/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return await res.json()

  } catch (err) {
    console.error("Get Messages Error:", err)
    return { success: false }
  }
}

// Rename Session
export const renameSession = async (sessionId, title) => {
  const startTime = performance.now();
  logApiCall("PUT", `${API_BASE_URL}/agent/sessions/${sessionId}`);
  try {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_BASE_URL}/agent/sessions/${sessionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const duration = Math.round(performance.now() - startTime);
    logApiCall("PUT", `${API_BASE_URL}/agent/sessions/${sessionId}`, res.status, duration);
    return await res.json()

  } catch (err) {
    console.error("Rename Session Error:", err)
    return { success: false, error: err.message }
  }
}

// Delete Session
export const deleteSession = async (sessionId) => {
  const startTime = performance.now();
  logApiCall("DELETE", `${API_BASE_URL}/agent/sessions/${sessionId}`);
  try {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_BASE_URL}/agent/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const duration = Math.round(performance.now() - startTime);
    logApiCall("DELETE", `${API_BASE_URL}/agent/sessions/${sessionId}`, res.status, duration);
    return await res.json()

  } catch (err) {
    console.error("Delete Session Error:", err)
    return { success: false, error: err.message }
  }
}