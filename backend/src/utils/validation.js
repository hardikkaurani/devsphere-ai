/**
 * Validation schemas for API requests
 */

const Joi = require('joi');

const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

const agentSchemas = {
  sendMessage: Joi.object({
    message: Joi.string().required().trim().max(5000),
    agentType: Joi.string().valid('coding', 'resume', 'general').default('general'),
    conversationId: Joi.string().optional()
  }),

  createAgent: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('coding', 'resume', 'general').required(),
    description: Joi.string().optional()
  })
};

/**
 * Validation middleware factory
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  req[source] = value;
  next();
};

module.exports = {
  authSchemas,
  agentSchemas,
  validate
};
