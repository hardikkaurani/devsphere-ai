/**
 * Global Error Handler Middleware
 * Catches and standardizes all errors in the application
 */

const logger = require('../utils/logger');
const { ApiResponse } = require('../utils/response');
const { AppError } = require('../utils/errors');

/**
 * Main error handler middleware
 * Should be added as the last middleware in Express
 */
const globalErrorHandler = (err, req, res, next) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';
  const errorType = err.name || 'UnknownError';

  // Wrong MongoDB ID error
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    err.message = `Duplicate field: ${field} already exists`;
    err.statusCode = 409;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    err.message = 'Invalid or malformed token';
    err.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    err.message = 'Token has expired. Please login again';
    err.statusCode = 401;
  }

  // Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    err.message = `Validation failed: ${errors.join(', ')}`;
    err.statusCode = 400;
  }

  // MongoDB Cast Error
  if (err.name === 'CastError') {
    err.message = `Invalid ${err.path}: ${err.value}`;
    err.statusCode = 400;
  }

  // Log error details with categorization
  logger.error({
    errorType,
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id || 'anonymous',
    timestamp: new Date().toISOString()
  });

  // Send response
  const response = ApiResponse.error(
    err.message,
    err.statusCode,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined
  );

  res.status(err.statusCode).json(response);
};

/**
 * 404 handler middleware
 * Should be added before the global error handler
 */
const notFoundHandler = (req, res, next) => {
  const response = ApiResponse.error(
    `Route ${req.method} ${req.path} not found`,
    404
  );
  res.status(404).json(response);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  globalErrorHandler,
  notFoundHandler,
  asyncHandler
};
