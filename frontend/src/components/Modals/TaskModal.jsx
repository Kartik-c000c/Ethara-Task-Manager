import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { X, Calendar, ClipboardList, UserCheck, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskModal = ({ isOpen, onClose, task = null, onSave, preselectedProjectId = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [project, setProject] = useState('');
  const [projectsList, setProjectsList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [percentageCompleted, setPercentageCompleted] = useState(0);

  // Load Projects and Members lists
  useEffect(() => {
    if (isOpen) {
      const loadOptions = async () => {
        try {
          const [projectsRes, teamRes] = await Promise.all([
            api.get('/projects'),
            api.get('/team'),
          ]);
          setProjectsList(projectsRes.data.data);
          setMembersList(teamRes.data.data);
        } catch (err) {
          toast.error('Failed to load project/members selectors');
        }
      };
      loadOptions();
    }
  }, [isOpen]);

  // Set fields on edit mode
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setStatus(task.status);
        setPriority(task.priority);
        const date = new Date(task.dueDate);
        const formattedDate = date.toISOString().split('T')[0];
        setDueDate(formattedDate);
        setAssignedTo(task.assignedTo?._id || '');
        setProject(task.project?._id || task.project || '');
        setPercentageCompleted(task.percentageCompleted || 0);
      } else {
        setTitle('');
        setDescription('');
        setStatus('Todo');
        setPriority('Medium');
        setDueDate('');
        setAssignedTo('');
        setProject(preselectedProjectId || '');
        setPercentageCompleted(0);
      }
    }
  }, [isOpen, task, preselectedProjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !dueDate || !project) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title,
        description,
        status,
        priority,
        dueDate,
        assignedTo: assignedTo || null,
        project,
        percentageCompleted: Number(percentageCompleted),
      };

      if (task) {
        // Edit mode
        await api.put(`/tasks/${task._id}`, payload);
        toast.success('Task details modified successfully!');
      } else {
        // Create mode
        await api.post('/tasks', payload);
        toast.success('Task logged and assigned successfully!');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop glass overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="glass-panel border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/20">
            <div className="flex items-center gap-2 text-neon-purple">
              <ClipboardList className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white font-display">
                {task ? 'Edit Board Task' : 'Register New Task'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form container */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Project Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Target Project <span className="text-neon-rose">*</span>
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-neon-cyan transition-colors [&>option]:bg-bg-dark"
                required
                disabled={!!preselectedProjectId}
              >
                <option value="">-- Choose Project --</option>
                {projectsList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Task Summary <span className="text-neon-rose">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Write frontend integrations tests"
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                required
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Task Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail deliverables and acceptance criteria..."
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors resize-none"
              />
            </div>

            {/* Due Date & Task Assignee */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Due Date <span className="text-neon-rose">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>Assign To</span>
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-neon-cyan transition-colors [&>option]:bg-bg-dark"
                >
                  <option value="">-- Unassigned --</option>
                  {membersList.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status & Priority Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Task Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-neon-cyan transition-colors [&>option]:bg-bg-dark"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-neon-gold" />
                  <span>Task Priority</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-neon-cyan transition-colors [&>option]:bg-bg-dark"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Completion Percentage Slider */}
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Task Completion Percentage ({percentageCompleted}%)
                </label>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={percentageCompleted}
                onChange={(e) => setPercentageCompleted(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
              />
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 bg-white/20">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/10 hover:bg-white/5 text-gray-400 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 shadow-lg shadow-purple-950/20 transition-all"
                disabled={loading}
              >
                {loading ? 'Processing...' : task ? 'Save Changes' : 'Publish Task'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;
