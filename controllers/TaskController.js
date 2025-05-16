const TaskService = require('../services/TaskService');
const ApiResponse = require('../utils/apiResponse');


class TaskController {
  constructor() {
    this.taskService = new TaskService();
  }

  
  createTask = async (req, res, next) => {
    try {
      const task = await this.taskService.createTask(req.body, req.user.id);
      ApiResponse.success(res, 'Task created successfully', task, 201);
    } catch (err) {
      next(err);
    }
  };

  
  getTasks = async (req, res, next) => {
    try {
      const result = await this.taskService.getTasks(req.user.id, req.query);
      ApiResponse.success(res, 'Tasks retrieved successfully', result);
    } catch (err) {
      next(err);
    }
  };

  
  getTask = async (req, res, next) => {
    try {
      const task = await this.taskService.getTask(req.params.id, req.user.id);
      ApiResponse.success(res, 'Task retrieved successfully', task);
    } catch (err) {
      next(err);
    }
  };

 
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