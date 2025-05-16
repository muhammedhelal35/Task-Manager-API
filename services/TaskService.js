const TaskRepository = require('../repositories/TaskRepository');
const ApiError = require('../utils/apiError');

class TaskService {
  constructor() {
    this.taskRepository = new TaskRepository();
  }

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @param {string} userId - User's ID
   * @returns {Promise<Object>} Created task
   * @throws {ApiError} If validation fails or creation fails
   */
  async createTask(taskData, userId) {
    // Validate required fields
    if (!taskData.title || !taskData.status) {
      throw new ApiError(400, 'Title and status are required');
    }

    try {
      const task = await this.taskRepository.create({
        ...taskData,
        user: userId
      });
      return task;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new ApiError(400, 'Validation failed', error.errors);
      }
      throw error;
    }
  }

  /**
   * Get all tasks for a user with pagination and filtering
   * @param {string} userId - User's ID
   * @param {Object} query - Query parameters
   * @returns {Promise<Object>} { tasks, pagination }
   */
  async getTasks(userId, query) {
    return await this.taskRepository.findAllByUser(userId, query);
  }

  /**
   * Get a single task
   * @param {string} taskId - Task's ID
   * @param {string} userId - User's ID
   * @returns {Promise<Object>} Task object
   * @throws {ApiError} If task not found
   */
  async getTask(taskId, userId) {
    const task = await this.taskRepository.findByIdAndUser(taskId, userId);
    if (!task) {
      throw new ApiError(404, 'Task not found or access denied');
    }
    return task;
  }

  /**
   * Update a task
   * @param {string} taskId - Task's ID
   * @param {Object} updateData - Data to update
   * @param {string} userId - User's ID
   * @returns {Promise<Object>} Updated task
   * @throws {ApiError} If task not found or validation fails
   */
  async updateTask(taskId, updateData, userId) {
    // Check if task exists and belongs to user
    const existingTask = await this.taskRepository.findByIdAndUser(taskId, userId);
    if (!existingTask) {
      throw new ApiError(404, 'Task not found or access denied');
    }

    // Prevent changing the user ID
    if (updateData.user && updateData.user !== userId) {
      throw new ApiError(403, 'Cannot change task ownership');
    }

    const updatedTask = await this.taskRepository.update(taskId, updateData);
    if (!updatedTask) {
      throw new ApiError(404, 'Task not found');
    }

    return updatedTask;
  }

  /**
   * Delete a task
   * @param {string} taskId - Task's ID
   * @param {string} userId - User's ID
   * @returns {Promise<Object>} Deleted task
   * @throws {ApiError} If task not found
   */
  async deleteTask(taskId, userId) {
    // Check if task exists and belongs to user
    const existingTask = await this.taskRepository.findByIdAndUser(taskId, userId);
    if (!existingTask) {
      throw new ApiError(404, 'Task not found or access denied');
    }

    const deletedTask = await this.taskRepository.delete(taskId);
    if (!deletedTask) {
      throw new ApiError(404, 'Task not found');
    }

    return deletedTask;
  }
}

module.exports = TaskService;