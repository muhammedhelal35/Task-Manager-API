const UserRepository = require('../repositories/UserRepository');
const ApiError = require('../utils/apiError');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.blacklistedTokens = new Set();
  }

  async register(userData) {
    const { email, password, name } = userData;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError('Email already registered', 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      name
    });

    // Remove password from response
    user.password = undefined;
    return user;
  }

  async login(email, password) {
    // Find user
    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from response
    user.password = undefined;
    return { token, user };
  }

  async logout(token) {
    // Add token to blacklist
    this.blacklistedTokens.add(token);
    
    // Optional: Set up a cleanup mechanism for old tokens
    setTimeout(() => {
      this.blacklistedTokens.delete(token);
    }, 24 * 60 * 60 * 1000); // Remove from blacklist after 24 hours
  }

  async getMe(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  }

  async updateDetails(userId, updateData) {
    const user = await this.userRepository.update(userId, updateData);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new ApiError('Current password is incorrect', 401);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await this.userRepository.update(userId, { password: hashedPassword });

    // Invalidate all existing tokens for this user
    return true;
  }

  async deleteAccount(userId) {
    const user = await this.userRepository.delete(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return true;
  }

  isTokenBlacklisted(token) {
    return this.blacklistedTokens.has(token);
  }
}

module.exports = UserService;