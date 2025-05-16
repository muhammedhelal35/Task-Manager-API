const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const { createTaskSchema, updateTaskSchema } = require('../validations/taskValidation');

const taskController = new TaskController();

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post(
  '/',
  validateRequest(createTaskSchema),
  taskController.createTask
);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the current user
 * @access  Private
 */
router.get('/', taskController.getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task
 * @access  Private
 */
router.get('/:id', taskController.getTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put(
  '/:id',
  validateRequest(updateTaskSchema),
  taskController.updateTask
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;