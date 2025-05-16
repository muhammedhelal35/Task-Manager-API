const TaskRepository = require('../repositories/TaskRepository');
const ApiError = require('../utils/apiError');

class TaskService {
  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async createTask(taskData, userId) {
    
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

  async getTasks(userId, query) {
    return await this.taskRepository.findAllByUser(userId, query);
  }

  async getTask(taskId, userId) {
    const task = await this.taskRepository.findByIdAndUser(taskId, userId);
    if (!task) {
      throw new ApiError(404, 'Task not found or access denied');
    }
    return task;
  }

  async updateTask(taskId, updateData, userId) {
    const existingTask = await this.taskRepository.findByIdAndUser(taskId, userId);
    if (!existingTask) {
      throw new ApiError(404, 'Task not found or access denied');
    }

    
    if (updateData.user && updateData.user !== userId) {
      throw new ApiError(403, 'Cannot change task ownership');
    }

    const updatedTask = await this.taskRepository.update(taskId, updateData);
    if (!updatedTask) {
      throw new ApiError(404, 'Task not found');
    }

    return updatedTask;
  }

  async deleteTask(taskId, userId) {
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