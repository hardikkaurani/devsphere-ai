/**
 * SMS Rate Limiting Middleware
 * Prevents abuse of SMS endpoints
 */

const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Rate limiter for single SMS processing (generous)
const smsProcessLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 SMS per minute per user
  keyGenerator: (req, res) => req.user._id.toString(),
  handler: (req, res) => {
    logger.warn('SMS process rate limit exceeded', { userId: req.user._id });
    res.status(429).json({
      success: false,
      message: 'Too many SMS processing requests. Max 30 per minute.',
      retryAfter: req.rateLimit.resetTime
    });
  },
  skip: (req) => !req.user, // Skip if no user
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter for batch processing (strict)
const smsBatchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 batch requests per 5 minutes
  keyGenerator: (req, res) => req.user._id.toString(),
  handler: (req, res) => {
    logger.warn('SMS batch rate limit exceeded', { userId: req.user._id });
    res.status(429).json({
      success: false,
      message: 'Too many batch requests. Max 10 per 5 minutes.',
      retryAfter: req.rateLimit.resetTime
    });
  },
  skip: (req) => !req.user,
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter for list endpoint (moderate)
const smsListLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 list requests per minute
  keyGenerator: (req, res) => req.user._id.toString(),
  handler: (req, res) => {
    logger.warn('SMS list rate limit exceeded', { userId: req.user._id });
    res.status(429).json({
      success: false,
      message: 'Too many requests. Max 60 per minute.'
    });
  },
  skip: (req) => !req.user,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  smsProcessLimiter,
  smsBatchLimiter,
  smsListLimiter
};
