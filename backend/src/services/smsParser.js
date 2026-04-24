/**
 * SMS Parser Service
 * Extracts structured data from SMS messages
 */

const logger = require('../utils/logger');
const SMSValidator = require('../utils/smsValidator');

class SMSParser {
  /**
   * Parse SMS message and extract relevant information
   */
  static parseSMS(content) {
    try {
      const sanitizedContent = SMSValidator.sanitizeSMSContent(content);

      // Try different parsing strategies
      let messageType = 'UNKNOWN';
      let extractedInfo = {};
      let confidence = 0;

      // Check for OTP
      const otpResult = this.extractOTP(sanitizedContent);
      if (otpResult.found) {
        messageType = 'OTP';
        extractedInfo = { ...extractedInfo, ...otpResult };
        confidence = Math.max(confidence, 0.95);
      }

      // Check for transaction
      const transactionResult = this.extractTransaction(sanitizedContent);
      if (transactionResult.found) {
        messageType = 'TRANSACTION';
        extractedInfo = { ...extractedInfo, ...transactionResult };
        confidence = Math.max(confidence, 0.85);
      }

      // Check for service notifications
      const serviceResult = this.extractServiceInfo(sanitizedContent);
      if (serviceResult.found) {
        messageType = messageType === 'UNKNOWN' ? 'SERVICE' : messageType;
        extractedInfo = { ...extractedInfo, ...serviceResult };
        confidence = Math.max(confidence, 0.75);
      }

      // Extract keywords
      extractedInfo.keywords = this.extractKeywords(sanitizedContent);

      return {
        messageType,
        extractedInfo,
        confidence: Math.min(confidence, 1)
      };
    } catch (error) {
      logger.error('SMS Parser Error:', error);
      return {
        messageType: 'UNKNOWN',
        extractedInfo: {},
        confidence: 0,
        error: error.message
      };
    }
  }

  /**
   * Extract OTP from SMS
   */
  static extractOTP(content) {
    const otpPatterns = [
      /\b(\d{6})\b/, // 6-digit OTP
      /\b(\d{4})\b/, // 4-digit OTP
      /otp[:\s]+(\d{4,6})/i, // OTP: 1234
      /code[:\s]+(\d{4,6})/i, // Code: 1234
      /password[:\s]+(\d{4,6})/i // Password: 1234
    ];

    for (const pattern of otpPatterns) {
      const match = content.match(pattern);
      if (match) {
        return {
          found: true,
          otp: match[1]
        };
      }
    }

    return { found: false };
  }

  /**
   * Extract transaction information
   */
  static extractTransaction(content) {
    const result = { found: false };

    // Transaction amount patterns
    const amountPatterns = [
      /(?:rs|₹|usd|amount)[:\s]*(?:rupees\s+)?([0-9,]+(?:\.[0-9]{2})?)/i,
      /([0-9,]+(?:\.[0-9]{2})?)\s*(?:rs|₹|rupees|usd)/i,
      /₹\s*([0-9,]+(?:\.[0-9]{2})?)/
    ];

    for (const pattern of amountPatterns) {
      const match = content.match(pattern);
      if (match) {
        result.found = true;
        result.amount = match[1];
        break;
      }
    }

    // Transaction status
    const statusPatterns = [
      /(?:status|transaction)[:\s]*(successful|failed|pending|credited|debited|completed)/i,
      /(successful|failed|pending|credited|debited|completed)\s+(?:transaction|transaction)/i
    ];

    for (const pattern of statusPatterns) {
      const match = content.match(pattern);
      if (match) {
        result.found = true;
        result.status = match[1].toLowerCase();
        break;
      }
    }

    // Transaction ID
    const transactionIdPatterns = [
      /(?:ref|ref\.|reference|txn|transaction id)[:\s]*([A-Z0-9]{8,20})/i,
      /id[:\s]*([A-Z0-9]{8,20})/i
    ];

    for (const pattern of transactionIdPatterns) {
      const match = content.match(pattern);
      if (match) {
        result.found = true;
        result.transactionId = match[1];
        break;
      }
    }

    return result;
  }

  /**
   * Extract service information
   */
  static extractServiceInfo(content) {
    const result = { found: false };

    // Common service providers
    const serviceProviders = [
      { name: 'BANK', patterns: /bank|icici|hdfc|axis|sbi|yes|kotak/i },
      { name: 'TELECOM', patterns: /airtel|jio|vi|vodafone|bsnl/i },
      { name: 'ECOMMERCE', patterns: /amazon|flipkart|ebay|myntra|olx/i },
      { name: 'PAYMENT', patterns: /paytm|phonepe|googlepay|whatsapp|upi/i },
      { name: 'OTT', patterns: /netflix|amazon prime|hotstar|sony liv/i }
    ];

    for (const service of serviceProviders) {
      if (service.patterns.test(content)) {
        result.found = true;
        result.serviceProvider = service.name;
        break;
      }
    }

    // Timestamp extraction
    const timestampPatterns = [
      /(?:at|on)\s+(\d{1,2}[:\/]\d{1,2}(?:[:\/]\d{2,4})?)/i,
      /(\d{1,2}[:\/]\d{1,2}[:\/]\d{2,4})/
    ];

    for (const pattern of timestampPatterns) {
      const match = content.match(pattern);
      if (match) {
        result.found = true;
        result.timestamp = match[1];
        break;
      }
    }

    return result;
  }

  /**
   * Extract keywords from SMS
   */
  static extractKeywords(content) {
    const keywords = new Set();

    // Common SMS keywords
    const keywordPatterns = [
      /(?:account|balance|limit|transaction|payment|delivery|order|code|otp|password|verify|confirm|update|urgent|alert|notification)/gi
    ];

    for (const pattern of keywordPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => keywords.add(match.toLowerCase()));
      }
    }

    return Array.from(keywords);
  }
}

module.exports = SMSParser;
