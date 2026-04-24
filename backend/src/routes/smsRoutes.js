/**
 * SMS Routes
 * API endpoints for SMS management
 */

const express = require('express');
const router = express.Router();

const SMSController = require('../controllers/smsController');
const authMiddleware = require('../middleware/authMiddleware');
const inputValidation = require('../middleware/inputValidation');
const { smsProcessLimiter, smsBatchLimiter, smsListLimiter } = require('../middleware/smsRateLimit');

// Apply authentication to all routes
router.use(authMiddleware);

/**
 * POST /api/v1/sms/process
 * Process a single SMS message
 */
router.post(
  '/process',
  smsProcessLimiter,
  inputValidation.validateSMS,
  SMSController.processSMS
);

/**
 * POST /api/v1/sms/batch
 * Process batch of SMS messages
 */
router.post(
  '/batch',
  smsBatchLimiter,
  inputValidation.validateSMSBatch,
  SMSController.processBatch
);

/**
 * GET /api/v1/sms/list
 * Get SMS messages for authenticated user
 */
router.get(
  '/list',
  smsListLimiter,
  SMSController.listSMS
);

/**
 * GET /api/v1/sms/:id
 * Get specific SMS details
 */
router.get(
  '/:id',
  SMSController.getSMSDetails
);

/**
 * GET /api/v1/sms/statistics/summary
 * Get SMS processing statistics
 */
router.get(
  '/statistics/summary',
  SMSController.getStatistics
);

/**
 * POST /api/v1/sms/retry-failed
 * Manually retry failed SMS processing
 */
router.post(
  '/retry-failed',
  SMSController.retryFailed
);

/**
 * DELETE /api/v1/sms/cleanup
 * Cleanup old SMS records
 */
router.delete(
  '/cleanup',
  SMSController.cleanup
);

/**
 * GET /api/v1/sms/health/status
 * Worker health check
 */
router.get(
  '/health/status',
  SMSController.getWorkerStatus
);

module.exports = router;
