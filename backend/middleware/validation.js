const { validationResult, check } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

const registerRules = [
  check('name', 'Name is required').notEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
];

const loginRules = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists(),
];

const projectRules = [
  check('title', 'Project title is required').notEmpty().trim(),
  check('description', 'Project description is required').notEmpty(),
  check('deadline', 'Valid project deadline is required').isISO8601().toDate(),
];

const taskRules = [
  check('title', 'Task title is required').notEmpty().trim(),
  check('dueDate', 'Valid due date is required').isISO8601().toDate(),
  check('project', 'Associated project ID must be a valid MongoDB ObjectId').isMongoId(),
];

module.exports = {
  validateRequest,
  registerRules,
  loginRules,
  projectRules,
  taskRules,
};
