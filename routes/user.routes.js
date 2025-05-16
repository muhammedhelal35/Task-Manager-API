const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const { registerSchema, loginSchema, updateSchema, changePasswordSchema } = require('../validations/userValidation');

const userController = new UserController();


router.post(
  '/register',
  validateRequest(registerSchema),
  userController.register
);


router.post(
  '/login',
  validateRequest(loginSchema),
  userController.login
);

router.use(protect);

router.get('/me', userController.getMe);


router.post('/logout', userController.logout);


router.put(
  '/update',
  validateRequest(updateSchema),
  userController.updateDetails
);


router.put(
  '/change-password',
  validateRequest(changePasswordSchema),
  userController.changePassword
);

router.delete('/delete-account', userController.deleteAccount);

module.exports = router;