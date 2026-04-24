/**
 * Request Tracing Middleware
 * Adds unique request ID to all requests for distributed logging
 */

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

/**
 * Add request ID to all requests
 */
const addRequestId = (req, res, next) => {
  try {
    // Check if request already has ID (from upstream)
    const requestId = req.headers['x-request-id'] || uuidv4();
    
    req.id = requestId;
    req.startTime = Date.now();
    
    // Add to response headers
    res.setHeader('X-Request-ID', requestId);
    
    // Override logger to include request ID
    const originalLog = logger.info;
    const originalError = logger.error;
    const originalWarn = logger.warn;
    
    req.logger = {
      info: (msg, meta = {}) => originalLog(msg, { ...meta, requestId, userId: req.user?._id }),
      error: (msg, meta = {}) => originalError(msg, { ...meta, requestId, userId: req.user?._id }),
      warn: (msg, meta = {}) => originalWarn(msg, { ...meta, requestId, userId: req.user?._id })
    };
    
    // Log request
    req.logger.info(`[${req.method}] ${req.path}`, {
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    // Log response on finish
    res.on('finish', () => {
      const duration = Date.now() - req.startTime;
      req.logger.info(`[${req.method}] ${req.path} - ${res.statusCode}`, {
        duration: `${duration}ms`,
        status: res.statusCode
      });
    });
    
    next();
  } catch (error) {
    logger.error('Request tracing middleware error:', error);
    next();
  }
};

module.exports = {
  addRequestId
};
