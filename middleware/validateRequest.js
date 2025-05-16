const ApiError = require('../utils/apiError');


const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(new ApiError(errorMessage, 400));
    }

    next();
  };
};

module.exports = {
  validateRequest
}; 