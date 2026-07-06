const { body, param, query } = require('express-validator');

exports.validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be 3-50 characters'),
  body('email')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

exports.validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password required')
];

exports.validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be 3-100 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock_quantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
];

exports.validateSale = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item required'),
  body('items.*.product_id')
    .isInt()
    .withMessage('Product ID must be an integer'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('payment_method')
    .isIn(['cash', 'card', 'mobile_payment'])
    .withMessage('Invalid payment method')
];
