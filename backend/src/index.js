/**
 * DevSphere AI - Main Server Entry Point
 * Production-grade Express application setup
 */

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const logger = require('./utils/logger');
const { validateEnvironment, getConfig } = require('./utils/environment');
const { globalErrorHandler, notFoundHandler } = require('./middleware/errorHandler');
const aiService = require('./services/aiService');

// Import routes
const authRoutes = require('./routes/authRoutes');
const agentRoutes = require('./routes/agentRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Validate environment
validateEnvironment();
const config = getConfig();

const app = express();

// ============================================
// Security Middleware
// ============================================

// Helmet for security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// ============================================
// Body Parser Middleware
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// Health Check Route
// ============================================

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DevSphere AI Server is running',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// API Routes
// ============================================

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/agent', agentRoutes);
app.use('/api/v1/profile', profileRoutes);

// ============================================
// Database Connection & Server Start
// ============================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    logger.info('✓ MongoDB connected successfully');

    // Fix: Drop old username index if it exists
    try {
      const User = require('./models/User');
      await User.collection.dropIndex('username_1').catch(() => {
        // Index doesn't exist, that's fine
      });
      logger.info('✓ Cleaned up legacy indexes');
    } catch (indexErr) {
      // Ignore index errors
    }

    // Check Ollama availability
    const ollamaHealthy = await aiService.isHealthy();
    if (ollamaHealthy) {
      logger.info('✓ Ollama AI engine is available');
    } else {
      logger.warn('⚠ Ollama AI engine is not available - some features may not work');
    }

    // ============================================
    // 404 & Error Handling Middleware
    // ============================================

    app.use(notFoundHandler);
    app.use(globalErrorHandler);

    // ============================================
    // Start Server
    // ============================================

    const server = app.listen(config.port, () => {
      logger.info(`
╭──────────────────────────────────────────╮
│   🚀 DevSphere AI Server Started         │
│   Port: ${config.port}                         │
│   Node: ${process.env.NODE_ENV || 'development'}                  │
│   Time: ${new Date().toLocaleTimeString()}              │
╰──────────────────────────────────────────╯
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Server closed');
        mongoose.connection.close(false, () => {
          logger.info('MongoDB connection closed');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;