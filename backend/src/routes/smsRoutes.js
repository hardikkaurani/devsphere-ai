/**
 * SMS Routes
 * API endpoints for SMS management
 */

const express = require('express');
const router = express.Router();

const SMSController = require('../controllers/smsController');
const authMiddleware = require('../middleware/authMiddleware');
const inputValidation = require('../middleware/inputValidation');

// Apply authentication to all routes
router.use(authMiddleware);

/**
 * POST /api/sms/process
 * Process a single SMS message
 */
router.post(
  '/process',
  inputValidation.validateSMS,
  SMSController.processSMS
);

/**
 * POST /api/sms/batch
 * Process batch of SMS messages
 */
router.post(
  '/batch',
  inputValidation.validateSMSBatch,
  SMSController.processBatch
);

/**
 * GET /api/sms/list
 * Get SMS messages for authenticated user
 */
router.get(
  '/list',
  SMSController.listSMS
);

/**
 * GET /api/sms/:id
 * Get specific SMS details
 */
router.get(
  '/:id',
  SMSController.getSMSDetails
);

/**
 * GET /api/sms/statistics/summary
 * Get SMS processing statistics
 */
router.get(
  '/statistics/summary',
  SMSController.getStatistics
);

/**
 * POST /api/sms/retry-failed
 * Manually retry failed SMS processing
 */
router.post(
  '/retry-failed',
  SMSController.retryFailed
);

/**
 * DELETE /api/sms/cleanup
 * Cleanup old SMS records
 */
router.delete(
  '/cleanup',
  SMSController.cleanup
);

/**
 * GET /api/sms/health
 * Worker health check
 */
router.get(
  '/health/status',
  SMSController.getWorkerStatus
);

module.exports = router;
