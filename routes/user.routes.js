const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const { registerSchema, loginSchema, updateSchema, changePasswordSchema } = require('../validations/userValidation');

const userController = new UserController();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validateRequest(registerSchema),
  userController.register
);

/**
 * @route   POST /api/users/login
 * @desc    Login user & get token
 * @access  Public
 */
router.post(
  '/login',
  validateRequest(loginSchema),
  userController.login
);

// All routes below this middleware require authentication
router.use(protect);

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', userController.getMe);

/**
 * @route   POST /api/users/logout
 * @desc    Logout user (invalidate token)
 * @access  Private
 */
router.post('/logout', userController.logout);

/**
 * @route   PUT /api/users/update
 * @desc    Update user details
 * @access  Private
 */
router.put(
  '/update',
  validateRequest(updateSchema),
  userController.updateDetails
);

/**
 * @route   PUT /api/users/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put(
  '/change-password',
  validateRequest(changePasswordSchema),
  userController.changePassword
);

/**
 * @route   DELETE /api/users/delete-account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/delete-account', userController.deleteAccount);

module.exports = router;