/**
 * Request Tracking Middleware
 * Adds correlation IDs to track requests through the system
 * Logs request/response timing and details
 */

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

/**
 * Generate or retrieve request ID for tracing
 */
const requestTrackingMiddleware = (req, res, next) => {
  // Use existing X-Request-ID or generate new one
  const requestId = req.get('X-Request-ID') || uuidv4();
  req.id = requestId;

  // Add to response header
  res.setHeader('X-Request-ID', requestId);

  // Store timing information
  req.startTime = Date.now();

  // Override res.json to add request ID to responses
  const originalJson = res.json.bind(res);
  res.json = function(data) {
    // Add request ID to response metadata if not already present
    if (typeof data === 'object' && data !== null) {
      if (!data.requestId) {
        data.requestId = requestId;
      }
    }
    return originalJson(data);
  };

  // Log request
  logger.info(`→ ${req.method} ${req.path}`, {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    userAgent: req.get('user-agent')
  });

  // Override res.end to log response
  const originalEnd = res.end.bind(res);
  res.end = function(...args) {
    const duration = Date.now() - req.startTime;
    const statusCode = res.statusCode;

    // Log response
    if (statusCode >= 400) {
      logger.error(`← ${req.method} ${req.path} ${statusCode}`, {
        requestId,
        method: req.method,
        path: req.path,
        statusCode,
        duration: `${duration}ms`
      });
    } else {
      logger.info(`← ${req.method} ${req.path} ${statusCode}`, {
        requestId,
        method: req.method,
        path: req.path,
        statusCode,
        duration: `${duration}ms`
      });
    }

    return originalEnd(...args);
  };

  next();
};

module.exports = requestTrackingMiddleware;
