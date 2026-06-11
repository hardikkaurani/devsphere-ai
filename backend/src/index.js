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
const socketIo = require('socket.io');

const logger = require('./utils/logger');
const { validateEnvironment, getConfig } = require('./utils/environment');
const { globalErrorHandler, notFoundHandler } = require('./middleware/errorHandler');
const aiService = require('./services/aiService');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/authRoutes');
const agentRoutes = require('./routes/agentRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Validate environment
try {
  validateEnvironment();
} catch (envError) {
  logger.error('CRITICAL: Environment validation failed: ' + envError.message);
  process.exit(1);
}
const config = getConfig();

const app = express();

// ============================================
// Security Middleware
// ============================================

// Helmet for security headers with Content Security Policy (CSP)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
      connectSrc: ["'self'", 'ws:', 'wss:', 'http:', 'https:', 'http://localhost:11434'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration (supports single string or comma-separated origins)
const corsOrigin = config.corsOrigin;
const allowedOrigins = typeof corsOrigin === 'string' && corsOrigin.includes(',')
  ? corsOrigin.split(',').map(origin => origin.trim())
  : corsOrigin;

app.use(cors({
  origin: allowedOrigins,
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
// Body Parser & Sanitization Middleware
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const sanitizeInput = require('./middleware/sanitize');
app.use(sanitizeInput);

// ============================================
// Health Check Route
// ============================================

app.get('/health', async (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  const ollamaHealthy = await aiService.isHealthy();
  const uptime = process.uptime();

  const isHealthy = dbConnected && ollamaHealthy;

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
    services: {
      database: dbConnected ? 'connected' : 'disconnected',
      ollama: ollamaHealthy ? 'available' : 'unavailable'
    }
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

const connectDBWithRetry = async () => {
  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  };

  logger.info('Connecting to MongoDB...');

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('⚠ MongoDB disconnected! Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('✓ MongoDB reconnected successfully');
  });

  let retries = 5;
  while (retries > 0) {
    try {
      await mongoose.connect(config.mongoUri, options);
      logger.info('✓ MongoDB connected successfully');
      return;
    } catch (err) {
      retries -= 1;
      logger.error(`MongoDB connection failed (attempts remaining: ${retries}): ${err.message}`);
      if (retries === 0) {
        throw new Error('Could not connect to MongoDB after 5 attempts.');
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

const startServer = async () => {
  try {
    // Connect to MongoDB with retry logic
    await connectDBWithRetry();

    // Fix: Drop old username index if it exists
    try {
      await User.collection.dropIndex('username_1').catch(() => {
        // Index doesn't exist, that's fine
      });
      logger.info('✓ Cleaned up legacy indexes');
    } catch {
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

    // Initialize Socket.io Server for status & monitoring
    const io = socketIo(server, {
      cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    io.on('connection', (socket) => {
      logger.info(`Client connected to WebSockets: ${socket.id}`);

      socket.on('check-status', () => {
        socket.emit('status-report', {
          status: 'online',
          serverTime: new Date().toISOString()
        });
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected from WebSockets: ${socket.id}`);
      });
    });

    app.set('io', io);

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
