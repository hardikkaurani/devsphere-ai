/**
 * Message Validation Utilities
 * Centralized validation for chat messages and content
 */

const logger = require('./logger');

/**
 * Validate message content
 * @param {string} message - Message to validate
 * @returns {object} { isValid: boolean, error?: string }
 */
const validateMessage = (message) => {
  const MAX_LENGTH = 5000;
  const MIN_LENGTH = 1;

  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Message must be a non-empty string' };
  }

  const trimmed = message.trim();

  if (trimmed.length < MIN_LENGTH) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  if (trimmed.length > MAX_LENGTH) {
    return {
      isValid: false,
      error: `Message exceeds maximum length of ${MAX_LENGTH} characters`
    };
  }

  return { isValid: true };
};

/**
 * Sanitize message content
 * Removes potentially harmful content
 * @param {string} message - Message to sanitize
 * @returns {string} Sanitized message
 */
const sanitizeMessage = (message) => {
  return message
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .slice(0, 5000); // Enforce max length
};

/**
 * Validate agent type
 * @param {string} agentType - Agent type to validate
 * @returns {object} { isValid: boolean, error?: string }
 */
const validateAgentType = (agentType) => {
  const VALID_AGENTS = ['general', 'coding', 'resume'];

  if (!agentType || !VALID_AGENTS.includes(agentType)) {
    return {
      isValid: false,
      error: `Invalid agent type. Valid options: ${VALID_AGENTS.join(', ')}`
    };
  }

  return { isValid: true };
};

module.exports = {
  validateMessage,
  sanitizeMessage,
  validateAgentType
};
