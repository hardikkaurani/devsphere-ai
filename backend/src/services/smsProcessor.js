/**
 * SMS Processor Service
 * Background job processor for SMS parsing and storage
 */

const SMS = require('../models/SMS');
const SMSParser = require('./smsParser');
const SMSValidator = require('../utils/smsValidator');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

class SMSProcessor {
  /**
   * Process a single SMS message
   */
  static async processSMS(smsData) {
    const startTime = Date.now();

    try {
      // Validation
      const validationResult = SMSValidator.validateSMSObject(smsData);
      if (!validationResult.isValid) {
        throw new AppError(
          `SMS validation failed: ${validationResult.errors.join(', ')}`,
          400,
          'SMS_VALIDATION_ERROR'
        );
      }

      // Check for spam
      const isSpam = SMSValidator.isLikelySpam(smsData.rawContent, smsData.sender);

      // Check for duplicates
      const existingSMS = await SMS.findOne({
        phoneNumber: smsData.phoneNumber,
        rawContent: smsData.rawContent,
        receivedAt: {
          $gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
        }
      });

      if (existingSMS) {
        logger.warn('Duplicate SMS detected', {
          phoneNumber: smsData.phoneNumber,
          content: smsData.rawContent.substring(0, 50)
        });
        return { status: 'DUPLICATE', smsId: existingSMS._id };
      }

      // Parse SMS
      const parsedData = SMSParser.parseSMS(smsData.rawContent);

      // Create SMS document
      const smsDocument = new SMS({
        phoneNumber: smsData.phoneNumber,
        sender: smsData.sender,
        rawContent: smsData.rawContent,
        parsedData,
        isSpam,
        processingStatus: 'SUCCESS',
        user: smsData.user || null,
        tags: this.generateTags(parsedData)
      });

      // Save to database
      const savedSMS = await smsDocument.save();

      const processingTime = Date.now() - startTime;

      logger.info('SMS processed successfully', {
        smsId: savedSMS._id,
        messageType: parsedData.messageType,
        processingTime: `${processingTime}ms`,
        confidence: parsedData.confidence
      });

      return {
        status: 'SUCCESS',
        smsId: savedSMS._id,
        messageType: parsedData.messageType,
        confidence: parsedData.confidence,
        processingTime
      };
    } catch (error) {
      logger.error('SMS processing error:', {
        error: error.message,
        phoneNumber: smsData.phoneNumber,
        stack: error.stack
      });

      // Store failed SMS for retry
      await this.handleProcessingError(smsData, error);

      return {
        status: 'ERROR',
        error: error.message,
        code: error.code || 'SMS_PROCESSING_ERROR'
      };
    }
  }

  /**
   * Process batch of SMS messages with error recovery
   */
  static async processBatch(smsList, batchSize = 10) {
    logger.info(`Starting batch SMS processing: ${smsList.length} messages`);

    const results = {
      total: smsList.length,
      successful: 0,
      failed: 0,
      duplicates: 0,
      results: [],
      processingTime: null,
      completedAt: null
    };

    const startTime = Date.now();

    try {
      // Validate batch first
      if (!Array.isArray(smsList) || smsList.length === 0) {
        throw new Error('Invalid batch: must be non-empty array');
      }

      if (smsList.length > 1000) {
        throw new Error('Batch too large: maximum 1000 SMS per batch');
      }

      // Process in chunks to avoid overwhelming the system
      for (let i = 0; i < smsList.length; i += batchSize) {
        const batch = smsList.slice(i, i + batchSize);
        
        try {
          const batchResults = await Promise.allSettled(
            batch.map(sms => this.processSMS(sms))
          );

          for (const result of batchResults) {
            if (result.status === 'fulfilled') {
              const value = result.value;
              if (value.status === 'SUCCESS') {
                results.successful++;
              } else if (value.status === 'DUPLICATE') {
                results.duplicates++;
              } else {
                results.failed++;
              }
              results.results.push(value);
            } else {
              results.failed++;
              results.results.push({
                status: 'ERROR',
                error: result.reason?.message || 'Unknown error',
                code: result.reason?.code || 'BATCH_PROCESS_ERROR'
              });
            }
          }

          // Log batch progress
          const processed = Math.min(i + batchSize, smsList.length);
          logger.info(`Batch progress: ${processed}/${smsList.length}`, {
            successful: results.successful,
            failed: results.failed
          });
        } catch (batchError) {
          logger.error(`Batch chunk error at index ${i}:`, batchError);
          // Continue processing other chunks instead of failing entire batch
          results.failed += batch.length;
          batch.forEach((_, idx) => {
            results.results.push({
              status: 'ERROR',
              error: batchError.message,
              code: 'BATCH_CHUNK_ERROR'
            });
          });
        }
      }

      results.processingTime = Date.now() - startTime;
      results.completedAt = new Date().toISOString();

      logger.info('Batch SMS processing completed', results);
      return results;
    } catch (error) {
      logger.error('Batch processing error:', error);
      return {
        ...results,
        error: error.message,
        code: error.code || 'BATCH_PROCESS_ERROR',
        processingTime: Date.now() - startTime,
        completedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Retry failed SMS processing
   */
  static async retryFailedSMS(limit = 10) {
    try {
      const failedSMS = await SMS.find({
        processingStatus: 'FAILED',
        processingAttempts: { $lt: 3 }
      })
        .limit(limit)
        .sort({ createdAt: 1 });

      if (failedSMS.length === 0) {
        logger.info('No failed SMS to retry');
        return { retried: 0, results: [] };
      }

      logger.info(`Retrying ${failedSMS.length} failed SMS messages`);

      const results = [];

      for (const sms of failedSMS) {
        try {
          sms.processingAttempts += 1;

          const parsedData = SMSParser.parseSMS(sms.rawContent);

          sms.parsedData = parsedData;
          sms.processingStatus = 'SUCCESS';
          sms.lastError = null;

          await sms.save();

          logger.info(`Successfully retried SMS: ${sms._id}`);
          results.push({ smsId: sms._id, status: 'SUCCESS' });
        } catch (error) {
          sms.processingAttempts += 1;
          sms.lastError = {
            code: error.code || 'RETRY_ERROR',
            message: error.message,
            timestamp: new Date()
          };
          sms.processingStatus = sms.processingAttempts >= 3 ? 'FAILED' : 'PENDING';

          await sms.save();

          logger.error(`Failed to retry SMS: ${sms._id}`, error);
          results.push({ smsId: sms._id, status: 'FAILED', error: error.message });
        }
      }

      return { retried: failedSMS.length, results };
    } catch (error) {
      logger.error('Retry operation error:', error);
      throw error;
    }
  }

  /**
   * Get SMS statistics
   */
  static async getStatistics(timeRange = 24) {
    try {
      const since = new Date(Date.now() - timeRange * 60 * 60 * 1000);

      const [
        totalSMS,
        byType,
        byStatus,
        spamCount,
        avgConfidence
      ] = await Promise.all([
        SMS.countDocuments({ createdAt: { $gte: since } }),
        SMS.aggregate([
          { $match: { createdAt: { $gte: since } } },
          { $group: { _id: '$parsedData.messageType', count: { $sum: 1 } } }
        ]),
        SMS.aggregate([
          { $match: { createdAt: { $gte: since } } },
          { $group: { _id: '$processingStatus', count: { $sum: 1 } } }
        ]),
        SMS.countDocuments({ isSpam: true, createdAt: { $gte: since } }),
        SMS.aggregate([
          { $match: { createdAt: { $gte: since } } },
          { $group: { _id: null, avg: { $avg: '$parsedData.confidence' } } }
        ])
      ]);

      return {
        timeRange: `${timeRange}h`,
        totalSMS,
        byMessageType: Object.fromEntries(byType.map(item => [item._id, item.count])),
        byProcessingStatus: Object.fromEntries(byStatus.map(item => [item._id, item.count])),
        spamCount,
        averageConfidence: avgConfidence[0]?.avg || 0
      };
    } catch (error) {
      logger.error('Statistics generation error:', error);
      throw error;
    }
  }

  /**
   * Handle processing errors and store failed SMS
   */
  static async handleProcessingError(smsData, error) {
    try {
      const failedSMS = new SMS({
        phoneNumber: smsData.phoneNumber,
        sender: smsData.sender,
        rawContent: smsData.rawContent,
        processingStatus: 'FAILED',
        processingAttempts: 1,
        lastError: {
          code: error.code || 'PROCESSING_ERROR',
          message: error.message,
          timestamp: new Date()
        },
        user: smsData.user || null
      });

      await failedSMS.save();

      logger.warn('Failed SMS stored for retry', { smsId: failedSMS._id });
    } catch (storageError) {
      logger.error('Failed to store error SMS:', storageError);
    }
  }

  /**
   * Generate tags for SMS
   */
  static generateTags(parsedData) {
    const tags = [];

    if (parsedData.messageType !== 'UNKNOWN') {
      tags.push(parsedData.messageType.toLowerCase());
    }

    if (parsedData.extractedInfo.serviceProvider) {
      tags.push(parsedData.extractedInfo.serviceProvider.toLowerCase());
    }

    if (parsedData.confidence > 0.8) {
      tags.push('high-confidence');
    }

    return tags;
  }

  /**
   * Clean old SMS records
   */
  static async cleanupOldRecords(daysOld = 30) {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

      const result = await SMS.deleteMany({
        createdAt: { $lt: cutoffDate },
        processingStatus: { $in: ['FAILED', 'SUCCESS'] }
      });

      logger.info(`Cleaned up ${result.deletedCount} old SMS records`);

      return result;
    } catch (error) {
      logger.error('SMS cleanup error:', error);
      throw error;
    }
  }
}

module.exports = SMSProcessor;
