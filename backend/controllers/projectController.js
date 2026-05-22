const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    let query = {};
    
    // If not Admin, only show projects the user is a member of
    if (req.user.role !== 'Admin') {
      query.members = req.user._id;
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'name email avatarColor')
      .populate('members', 'name email avatarColor role')
      .sort({ createdAt: -1 });

    // For each project, fetch task completion statistics to dynamically calculate progress
    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...project.toObject(),
          totalTasks,
          completedTasks,
          progress,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: enrichedProjects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project details by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email avatarColor')
      .populate('members', 'name email avatarColor role');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // RBAC check: member must be enrolled, or user must be Admin
    if (req.user.role !== 'Admin' && !project.members.some((m) => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this project' });
    }

    const tasks = await Task.find({ project: project._id }).populate('assignedTo', 'name email avatarColor');
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        ...project.toObject(),
        tasks,
        totalTasks,
        completedTasks,
        progress,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Admin Only)
const createProject = async (req, res) => {
  try {
    const { title, description, deadline, status, members } = req.body;

    // Ensure Admin creates it
    const project = await Project.create({
      title,
      description,
      deadline,
      status: status || 'Active',
      createdBy: req.user._id,
      members: members || [req.user._id], // Default includes creator
    });

    // Create activity log
    await Activity.create({
      type: 'PROJECT_CREATE',
      project: project._id,
      user: req.user._id,
      details: `created project "${title}"`,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin Only)
const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { title, description, deadline, status, members } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (deadline !== undefined) updateFields.deadline = deadline;
    if (status !== undefined) updateFields.status = status;
    if (members !== undefined) updateFields.members = members;

    project = await Project.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    // Create activity log
    await Activity.create({
      type: 'PROJECT_UPDATE',
      project: project._id,
      user: req.user._id,
      details: `updated project details for "${project.title}"`,
    });

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin Only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const title = project.title;

    // Delete project tasks
    await Task.deleteMany({ project: project._id });

    // Delete the project
    await Project.findByIdAndDelete(req.params.id);

    // Create activity log
    await Activity.create({
      type: 'PROJECT_DELETE',
      user: req.user._id,
      details: `deleted project "${title}" and all its related tasks`,
    });

    res.status(200).json({
      success: true,
      message: 'Project and tasks deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
