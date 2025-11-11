import { body, param, validationResult } from 'express-validator';
// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            data: { errors: errors.array().map(err => err.msg) }
        });
        return;
    }
    next();
};
// User validation rules
export const validateUserCreation = [
    body('username')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Username must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .optional()
        .isIn(['admin', 'cashier'])
        .withMessage('Role must be either admin or cashier')
];
export const validateUserUpdate = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Username must be between 2 and 100 characters'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .optional()
        .isIn(['admin', 'cashier'])
        .withMessage('Role must be either admin or cashier')
];
// Item validation rules
export const validateItemCreation = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Item name is required and must be less than 100 characters'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('category')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category is required and must be less than 50 characters'),
    body('stock_quantity')
        .isInt({ min: 0 })
        .withMessage('Stock quantity must be a non-negative integer')
];
export const validateItemUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Item name must be less than 100 characters'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be less than 50 characters'),
    body('stock_quantity')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock quantity must be a non-negative integer')
];
// Customer validation rules
export const validateCustomerCreation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Customer name must be between 2 and 100 characters'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('phone')
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
    body('address')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Address must be less than 500 characters')
];
export const validateCustomerUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Customer name must be between 2 and 100 characters'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
    body('address')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Address must be less than 500 characters')
];
// Order validation rules
export const validateOrderCreation = [
    body('customerid')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Customer ID must be a positive integer'),
    body('items')
        .isArray({ min: 1 })
        .withMessage('Items array is required and must contain at least one item'),
    body('items.*.itemid')
        .isInt({ min: 1 })
        .withMessage('Each item must have a valid item ID'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1')
];
export const validateOrderUpdate = [
    body('status')
        .optional()
        .isIn(['pending', 'completed', 'cancelled'])
        .withMessage('Status must be pending, completed, or cancelled')
];
// Authentication validation rules
export const validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('Username is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];
// Parameter validation
export const validateIdParam = [
    param('id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer'),
    param('userid')
        .optional()
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),
    param('itemid')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Item ID must be a positive integer'),
    param('customerid')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Customer ID must be a positive integer'),
    param('orderid')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Order ID must be a positive integer')
];
//# sourceMappingURL=index.js.map