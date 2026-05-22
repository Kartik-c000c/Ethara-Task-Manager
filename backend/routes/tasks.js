const express = require('express');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getComments,
  addComment,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');
const { taskRules, validateRequest } = require('../middleware/validation');

const router = express.Router();

router.use(protect); // Secure all task routes

router
  .route('/')
  .get(getTasks)
  .post(authorize('Admin'), taskRules, validateRequest, createTask);

router
  .route('/:id')
  .get(getTaskById)
  .put(updateTask) // Authorization handled internally in controller for role-specific rules
  .delete(authorize('Admin'), deleteTask);

router
  .route('/:id/comments')
  .get(getComments)
  .post(addComment);

module.exports = router;
