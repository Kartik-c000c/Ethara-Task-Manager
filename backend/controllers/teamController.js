const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

// @desc    Get all registered team members
// @route   GET /api/team
// @access  Private
const getTeamMembers = async (req, res) => {
  try {
    const members = await User.find({}).sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change a user's role
// @route   PUT /api/team/:id/role
// @access  Private (Admin Only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['Admin', 'Member'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid role (Admin or Member)' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent Admin from demoting themselves to avoid lockouts
    if (user._id.toString() === req.user._id.toString() && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'You cannot change your own admin role status' });
    }

    user.role = role;
    await user.save();

    // Log activity
    await Activity.create({
      type: 'MEMBER_ADD', // Event capturing team membership adjustments
      user: req.user._id,
      details: `changed role of "${user.name}" to "${role}"`,
    });

    res.status(200).json({
      success: true,
      message: `Updated role of ${user.name} to ${role}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove a user from team database
// @route   DELETE /api/team/:id
// @access  Private (Admin Only)
const removeTeamMember = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting oneself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot remove yourself from the system' });
    }

    const name = user.name;

    // Remove user from all projects' members array
    await Project.updateMany(
      { members: user._id },
      { $pull: { members: user._id } }
    );

    // Unassign user from all their tasks
    await Task.updateMany(
      { assignedTo: user._id },
      { $unset: { assignedTo: '' } }
    );

    // Delete user from db
    await User.findByIdAndDelete(req.params.id);

    // Log activity
    await Activity.create({
      type: 'MEMBER_REMOVE',
      user: req.user._id,
      details: `removed member "${name}" from the organization`,
    });

    res.status(200).json({
      success: true,
      message: `User ${name} has been removed from the system`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTeamMembers,
  updateUserRole,
  removeTeamMember,
};
