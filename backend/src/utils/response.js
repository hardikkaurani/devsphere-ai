/**
 * Standardized API response format
 * Ensures consistent response structure across all endpoints
 */

class ApiResponse {
  constructor(data = null, message = 'Success', statusCode = 200, errors = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (errors) {
      this.errors = errors;
    }
  }

  static success(data, message = 'Success', statusCode = 200) {
    return new ApiResponse(data, message, statusCode);
  }

  static error(message, statusCode = 500, errors = null) {
    return new ApiResponse(null, message, statusCode, errors);
  }

  static paginated(data, total, page, limit, message = 'Success') {
    return new ApiResponse(
      {
        items: data,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      },
      message,
      200
    );
  }
}

/**
 * Middleware to handle async errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Send API response
 */
const sendResponse = (res, response) => {
  return res.status(response.statusCode).json(response);
};

module.exports = {
  ApiResponse,
  asyncHandler,
  sendResponse
};
