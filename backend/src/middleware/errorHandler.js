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

  // Wrong MongoDB ID error
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    err.message = `${field} already exists`;
    err.statusCode = 409;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    err.message = 'Invalid token';
    err.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    err.message = 'Token has expired';
    err.statusCode = 401;
  }

  // Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    err.message = 'Validation failed';
    err.statusCode = 400;
  }

  // Log error details
  logger.error({
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
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
