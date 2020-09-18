const { check } = require('express-validator');

exports.userRegisterValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Email is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

exports.userLoginValidator = [
  check('email').isEmail().withMessage('Email is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

exports.forgotPasswordValidator = [
  check('email').not().isEmpty().isEmail().withMessage('Email is required'),
];

exports.resetPasswordValidator = [
  check('newPassword')
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];
