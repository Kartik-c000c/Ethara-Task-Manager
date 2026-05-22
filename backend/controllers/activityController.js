const Activity = require('../models/Activity');

// @desc    Get recent team activities
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({})
      .populate('user', 'name email avatarColor role')
      .populate('project', 'title')
      .populate('task', 'title')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a single activity log entry
// @route   DELETE /api/activities/:id
// @access  Private (Admin Only)
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity log not found' });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Activity log entry removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear all activity logs
// @route   DELETE /api/activities
// @access  Private (Admin Only)
const clearActivities = async (req, res) => {
  try {
    await Activity.deleteMany({});

    res.status(200).json({
      success: true,
      message: 'All activity logs cleared successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getActivities,
  deleteActivity,
  clearActivities,
};
