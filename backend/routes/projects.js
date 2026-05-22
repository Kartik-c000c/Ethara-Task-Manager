const express = require('express');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');
const { projectRules, validateRequest } = require('../middleware/validation');

const router = express.Router();

router.use(protect); // Secure all project routes

router
  .route('/')
  .get(getProjects)
  .post(authorize('Admin'), projectRules, validateRequest, createProject);

router
  .route('/:id')
  .get(getProjectById)
  .put(authorize('Admin'), projectRules, validateRequest, updateProject)
  .delete(authorize('Admin'), deleteProject);

module.exports = router;
