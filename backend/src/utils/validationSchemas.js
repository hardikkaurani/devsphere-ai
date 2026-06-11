const Joi = require('joi');

// Helper to validate MongoDB ObjectId
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid Mongo ObjectId');
  }
  return value;
};

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required()
});

const chatSchema = Joi.object({
  agentType: Joi.string().valid('general', 'coding', 'resume').default('general'),
  message: Joi.string().trim().required().messages({
    'string.empty': 'Message cannot be empty'
  }),
  sessionId: Joi.string().custom(objectId).optional(),
  model: Joi.string().trim().optional(),
  stream: Joi.boolean().optional()
});

const renameSessionSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  bio: Joi.string().trim().max(500).allow('').optional(),
  phone: Joi.string().trim().max(20).allow('').optional(),
  location: Joi.string().trim().max(100).allow('').optional(),
  website: Joi.string().trim().uri().allow('').optional(),
  company: Joi.string().trim().max(100).allow('').optional(),
  jobTitle: Joi.string().trim().max(100).allow('').optional(),
  skills: Joi.array().items(Joi.string().trim()).max(20).optional(),
  timezone: Joi.string().trim().optional(),
  theme: Joi.string().valid('light', 'dark', 'auto').optional(),
  language: Joi.string().trim().optional()
});

const updateAvatarSchema = Joi.object({
  avatar: Joi.string().trim().uri().required()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  chatSchema,
  renameSessionSchema,
  updateProfileSchema,
  updateAvatarSchema,
  changePasswordSchema
};
