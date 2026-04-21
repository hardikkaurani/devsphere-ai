/**
 * Standardized API Response Handler
 * Provides consistent response format across all endpoints
 */

const logger = require('./logger');

/**
 * Standard success response format
 * @param {object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Standard error response format
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} details - Additional error details (not sent to client)
 */
const sendError = (res, message, statusCode = 500, details = null) => {
  // Log error with details
  if (details) {
    logger.error(`API Error: ${message}`, {
      statusCode,
      details
    });
  } else {
    logger.error(`API Error: ${message}`, { statusCode });
  }

  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: getErrorCode(statusCode),
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Send paginated response
 * @param {object} res - Express response object
 * @param {array} data - Array of items
 * @param {number} total - Total count of items
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 */
const sendPaginated = (res, data, total, page = 1, limit = 10) => {
  const pages = Math.ceil(total / limit);
  
  return res.status(200).json({
    success: true,
    message: 'Data retrieved successfully',
    data,
    pagination: {
      total,
      page,
      limit,
      pages,
      hasMore: page < pages
    },
    timestamp: new Date().toISOString()
  });
};

/**
 * Send validation error response
 * @param {object} res - Express response object
 * @param {array|object} errors - Validation errors
 */
const sendValidationError = (res, errors) => {
  logger.warn('Validation error', { errors });

  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: Array.isArray(errors) ? errors : [errors],
    error: {
      code: 'VALIDATION_ERROR',
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Map HTTP status code to error code
 * @param {number} statusCode - HTTP status code
 * @returns {string} - Error code
 */
const getErrorCode = (statusCode) => {
  const codes = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    429: 'RATE_LIMITED',
    500: 'INTERNAL_ERROR',
    503: 'SERVICE_UNAVAILABLE'
  };

  return codes[statusCode] || 'ERROR';
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
  sendValidationError,
  getErrorCode
};
