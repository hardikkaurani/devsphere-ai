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

/**
 * Middleware to validate SMS input
 */
const validateSMS = (req, res, next) => {
  try {
    const { phoneNumber, sender, content } = req.body;

    // Validate phone number
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required and must be a string'
      });
    }

    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    // Validate sender
    if (!sender || typeof sender !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Sender is required and must be a string'
      });
    }

    if (sender.trim().length === 0 || sender.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Sender must be between 1 and 100 characters'
      });
    }

    // Validate content
    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'SMS content is required and must be a string'
      });
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length === 0 || trimmedContent.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'SMS content must be between 1 and 5000 characters'
      });
    }

    // Sanitize inputs
    req.body.phoneNumber = phoneNumber.trim();
    req.body.sender = sender.trim();
    req.body.content = trimmedContent;

    next();
  } catch (error) {
    logger.error('SMS validation error:', error);
    res.status(400).json({
      success: false,
      message: 'Invalid SMS request'
    });
  }
};

/**
 * Middleware to validate SMS batch input
 */
const validateSMSBatch = (req, res, next) => {
  try {
    const { smsList } = req.body;

    if (!Array.isArray(smsList)) {
      return res.status(400).json({
        success: false,
        message: 'smsList must be an array'
      });
    }

    if (smsList.length === 0 || smsList.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'smsList must contain between 1 and 1000 items'
      });
    }

    // Validate each SMS in batch
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

    for (let i = 0; i < smsList.length; i++) {
      const sms = smsList[i];

      // Validate structure
      if (!sms || typeof sms !== 'object') {
        return res.status(400).json({
          success: false,
          message: `SMS at index ${i} must be an object`
        });
      }

      const { phoneNumber, sender, content } = sms;

      // Validate phone number
      if (!phoneNumber || !phoneRegex.test(phoneNumber.toString().trim())) {
        return res.status(400).json({
          success: false,
          message: `Invalid phone number at index ${i}`
        });
      }

      // Validate sender
      if (!sender || sender.toString().trim().length === 0 || sender.toString().length > 100) {
        return res.status(400).json({
          success: false,
          message: `Invalid sender at index ${i}`
        });
      }

      // Validate content
      const trimmedContent = content ? content.toString().trim() : '';
      if (trimmedContent.length === 0 || trimmedContent.length > 5000) {
        return res.status(400).json({
          success: false,
          message: `Invalid content length at index ${i}`
        });
      }

      // Sanitize
      smsList[i] = {
        phoneNumber: phoneNumber.toString().trim(),
        sender: sender.toString().trim(),
        content: trimmedContent
      };
    }

    next();
  } catch (error) {
    logger.error('SMS batch validation error:', error);
    res.status(400).json({
      success: false,
      message: 'Invalid SMS batch request'
    });
  }
};

module.exports = {
  validateChatInput,
  validateAuthInput,
  validateSMS,
  validateSMSBatch,
  sanitizeString,
  validateMessageInput,
  validateEmailInput
};
