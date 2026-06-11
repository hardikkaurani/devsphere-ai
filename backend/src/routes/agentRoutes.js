const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const rateLimit = require('express-rate-limit');

const multer = require('multer');
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

const {
  chatWithAgent,
  getUserSessions,
  getSessionMessages,
  renameSession,
  deleteSession,
  getChatStats,
  getResumeReview
} = require('../controllers/agentController');

// 20 messages/minute per user rate limiter
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  keyGenerator: (req) => req.user?.id || req.ip,
  validate: { keyGeneratorIpFallback: false },
  message: {
    success: false,
    message: 'You have exceeded the limit of 20 messages per minute. Please wait before sending more.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const validateRequest = require('../middleware/validateRequest');
const { chatSchema, renameSessionSchema } = require('../utils/validationSchemas');

// Apply authentication to all agent routes
router.use(authMiddleware);

// 💬 Chat (with 20 messages/minute rate limiting per user and Joi validation)
router.post('/chat', chatLimiter, validateRequest(chatSchema), chatWithAgent);

// 📂 Get all sessions
router.get('/sessions', getUserSessions);

// 📊 Get chat analytics stats
router.get('/stats', getChatStats);

// 📨 Get messages of one session
router.get('/messages/:sessionId', getSessionMessages);

// ✏️ Rename session (with Joi validation)
router.put('/sessions/:sessionId', validateRequest(renameSessionSchema), renameSession);

// 🗑 Delete session
router.delete('/sessions/:sessionId', deleteSession);

// 📄 Review uploaded PDF resume (5MB limit)
router.post('/resume/review', upload.single('resume'), getResumeReview);

module.exports = router;
