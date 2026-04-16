/**
 * Input sanitization utilities
 * Prevents XSS attacks and validates user input
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Escapes HTML special characters
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  
  return input.replace(/[&<>"'\/]/g, (char) => htmlEscapeMap[char]);
};

/**
 * Validate message length
 * Prevents DoS attacks with extremely long messages
 */
export const validateMessageLength = (message, maxLength = 4000) => {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  if (message.length > maxLength) {
    return { valid: false, error: `Message cannot exceed ${maxLength} characters` };
  }
  
  return { valid: true };
};

/**
 * Sanitize and validate message
 * Returns sanitized message or null if invalid
 */
export const sanitizeMessage = (message, maxLength = 4000) => {
  const lengthValidation = validateMessageLength(message, maxLength);
  
  if (!lengthValidation.valid) {
    throw new Error(lengthValidation.error);
  }
  
  // Trim whitespace
  const trimmedMessage = message.trim();
  
  // Sanitize HTML
  const sanitized = sanitizeInput(trimmedMessage);
  
  return sanitized;
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
 */
export const validatePasswordStrength = (password) => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return {
    valid: minLength && hasUppercase && hasLowercase && hasNumber,
    requirements: {
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber
    }
  };
};
