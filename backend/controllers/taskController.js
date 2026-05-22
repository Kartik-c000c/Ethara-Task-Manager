const Task = require('../models/Task');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const Comment = require('../models/Comment');

// @desc    Get all tasks with filtering
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { project, status, priority, search, overdue } = req.query;
    let query = {};

    // For Members, restrict to tasks assigned to them, or projects they are part of
    if (req.user.role !== 'Admin') {
      // Find projects the user belongs to
      const enrolledProjects = await Project.find({ members: req.user._id }).select('_id');
      const projectIds = enrolledProjects.map((p) => p._id);
      
      query.$or = [
        { assignedTo: req.user._id },
        { project: { $in: projectIds } }
      ];
    }

    // Apply query filters
    if (project) {
      // If we already have $or, we should merge the project condition
      if (query.$or) {
        query = { ...query, project };
      } else {
        query.project = project;
      }
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Overdue task logic: dueDate < now && status != 'Completed'
    if (overdue === 'true') {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: 'Completed' };
    }

    const tasks = await Task.find(query)
      .populate('project', 'title status')
      .populate('assignedTo', 'name email avatarColor role')
      .populate('createdBy', 'name email avatarColor')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get task details by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'title status members')
      .populate('assignedTo', 'name email avatarColor role')
      .populate('createdBy', 'name email avatarColor');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // RBAC check: member must be in the task's project
    if (
      req.user.role !== 'Admin' &&
      !task.project.members.some((m) => m.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (Admin Only)
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, project, percentageCompleted } = req.body;

    // Check project exists
    const proj = await Project.findById(project);
    if (!proj) {
      return res.status(404).json({ success: false, message: 'Associated project not found' });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate,
      assignedTo,
      project,
      percentageCompleted: percentageCompleted || 0,
      createdBy: req.user._id,
    });

    // Create activity log
    await Activity.create({
      type: 'TASK_CREATE',
      project,
      task: task._id,
      user: req.user._id,
      details: `created task "${title}" in project "${proj.title}"`,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { title, description, status, priority, dueDate, assignedTo, project, percentageCompleted } = req.body;

    // RBAC validation:
    // Members can ONLY update task status and percentageCompleted, and ONLY if the task is assigned to them.
    if (req.user.role !== 'Admin') {
      const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          message: 'Members can only update tasks assigned to them',
        });
      }

      // Ensure they only modified the 'status' or 'percentageCompleted' fields
      if (title || description || priority || dueDate || assignedTo || project) {
        return res.status(403).json({
          success: false,
          message: 'Members are restricted to updating only the status and percentageCompleted fields',
        });
      }

      const prevStatus = task.status;
      const prevPercent = task.percentageCompleted || 0;

      if (status !== undefined) task.status = status;
      if (percentageCompleted !== undefined) task.percentageCompleted = percentageCompleted;

      // Auto-state corrections
      if (task.percentageCompleted === 100 && task.status !== 'Completed') {
        task.status = 'Completed';
      }
      if (task.percentageCompleted > 0 && task.percentageCompleted < 100 && task.status === 'Todo') {
        task.status = 'In Progress';
      }
      if (task.status === 'Completed' && task.percentageCompleted !== 100) {
        task.percentageCompleted = 100;
      }
      if (task.status === 'Todo' && task.percentageCompleted !== 0) {
        task.percentageCompleted = 0;
      }

      await task.save();

      const populatedTask = await Task.findById(task._id)
        .populate('project', 'title status members')
        .populate('assignedTo', 'name email avatarColor role')
        .populate('createdBy', 'name email avatarColor');

      // Log activity for status update
      await Activity.create({
        type: 'TASK_STATUS',
        project: task.project,
        task: task._id,
        user: req.user._id,
        details: `updated progress of "${task.title}" to ${task.percentageCompleted}% (Status: "${task.status}")`,
      });

      return res.status(200).json({
        success: true,
        data: populatedTask,
      });
    }

    // Admin updates everything
    const prevStatus = task.status;
    const prevPercent = task.percentageCompleted || 0;

    let finalPercent = percentageCompleted !== undefined ? Number(percentageCompleted) : prevPercent;
    let finalStatus = status || prevStatus;

    if (finalPercent === 100 && finalStatus !== 'Completed') {
      finalStatus = 'Completed';
    }
    if (finalPercent > 0 && finalPercent < 100 && finalStatus === 'Todo') {
      finalStatus = 'In Progress';
    }
    if (status === 'Completed' && finalPercent !== 100) {
      finalPercent = 100;
    }
    if (status === 'Todo' && finalPercent !== 0) {
      finalPercent = 0;
    }
    
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        status: finalStatus, 
        priority, 
        dueDate, 
        assignedTo, 
        project, 
        percentageCompleted: finalPercent 
      },
      { new: true, runValidators: true }
    ).populate('project', 'title status members')
     .populate('assignedTo', 'name email avatarColor role')
     .populate('createdBy', 'name email avatarColor');

    // Identify if status/progress changed or generic update occurred
    const details =
      prevStatus !== task.status || prevPercent !== task.percentageCompleted
        ? `changed progress of "${task.title}" to ${task.percentageCompleted}% (Status: "${task.status}")`
        : `updated details for task "${task.title}"`;

    await Activity.create({
      type: prevStatus !== task.status ? 'TASK_STATUS' : 'TASK_UPDATE',
      project: task.project?._id || task.project,
      task: task._id,
      user: req.user._id,
      details,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin Only)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const title = task.title;
    const project = task.project;

    // Delete related comments
    await Comment.deleteMany({ task: task._id });

    // Delete the task itself
    await Task.findByIdAndDelete(req.params.id);

    // Create activity log
    await Activity.create({
      type: 'TASK_DELETE',
      project,
      user: req.user._id,
      details: `deleted task "${title}"`,
    });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get comments for a task
// @route   GET /api/tasks/:id/comments
// @access  Private
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.id })
      .populate('user', 'name email avatarColor role')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to a task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const comment = await Comment.create({
      task: req.params.id,
      user: req.user._id,
      text,
    });

    // Populate user profile before sending response
    const populatedComment = await Comment.findById(comment._id).populate(
      'user',
      'name email avatarColor role'
    );

    res.status(201).json({
      success: true,
      data: populatedComment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getComments,
  addComment,
};
