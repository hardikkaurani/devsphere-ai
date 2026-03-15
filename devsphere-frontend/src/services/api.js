const API_URL = "http://localhost:5000/api/v1"

// ============================================
// 🔐 AUTHENTICATION
// ============================================

// Register User
export const register = async (email, password, name) => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, name })
    })
    return await res.json()
  } catch (err) {
    console.error("Register Error:", err)
    return { success: false }
  }
}

// Login User
export const login = async (email, password) => {
  try {
    console.log('🔗 Calling API:', `${API_URL}/auth/login`);
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
    console.log('📡 Response status:', res.status, res.statusText);
    const data = await res.json()
    console.log('📦 Response data:', data);
    return data
  } catch (err) {
    console.error("Login Fetch Error:", err)
    return { success: false, error: err.message }
  }
}

// ============================================
// 💬 AGENT & CHAT
// ============================================

// Send Message to AI
export const sendMessage = async ({ agentType, message, sessionId }) => {
  try {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/agent/chat`, {
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

    return await res.json()

  } catch (err) {
    console.error("Send Message Error:", err)
    return { success: false }
  }
}

// Get All Sessions
export const getSessions = async () => {
  try {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/agent/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return await res.json()

  } catch (err) {
    console.error("Get Sessions Error:", err)
    return { success: false }
  }
}

// Get Messages of One Session
export const getMessages = async (sessionId) => {
  try {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/agent/messages/${sessionId}`, {
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
  try {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/agent/sessions/${sessionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    })

    return await res.json()

  } catch (err) {
    console.error("Rename Session Error:", err)
    return { success: false }
  }
}

// Delete Session
export const deleteSession = async (sessionId) => {
  try {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/agent/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return await res.json()

  } catch (err) {
    console.error("Delete Session Error:", err)
    return { success: false }
  }
}