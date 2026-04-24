/**
 * SMS Controller
 * Handles SMS API requests
 */

const SMSProcessor = require('../services/smsProcessor');
const SMS = require('../models/SMS');
const smsWorker = require('../workers/smsWorker');
const logger = require('../utils/logger');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class SMSController {
  /**
   * Process single SMS
   */
  static async processSMS(req, res) {
    try {
      const { phoneNumber, sender, content } = req.body;

      const smsData = {
        phoneNumber,
        sender,
        rawContent: content,
        user: req.user._id
      };

      const result = await SMSProcessor.processSMS(smsData);

      if (result.status === 'SUCCESS') {
        return sendSuccess(res, result, 'SMS processed successfully', 200);
      } else if (result.status === 'DUPLICATE') {
        return sendSuccess(res, result, 'SMS already processed (duplicate)', 200);
      } else {
        return sendError(res, result.error, 400);
      }
    } catch (error) {
      logger.error('SMS processing error:', error);
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Process batch of SMS messages
   */
  static async processBatch(req, res) {
    try {
      const { smsList } = req.body;

      // Add user context to each SMS
      const smsWithUser = smsList.map(sms => ({
        ...sms,
        user: req.user._id
      }));

      const result = await SMSProcessor.processBatch(smsWithUser);

      return sendSuccess(res, result, 'Batch processing completed', 200);
    } catch (error) {
      logger.error('Batch processing error:', error);
      return sendError(res, error.message, 500);
    }
  }

  /**
   * List SMS messages
   */
  static async listSMS(req, res) {
    try {
      const { page = 1, limit = 20, type, status } = req.query;

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      // Build filter
      const filter = { user: req.user._id };

      if (type && type !== 'ALL') {
        filter['parsedData.messageType'] = type;
      }

      if (status && status !== 'ALL') {
        filter.processingStatus = status;
      }

      // Execute query
      const [sms, total] = await Promise.all([
        SMS.find(filter)
          .select('-__v')
          .sort({ receivedAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        SMS.countDocuments(filter)
      ]);

      const data = {
        sms,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      };

      return sendSuccess(res, data, 'SMS retrieved successfully', 200);
    } catch (error) {
      logger.error('List SMS error:', error);
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Get SMS details
   */
  static async getSMSDetails(req, res) {
    try {
      const { id } = req.params;

      const sms = await SMS.findById(id);

      if (!sms) {
        return sendError(res, 'SMS not found', 404);
      }

      // Check ownership
      if (sms.user.toString() !== req.user._id.toString()) {
        return sendError(res, 'Unauthorized', 403);
      }

      return sendSuccess(res, sms, 'SMS details retrieved', 200);
    } catch (error) {
      logger.error('Get SMS details error:', error);
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Get statistics
   */
  static async getStatistics(req, res) {
    try {
      const { timeRange = 24 } = req.query;

      const stats = await SMSProcessor.getStatistics(parseInt(timeRange));

      return sendSuccess(res, stats, 'Statistics retrieved', 200);
    } catch (error) {
      logger.error('Statistics error:', error);
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Retry failed SMS
   */
  static async retryFailed(req, res) {
    try {
      const result = await SMSProcessor.retryFailedSMS();

      return sendSuccess(res, result, 'Retry operation completed', 200);
    } catch (error) {
      logger.error('Retry failed error:', error);
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Cleanup old records
   */
  static async cleanup(req, res) {
    try {
      const { daysOld = 30 } = req.query;

      const result = await SMSProcessor.cleanupOldRecords(parseInt(daysOld));

      return sendSuccess(res, result, `Cleanup completed: ${result.deletedCount} records deleted`, 200);
    } catch (error) {
      logger.error('Cleanup error:', error);
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Get worker status
   */
  static async getWorkerStatus(req, res) {
    try {
      const status = smsWorker.getStatus();

      return sendSuccess(res, status, 'Worker status retrieved', 200);
    } catch (error) {
      logger.error('Worker status error:', error);
      return sendError(res, error.message, 500);
    }
  }
}

module.exports = SMSController;
