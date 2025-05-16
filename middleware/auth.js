const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService');
const ApiError = require('../utils/apiError');

const userService = new UserService();

/**
 * Middleware to protect routes
 * Verifies JWT token and attaches user to request
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if token is blacklisted
      if (userService.isTokenBlacklisted(token)) {
        return next(new ApiError('Token is no longer valid', 401));
      }

      // Get user from token
      const user = await userService.getMe(decoded.id);
      if (!user) {
        return next(new ApiError('User not found', 404));
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      return next(new ApiError('Not authorized to access this route', 401));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect
}; 