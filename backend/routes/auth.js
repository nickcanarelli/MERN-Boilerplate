const express = require('express');
const router = express.Router();

// Import Controller
const {
  register,
  accountActivation,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');

// Import Validators
const {
  userRegisterValidator,
  userLoginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth');
const { runValidation } = require('../validators');

router.post('/register', userRegisterValidator, runValidation, register);
router.post('/account-activation', accountActivation);
router.post('/login', userLoginValidator, runValidation, login);
router.put(
  '/forgot-password',
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  '/reset-password',
  resetPasswordValidator,
  runValidation,
  resetPassword
);

module.exports = router;
