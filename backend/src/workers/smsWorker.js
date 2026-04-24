/**
 * SMS Background Worker
 * Handles scheduled SMS processing tasks
 */

const SMSProcessor = require('../services/smsProcessor');
const logger = require('../utils/logger');

class SMSWorker {
  constructor() {
    this.isRunning = false;
    this.workers = {};
  }

  /**
   * Initialize all background workers
   */
  async initialize() {
    try {
      logger.info('Initializing SMS background workers');

      // Retry failed SMS every 5 minutes
      this.workers.retryWorker = setInterval(
        () => this.retryFailedSMSTask(),
        5 * 60 * 1000
      );

      // Generate statistics every hour
      this.workers.statsWorker = setInterval(
        () => this.generateStatisticsTask(),
        60 * 60 * 1000
      );

      // Cleanup old records daily
      this.workers.cleanupWorker = setInterval(
        () => this.cleanupTask(),
        24 * 60 * 60 * 1000
      );

      this.isRunning = true;

      logger.info('SMS background workers initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize SMS workers:', error);
      throw error;
    }
  }

  /**
   * Retry failed SMS task
   */
  async retryFailedSMSTask() {
    try {
      logger.info('Running retry failed SMS task');

      const result = await SMSProcessor.retryFailedSMS(20);

      logger.info('Retry task completed', result);
    } catch (error) {
      logger.error('Retry task failed:', error);
    }
  }

  /**
   * Generate statistics task
   */
  async generateStatisticsTask() {
    try {
      logger.info('Running SMS statistics generation task');

      const stats = await SMSProcessor.getStatistics(24);

      logger.info('SMS Statistics (24h)', stats);
    } catch (error) {
      logger.error('Statistics task failed:', error);
    }
  }

  /**
   * Cleanup old records task
   */
  async cleanupTask() {
    try {
      logger.info('Running SMS cleanup task');

      const result = await SMSProcessor.cleanupOldRecords(30);

      logger.info('Cleanup task completed', result);
    } catch (error) {
      logger.error('Cleanup task failed:', error);
    }
  }

  /**
   * Stop all workers
   */
  stop() {
    try {
      logger.info('Stopping SMS background workers');

      Object.values(this.workers).forEach(worker => {
        if (worker) clearInterval(worker);
      });

      this.isRunning = false;

      logger.info('SMS background workers stopped');
    } catch (error) {
      logger.error('Error stopping workers:', error);
    }
  }

  /**
   * Get worker status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      workers: Object.keys(this.workers),
      timestamp: new Date()
    };
  }

  /**
   * Manually trigger retry
   */
  async triggerRetry(limit = 10) {
    logger.info('Manually triggering SMS retry');
    return SMSProcessor.retryFailedSMS(limit);
  }

  /**
   * Manually trigger statistics
   */
  async triggerStatistics(timeRange = 24) {
    logger.info('Manually triggering statistics generation');
    return SMSProcessor.getStatistics(timeRange);
  }
}

module.exports = new SMSWorker();
