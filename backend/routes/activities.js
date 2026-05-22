const express = require('express');
const { getActivities, deleteActivity, clearActivities } = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Secure all activity routes

router.get('/', getActivities);
router.delete('/:id', authorize('Admin'), deleteActivity);
router.delete('/', authorize('Admin'), clearActivities);

module.exports = router;
