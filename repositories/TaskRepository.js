const Task = require('../models/Task');
const ApiError = require('../utils/apiError');

class TaskRepository {
  /**
   * Create new task
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task
   * @throws {ApiError} If task creation fails
   */
  async create(taskData) {
    try {
      return await Task.create(taskData);
    } catch (error) {
      throw new ApiError(400, 'Failed to create task', error.message);
    }
  }

  /**
   * Find task by ID
   * @param {string} id - Task's ID
   * @returns {Promise<Object|null>} Task object or null if not found
   */
  async findById(id) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return null;
    }
    return await Task.findById(id);
  }

  /**
   * Find all tasks for a user with pagination and filtering
   * @param {string} userId - User's ID
   * @param {Object} query - Query parameters
   * @returns {Promise<Object>} { tasks, pagination }
   */
  async findAllByUser(userId, query = {}) {
    const { status, priority, search, sort, page = 1, limit = 10 } = query;
    
    // Build filter
    const filter = { user: userId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    let sortOption = { createdAt: -1 }; // Default sort
    if (sort) {
      const [field, order] = sort.split(':');
      if (['title', 'status', 'priority', 'dueDate', 'createdAt'].includes(field)) {
        sortOption = { [field]: order === 'desc' ? -1 : 1 };
      }
    }

    // Validate pagination
    const validatedPage = Math.max(1, parseInt(page));
    const validatedLimit = Math.min(Math.max(1, parseInt(limit)), 100); // Max 100 items per page

    const skip = (validatedPage - 1) * validatedLimit;

    // Execute query
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(validatedLimit)
        .lean(),
      Task.countDocuments(filter)
    ]);

    return {
      tasks,
      pagination: {
        total,
        page: validatedPage,
        pages: Math.ceil(total / validatedLimit),
        limit: validatedLimit
      }
    };
  }

  /**
   * Update task
   * @param {string} id - Task's ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated task or null if not found
   */
  async update(id, updateData) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return null;
    }
    return await Task.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete task
   * @param {string} id - Task's ID
   * @returns {Promise<Object|null>} Deleted task or null if not found
   */
  async delete(id) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return null;
    }
    return await Task.findByIdAndDelete(id);
  }

  /**
   * Find task by ID and user
   * @param {string} id - Task's ID
   * @param {string} userId - User's ID
   * @returns {Promise<Object|null>} Task object or null if not found
   */
  async findByIdAndUser(id) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return null;
    }
    return await Task.findById(id).lean();
  }
}

module.exports = TaskRepository;