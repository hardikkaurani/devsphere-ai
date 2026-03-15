const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")

const {
  chatWithAgent,
  getUserSessions,
  getSessionMessages,
  renameSession,
  deleteSession
} = require("../controllers/agentController")

// Apply authentication to all agent routes
router.use(authMiddleware)

// 💬 Chat
router.post("/chat", chatWithAgent)

// 📂 Get all sessions
router.get("/sessions", getUserSessions)

// 📨 Get messages of one session
router.get("/messages/:sessionId", getSessionMessages)

// ✏️ Rename session
router.put("/sessions/:sessionId", renameSession)

// 🗑 Delete session
router.delete("/sessions/:sessionId", deleteSession)

module.exports = router