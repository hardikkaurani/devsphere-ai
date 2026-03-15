/**
 * Environment variable validation and loading
 */

const logger = require('./logger');

const requiredEnvs = [
  'MONGO_URI',
  'PORT',
  'JWT_SECRET',
  'NODE_ENV'
];

const optionalEnvs = [
  'LOG_LEVEL',
  'CORS_ORIGIN',
  'OLLAMA_BASE_URL',
  'OLLAMA_MODEL'
];

/**
 * Validate that all required environment variables are set
 */
const validateEnvironment = () => {
  const missing = [];
  
  requiredEnvs.forEach(env => {
    if (!process.env[env]) {
      missing.push(env);
    }
  });

  if (missing.length > 0) {
    const error = `Missing required environment variables: ${missing.join(', ')}`;
    logger.error(error);
    throw new Error(error);
  }

  logger.info('✓ Environment variables validated');
};

/**
 * Get environment configuration
 */
const getConfig = () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  logLevel: process.env.LOG_LEVEL || 'info',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'gemma:2b'
});

module.exports = {
  validateEnvironment,
  getConfig
};
