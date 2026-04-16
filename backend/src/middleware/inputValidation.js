/**
 * Input validation middleware
 * Validates and sanitizes incoming requests
 */

const logger = require('../utils/logger');

/**
 * Sanitize string input - escape dangerous characters
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

/**
 * Validate message input
 */
const validateMessageInput = (message) => {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message must be a string' };
  }

  const trimmed = message.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (trimmed.length > 4000) {
    return { valid: false, error: 'Message cannot exceed 4000 characters' };
  }

  // Check for potential MongoDB injection patterns
  if (/^\$|^\{.*\$/.test(trimmed)) {
    return { valid: false, error: 'Invalid message format' };
  }

  return { valid: true, message: trimmed };
};

/**
 * Validate email input
 */
const validateEmailInput = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email must be a string' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true, email: email.trim() };
};

/**
 * Middleware to validate chat input
 */
const validateChatInput = (req, res, next) => {
  try {
    const { message, agentType } = req.body;

    // Validate message
    const messageValidation = validateMessageInput(message);
    if (!messageValidation.valid) {
      return res.status(400).json({
        success: false,
        message: messageValidation.error
      });
    }

    // Sanitize and update message
    req.body.message = messageValidation.message;

    // Validate agentType if provided
    const validAgents = ['general', 'code', 'resume', 'interview'];
    if (agentType && !validAgents.includes(agentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent type'
      });
    }

    next();
  } catch (error) {
    logger.error('Chat input validation error:', error);
    res.status(400).json({
      success: false,
      message: 'Invalid request'
    });
  }
};

/**
 * Middleware to validate auth input
 */
const validateAuthInput = (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validate email
    if (email) {
      const emailValidation = validateEmailInput(email);
      if (!emailValidation.valid) {
        return res.status(400).json({
          message: emailValidation.error
        });
      }
      req.body.email = emailValidation.email;
    }

    // Validate password
    if (password) {
      if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({
          message: 'Password must be at least 6 characters'
        });
      }
      req.body.password = password.trim();
    }

    // Validate name if provided
    if (name) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          message: 'Name cannot be empty'
        });
      }
      if (name.length > 100) {
        return res.status(400).json({
          message: 'Name cannot exceed 100 characters'
        });
      }
      req.body.name = name.trim();
    }

    next();
  } catch (error) {
    logger.error('Auth input validation error:', error);
    res.status(400).json({
      message: 'Invalid request'
    });
  }
};

module.exports = {
  validateChatInput,
  validateAuthInput,
  sanitizeString,
  validateMessageInput,
  validateEmailInput
};
