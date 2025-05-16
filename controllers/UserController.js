const UserService = require('../services/UserService');
const ApiResponse = require('../utils/apiResponse');
const { validateEmail, validatePassword } = require('../utils/validators');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  
  register = async (req, res, next) => {
    try {
      const { email, password, name } = req.body;

      
      if (!email || !password || !name) {
        return ApiResponse.error(res, 'Email, password and name are required', 400);
      }

      if (!validateEmail(email)) {
        return ApiResponse.error(res, 'Invalid email format', 400);
      }

      if (!validatePassword(password)) {
        return ApiResponse.error(res, 'Password must be at least 8 characters long and contain at least one number and one letter', 400);
      }

      const user = await this.userService.register(req.body);
      ApiResponse.success(res, 'User registered successfully', user, 201);
    } catch (err) {
      next(err);
    }
  };

 
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return ApiResponse.error(res, 'Email and password are required', 400);
      }

      const { token, user } = await this.userService.login(email, password);
      ApiResponse.success(res, 'Login successful', { token, user });
    } catch (err) {
      next(err);
    }
  };

  
  logout = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return ApiResponse.error(res, 'No token provided', 401);
      }

      await this.userService.logout(token);
      ApiResponse.success(res, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  };

  
  getMe = async (req, res, next) => {
    try {
      const user = await this.userService.getMe(req.user.id);
      ApiResponse.success(res, 'User retrieved successfully', user);
    } catch (err) {
      next(err);
    }
  };

  
  updateDetails = async (req, res, next) => {
    try {
      const { email, name } = req.body;
      
      if (email && !validateEmail(email)) {
        return ApiResponse.error(res, 'Invalid email format', 400);
      }

      const user = await this.userService.updateDetails(req.user.id, req.body);
      ApiResponse.success(res, 'User updated successfully', user);
    } catch (err) {
      next(err);
    }
  };

  
  changePassword = async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return ApiResponse.error(res, 'Current password and new password are required', 400);
      }

      if (!validatePassword(newPassword)) {
        return ApiResponse.error(res, 'New password must be at least 8 characters long and contain at least one number and one letter', 400);
      }

      await this.userService.changePassword(req.user.id, currentPassword, newPassword);
      ApiResponse.success(res, 'Password changed successfully');
    } catch (err) {
      next(err);
    }
  };

  deleteAccount = async (req, res, next) => {
    try {
      await this.userService.deleteAccount(req.user.id);
      ApiResponse.success(res, 'Account deleted successfully');
    } catch (err) {
      next(err);
    }
  };
}

module.exports = UserController;