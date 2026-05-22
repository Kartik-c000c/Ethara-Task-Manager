const express = require('express');
const { getTeamMembers, updateUserRole, removeTeamMember } = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Secure all team routes

router.get('/', getTeamMembers);
router.put('/:id/role', authorize('Admin'), updateUserRole);
router.delete('/:id', authorize('Admin'), removeTeamMember);

module.exports = router;
