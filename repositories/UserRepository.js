const User = require('../models/User');
const ApiError = require('../utils/apiError');

class UserRepository {
  
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  
  async findByEmailWithPassword(email) {
    return await User.findOne({ email }).select('+password');
  }

  
  async create(userData) {
    return await User.create(userData);
  }

  
  async findById(id) {
    return await User.findById(id);
  }

  
  async findByIdWithPassword(id) {
    return await User.findById(id).select('+password');
  }

  
  async update(id, updateData) {
    return await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  
  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = UserRepository;