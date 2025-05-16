const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const { createTaskSchema, updateTaskSchema } = require('../validations/taskValidation');

const taskController = new TaskController();


router.use(protect);

router.post(
  '/',
  validateRequest(createTaskSchema),
  taskController.createTask
);


router.get('/', taskController.getTasks);


router.get('/:id', taskController.getTask);

router.put(
  '/:id',
  validateRequest(updateTaskSchema),
  taskController.updateTask
);

router.delete('/:id', taskController.deleteTask);

module.exports = router;