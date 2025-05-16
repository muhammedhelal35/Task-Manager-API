const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService');
const ApiError = require('../utils/apiError');

const userService = new UserService();


const protect = async (req, res, next) => {
  try {
    let token;

    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError('Not authorized to access this route', 401));
    }

    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      if (userService.isTokenBlacklisted(token)) {
        return next(new ApiError('Token is no longer valid', 401));
      }

      
      const user = await userService.getMe(decoded.id);
      if (!user) {
        return next(new ApiError('User not found', 404));
      }

      
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