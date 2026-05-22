const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'TASK_CREATE',
      'TASK_STATUS',
      'TASK_UPDATE',
      'TASK_DELETE',
      'PROJECT_CREATE',
      'PROJECT_UPDATE',
      'PROJECT_DELETE',
      'MEMBER_ADD',
      'MEMBER_REMOVE',
    ],
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Activity', activitySchema);
