const mongoose = require("mongoose")
const AgentSession = require("../models/AgentSession")
const Message = require("../models/Message")
const { runAgent } = require("../services/agentEngine")

// 💬 CHAT WITH AGENT
exports.chatWithAgent = async (req, res) => {
  try {
    const { agentType = "default", message, sessionId } = req.body

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      })
    }

    let session

    // If sessionId exists → validate + fetch
    if (sessionId) {

      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid session ID"
        })
      }

      session = await AgentSession.findById(sessionId)

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found"
        })
      }

    } else {

      const shortTitle = message.substring(0, 30)

      session = await AgentSession.create({
        agentType,
        title: shortTitle
      })
    }

    // Save user message
    await Message.create({
      session: session._id,
      role: "user",
      content: message
    })

    // ⚡ PERFORMANCE OPTIMIZATION
    // Instead of fetching entire history every time,
    // only send last 6 messages to AI
    const previousMessages = await Message.find({
      session: session._id
    })
      .sort({ createdAt: -1 })
      .limit(6)

    const formattedMessages = previousMessages
      .reverse()
      .map(m => ({
        role: m.role,
        content: m.content
      }))

    // Run AI
    const aiReply = await runAgent(agentType, formattedMessages)

    // Save AI reply
    await Message.create({
      session: session._id,
      role: "assistant",
      content: aiReply
    })

    return res.status(200).json({
      success: true,
      sessionId: session._id,
      reply: aiReply
    })

  } catch (err) {
    console.error("CHAT ERROR:", err.message)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}


// 📂 GET ALL SESSIONS
exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await AgentSession.find()
      .sort({ createdAt: -1 })
      .lean()

    return res.status(200).json({
      success: true,
      sessions
    })

  } catch (err) {
    console.error("SESSION ERROR:", err.message)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}


// 📨 GET MESSAGES BY SESSION
exports.getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID"
      })
    }

    const messages = await Message.find({ session: sessionId })
      .sort({ createdAt: 1 })
      .lean()

    return res.status(200).json({
      success: true,
      messages
    })

  } catch (err) {
    console.error("MESSAGE ERROR:", err.message)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}


// ✏️ RENAME SESSION
exports.renameSession = async (req, res) => {
  try {
    const { sessionId } = req.params
    const { title } = req.body

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID"
      })
    }

    const session = await AgentSession.findByIdAndUpdate(
      sessionId,
      { title },
      { new: true }
    )

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      })
    }

    return res.status(200).json({
      success: true,
      session
    })

  } catch (err) {
    console.error("RENAME ERROR:", err.message)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}


// 🗑 DELETE SESSION
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID"
      })
    }

    await Message.deleteMany({ session: sessionId })
    await AgentSession.findByIdAndDelete(sessionId)

    return res.status(200).json({
      success: true,
      message: "Session deleted"
    })

  } catch (err) {
    console.error("DELETE ERROR:", err.message)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}