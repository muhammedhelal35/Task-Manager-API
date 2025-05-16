const User = require('../models/User');
const ApiError = require('../utils/apiError');

class UserRepository {
  /**
   * Find user by email
   * @param {string} email - User's email
   * @returns {Promise<Object>} User object without password
   */
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  /**
   * Find user by email including password
   * @param {string} email - User's email
   * @returns {Promise<Object>} User object with password
   */
  async findByEmailWithPassword(email) {
    return await User.findOne({ email }).select('+password');
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Find user by ID
   * @param {string} id - User's ID
   * @returns {Promise<Object>} User object
   */
  async findById(id) {
    return await User.findById(id);
  }

  /**
   * Find user by ID including password
   * @param {string} id - User's ID
   * @returns {Promise<Object>} User object with password
   */
  async findByIdWithPassword(id) {
    return await User.findById(id).select('+password');
  }

  /**
   * Update user
   * @param {string} id - User's ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async update(id, updateData) {
    return await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete user
   * @param {string} id - User's ID
   * @returns {Promise<Object>} Deleted user
   */
  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = UserRepository;