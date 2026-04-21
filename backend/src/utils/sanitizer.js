/**
 * Input Sanitization Utilities
 * Helps prevent XSS attacks and injection vulnerabilities
 */

const logger = require('./logger');

/**
 * Sanitize string input - removes potentially dangerous characters
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') {
    return str;
  }

  // Remove HTML tags and special characters that could cause XSS
  return str
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Sanitize object recursively
 * @param {object} obj - Object to sanitize
 * @returns {object} - Sanitized object
 */
const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
const validatePasswordStrength = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate message content
 * @param {string} message - Message to validate
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
const validateMessage = (message) => {
  const errors = [];

  if (!message || typeof message !== 'string') {
    errors.push('Message must be a non-empty string');
  } else if (message.trim().length === 0) {
    errors.push('Message cannot be empty or whitespace only');
  } else if (message.length > 5000) {
    errors.push('Message cannot exceed 5000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate session ID format (MongoDB ObjectId)
 * @param {string} sessionId - Session ID to validate
 * @returns {boolean} - True if valid ObjectId
 */
const isValidObjectId = (sessionId) => {
  return /^[0-9a-fA-F]{24}$/.test(sessionId);
};

/**
 * Validate agent type
 * @param {string} agentType - Agent type to validate
 * @returns {boolean} - True if valid agent type
 */
const isValidAgentType = (agentType) => {
  const validTypes = ['coding', 'resume', 'general'];
  return validTypes.includes(agentType);
};

/**
 * Safe JSON parse with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} - Parsed object or default value
 */
const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logger.warn('Failed to parse JSON', { error: error.message });
    return defaultValue;
  }
};

module.exports = {
  sanitizeString,
  sanitizeObject,
  isValidEmail,
  validatePasswordStrength,
  validateMessage,
  isValidObjectId,
  isValidAgentType,
  safeJsonParse
};
