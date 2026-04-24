/**
 * SMS Validation Utilities
 * Validates SMS format, content, and metadata
 */

const logger = require('./logger');

class SMSValidator {
  /**
   * Validate phone number format
   */
  static isValidPhoneNumber(phoneNumber) {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return false;
    }

    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phoneNumber.trim());
  }

  /**
   * Validate SMS content
   */
  static isValidSMSContent(content) {
    if (!content || typeof content !== 'string') {
      return false;
    }

    const trimmedContent = content.trim();

    // Check length (SMS typical limit is 160 chars, but allow flexibility)
    if (trimmedContent.length === 0 || trimmedContent.length > 5000) {
      return false;
    }

    return true;
  }

  /**
   * Validate SMS sender
   */
  static isValidSender(sender) {
    if (!sender || typeof sender !== 'string') {
      return false;
    }

    const trimmedSender = sender.trim();
    return trimmedSender.length > 0 && trimmedSender.length <= 100;
  }

  /**
   * Validate complete SMS object
   */
  static validateSMSObject(smsData) {
    const errors = [];

    if (!this.isValidPhoneNumber(smsData.phoneNumber)) {
      errors.push('Invalid phone number format');
    }

    if (!this.isValidSender(smsData.sender)) {
      errors.push('Invalid sender format');
    }

    if (!this.isValidSMSContent(smsData.rawContent)) {
      errors.push('Invalid SMS content');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize SMS content
   */
  static sanitizeSMSContent(content) {
    if (!content) return '';

    return content
      .trim()
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  /**
   * Check if SMS looks like spam
   */
  static isLikelySpam(content, sender) {
    const spamKeywords = [
      'click here',
      'verify account',
      'confirm identity',
      'update payment',
      'urgent action',
      'act now',
      'limited time',
      'exclusive offer',
      'congratulations won'
    ];

    const lowerContent = content.toLowerCase();
    const lowerSender = sender.toLowerCase();

    // Check for spam keywords
    const hasSpamKeywords = spamKeywords.some(keyword =>
      lowerContent.includes(keyword)
    );

    // Check for suspicious sender patterns
    const suspiciousSenderPatterns = [
      /^[0-9]+$/, // Only numbers
      /http|www|\.com/i, // URLs in sender
      /[!@#$%^&*]{3,}/ // Repeated special chars
    ];

    const hasSuspiciousSender = suspiciousSenderPatterns.some(pattern =>
      pattern.test(lowerSender)
    );

    return hasSpamKeywords || hasSuspiciousSender;
  }
}

module.exports = SMSValidator;
