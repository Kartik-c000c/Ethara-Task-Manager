import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { X, Calendar, Users, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectModal = ({ isOpen, onClose, project = null, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('Active');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all team members on mount
  useEffect(() => {
    if (isOpen) {
      const fetchMembers = async () => {
        try {
          const res = await api.get('/team');
          setAllMembers(res.data.data);
        } catch (err) {
          console.error('Failed to load team roster', err.message);
        }
      };
      fetchMembers();
    }
  }, [isOpen]);

  // Set fields if editing existing project
  useEffect(() => {
    if (isOpen && project) {
      setTitle(project.title);
      setDescription(project.description);
      // Format deadline to yyyy-MM-dd for calendar input
      const date = new Date(project.deadline);
      const formattedDate = date.toISOString().split('T')[0];
      setDeadline(formattedDate);
      setStatus(project.status);
      setSelectedMembers(project.members?.map((m) => m._id) || []);
    } else if (isOpen) {
      // Clear fields for create mode
      setTitle('');
      setDescription('');
      setDeadline('');
      setStatus('Active');
      setSelectedMembers([]);
    }
  }, [isOpen, project]);

  const handleMemberToggle = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title,
        description,
        deadline,
        status,
        members: selectedMembers,
      };

      if (project) {
        // Edit mode
        await api.put(`/projects/${project._id}`, payload);
        toast.success('Project details modified successfully!');
      } else {
        // Create mode
        await api.post('/projects', payload);
        toast.success('New Project initialized successfully!');
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

        {/* Modal panel */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="glass-panel border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/20">
            <div className="flex items-center gap-2 text-neon-cyan">
              <Briefcase className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white font-display">
                {project ? 'Edit Active Project' : 'Initialize New Project'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form scrollable container */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Project Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Project Title <span className="text-neon-rose">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Apollo Portal Redesign"
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                required
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Detailed Description <span className="text-neon-rose">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe project deliverables..."
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                required
              />
            </div>

            {/* Deadline & Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Deadline Date <span className="text-neon-rose">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Project Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-neon-cyan transition-colors [&>option]:bg-bg-dark"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>

            {/* Team Members List */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-neon-purple" />
                <span>Enrolled Team Members</span>
              </label>
              
              <div className="border border-white/5 rounded-xl bg-black/20 p-3 max-h-40 overflow-y-auto space-y-2">
                {allMembers.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No registered members found.</p>
                ) : (
                  allMembers.map((member) => {
                    const isSelected = selectedMembers.includes(member._id);
                    return (
                      <div
                        key={member._id}
                        onClick={() => handleMemberToggle(member._id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-neon-cyan/10 border-neon-cyan/30 text-white'
                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-[10px]"
                            style={{ backgroundColor: member.avatarColor }}
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-semibold">{member.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 italic uppercase mr-1">
                          {member.role}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Action buttons */}
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
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90 shadow-lg shadow-cyan-950/20 transition-all"
                disabled={loading}
              >
                {loading ? 'Processing...' : project ? 'Save Changes' : 'Initialize Project'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
