/**
 * Request validation middleware using Joi schemas
 */
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true, // Remove keys that are not defined in the schema
      errors: {
        wrap: {
          label: '' // Do not wrap parameter names in quotes
        }
      }
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
      });
    }

    next();
  };
};

module.exports = validateRequest;
