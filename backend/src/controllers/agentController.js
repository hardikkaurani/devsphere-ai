const mongoose = require('mongoose');
const AgentSession = require('../models/AgentSession');
const Message = require('../models/Message');
const aiService = require('../services/aiService');
const logger = require('../utils/logger');
const pdfParse = require('pdf-parse');

// Helper: Get or create session secured by user ID
const getOrCreateSession = async (sessionId, agentType, firstMessage, userId) => {
  if (sessionId) {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      const error = new Error('Invalid session ID');
      error.statusCode = 400;
      throw error;
    }

    const session = await AgentSession.findOne({ _id: sessionId, user: userId });
    if (!session) {
      const error = new Error('Session not found');
      error.statusCode = 404;
      throw error;
    }

    logger.info(`Using existing session: ${sessionId} for user: ${userId}`);
    return session;
  }

  const shortTitle = firstMessage.substring(0, 30);
  const newSession = await AgentSession.create({
    user: userId,
    agentType,
    title: shortTitle
  });
  logger.info(`Created new session: ${newSession._id} for user: ${userId} of agent type: ${agentType}`);
  return newSession;
};

// 💬 CHAT WITH AGENT
exports.chatWithAgent = async (req, res) => {
  try {
    const { agentType = 'general', message, sessionId, model, stream = false } = req.body;
    const userId = req.user.id;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const session = await getOrCreateSession(sessionId, agentType, message, userId);

    // Save user message
    await Message.create({
      session: session._id,
      role: 'user',
      content: message
    });

    // PERFORMANCE OPTIMIZATION
    // Send last 6 messages to AI for context
    const previousMessages = await Message.find({
      session: session._id
    })
      .sort({ createdAt: -1 })
      .limit(6);

    const formattedMessages = previousMessages
      .reverse()
      .map(m => ({
        role: m.role,
        content: m.content
      }));

    if (stream) {
      // Set headers for Server-Sent Events (SSE)
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      if (res.flushHeaders) {
        res.flushHeaders();
      }

      let fullReply = '';
      try {
        fullReply = await aiService.runAgentStream(
          agentType,
          formattedMessages,
          model,
          (chunk) => {
            res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
          }
        );

        // Save AI reply to database
        await Message.create({
          session: session._id,
          role: 'assistant',
          content: fullReply
        });

        // Send completion metadata
        res.write(`data: ${JSON.stringify({ sessionId: session._id, done: true })}\n\n`);
        res.end();
      } catch (streamErr) {
        logger.error('Streaming AI Error:', streamErr);
        res.write(`data: ${JSON.stringify({ error: streamErr.message })}\n\n`);
        res.end();
      }
    } else {
      // Run AI (non-streamed)
      const aiReply = await aiService.runAgent(agentType, formattedMessages, model);

      // Save AI reply
      await Message.create({
        session: session._id,
        role: 'assistant',
        content: aiReply
      });

      return res.status(200).json({
        success: true,
        sessionId: session._id,
        reply: aiReply
      });
    }

  } catch (err) {
    console.error('CHAT ERROR:', err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal Server Error'
    });
  }
};

// 📂 GET ALL SESSIONS FOR CURRENT USER
exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await AgentSession.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      sessions
    });

  } catch (err) {
    console.error('SESSION ERROR:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// 📨 GET MESSAGES BY SESSION (SECURED)
exports.getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session ID'
      });
    }

    // Secure check: verify session belongs to current user
    const session = await AgentSession.findOne({ _id: sessionId, user: req.user.id });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const messages = await Message.find({ session: sessionId })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      messages
    });

  } catch (err) {
    console.error('MESSAGE ERROR:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// ✏️ RENAME SESSION (SECURED)
exports.renameSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session ID'
      });
    }

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const trimmedTitle = title.trim().substring(0, 100);

    // Secure update: only allow owner to rename
    const session = await AgentSession.findOneAndUpdate(
      { _id: sessionId, user: req.user.id },
      { title: trimmedTitle },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    logger.info(`Session renamed: ${sessionId} to "${trimmedTitle}" by user: ${req.user.id}`);

    return res.status(200).json({
      success: true,
      session
    });

  } catch (err) {
    console.error('RENAME ERROR:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// 🗑 DELETE SESSION (SECURED)
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session ID'
      });
    }

    // Secure deletion check
    const session = await AgentSession.findOne({ _id: sessionId, user: req.user.id });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    await Message.deleteMany({ session: sessionId });
    await AgentSession.findByIdAndDelete(sessionId);

    logger.info(`Session ${sessionId} and all its messages deleted by user: ${req.user.id}`);

    return res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (err) {
    console.error('DELETE ERROR:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// 📊 GET CHAT ANALYTICS & STATS
exports.getChatStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all sessions for this user
    const sessions = await AgentSession.find({ user: userId }).lean();
    const totalSessions = sessions.length;
    const sessionIds = sessions.map(s => s._id);

    // Get total messages sent in those sessions
    const totalMessages = await Message.countDocuments({
      session: { $in: sessionIds }
    });

    // Breakdown usage by agentType
    const agentUsage = {
      general: sessions.filter(s => s.agentType === 'general').length,
      coding: sessions.filter(s => s.agentType === 'coding').length,
      resume: sessions.filter(s => s.agentType === 'resume').length
    };

    // Messages sent per day for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const messageTimeline = await Message.aggregate([
      {
        $match: {
          session: { $in: sessionIds },
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Build timeline data with zeroes for days without activity
    const timelineData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const match = messageTimeline.find(item => item._id === dateString);
      timelineData.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        messages: match ? match.count : 0
      });
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalSessions,
        totalMessages,
        agentUsage,
        timeline: timelineData
      }
    });

  } catch (err) {
    console.error('STATS ERROR:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// 📄 GET RESUME REVIEW (PDF PARSING & CRITIQUE)
exports.getResumeReview = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file'
      });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF resumes are supported'
      });
    }

    logger.info(`Extracting text from PDF resume: ${req.file.originalname}`);
    const parsedPdf = await pdfParse(req.file.buffer);
    const resumeText = parsedPdf.text;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Could not parse text from this PDF resume'
      });
    }

    // Create a new session for resume review
    const session = await AgentSession.create({
      user: userId,
      agentType: 'resume',
      title: `Resume Review: ${req.file.originalname.replace('.pdf', '')}`
    });

    // Save the upload message
    await Message.create({
      session: session._id,
      role: 'user',
      content: `Uploaded resume: ${req.file.originalname} for analysis.`
    });

    // Create review prompt for Ollama
    const resumePrompt = `Please critique the following resume text. Provide constructive feedback formatted in markdown. Include key strengths, formatting/ATS compatibility suggestions, grammatical improvement points, and detailed action points to make it stand out:\n\n${resumeText.substring(0, 10000)}`;

    logger.info('Sending parsed resume text to Ollama for analysis...');

    // Call Ollama non-streaming for the final structured response
    const selectedModel = req.body.model || 'gemma:2b';
    const critiqueText = await aiService.runAgent('resume', [{ role: 'user', content: resumePrompt }], selectedModel);

    // Save critique message in history
    const assistantMsg = await Message.create({
      session: session._id,
      role: 'assistant',
      content: critiqueText
    });

    return res.status(200).json({
      success: true,
      sessionId: session._id,
      message: 'Resume analyzed successfully',
      review: critiqueText,
      assistantMessageId: assistantMsg._id
    });

  } catch (err) {
    console.error('RESUME ERROR:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
