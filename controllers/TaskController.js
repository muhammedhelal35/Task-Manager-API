const TaskService = require('../services/TaskService');
const ApiResponse = require('../utils/apiResponse');


class TaskController {
  constructor() {
    this.taskService = new TaskService();
  }

  /**
   * Create a new task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  createTask = async (req, res, next) => {
    try {
      const task = await this.taskService.createTask(req.body, req.user.id);
      ApiResponse.success(res, 'Task created successfully', task, 201);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get all tasks for the current user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getTasks = async (req, res, next) => {
    try {
      const result = await this.taskService.getTasks(req.user.id, req.query);
      ApiResponse.success(res, 'Tasks retrieved successfully', result);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get a single task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getTask = async (req, res, next) => {
    try {
      const task = await this.taskService.getTask(req.params.id, req.user.id);
      ApiResponse.success(res, 'Task retrieved successfully', task);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Update a task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  updateTask = async (req, res, next) => {
    try {
      const task = await this.taskService.updateTask(
        req.params.id,
        req.body,
        req.user.id
      );
      ApiResponse.success(res, 'Task updated successfully', task);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Delete a task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  deleteTask = async (req, res, next) => {
    try {
      await this.taskService.deleteTask(req.params.id, req.user.id);
      ApiResponse.success(res, 'Task deleted successfully', null, 204);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = TaskController;