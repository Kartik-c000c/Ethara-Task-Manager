import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { X, Calendar, User, MessageSquare, Send, BellRing, ClipboardCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const TaskDetailsModal = ({ isOpen, onClose, taskId, onStatusChange }) => {
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const commentEndRef = useRef(null);

  // Load task details and comments
  useEffect(() => {
    if (isOpen && taskId) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          const [taskRes, commentsRes] = await Promise.all([
            api.get(`/tasks/${taskId}`),
            api.get(`/tasks/${taskId}/comments`),
          ]);
          setTask(taskRes.data.data);
          setComments(commentsRes.data.data);
        } catch (err) {
          toast.error('Failed to load task details');
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, taskId]);

  // Scroll to bottom of comments list
  useEffect(() => {
    if (comments.length > 0) {
      commentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const res = await api.post(`/tasks/${taskId}/comments`, { text: newComment });
      setComments([...comments, res.data.data]);
      setNewComment('');
      toast.success('Comment logged!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleProgressChange = async (newPercent) => {
    try {
      // Optimistically update
      setTask((prev) => ({ ...prev, percentageCompleted: Number(newPercent) }));

      const res = await api.put(`/tasks/${taskId}`, {
        percentageCompleted: Number(newPercent),
      });

      setTask(res.data.data);
      toast.success(`Task progress updated to ${newPercent}%`);
    } catch (err) {
      toast.error(err.message || 'Failed to update progress ratio');
    }
  };

  // Convert priority styles
  const getPriorityStyle = (priority) => {
    if (priority === 'High') {
      return 'bg-neon-rose/10 text-neon-rose border border-neon-rose/20 shadow-[0_0_10px_rgba(244,63,94,0.15)]';
    }
    if (priority === 'Medium') {
      return 'bg-neon-gold/10 text-neon-gold border border-neon-gold/20 shadow-[0_0_10px_rgba(245,158,11,0.15)]';
    }
    return 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-[0_0_10px_rgba(6,182,212,0.15)]';
  };

  // Detect overdue automatically
  const isOverdue = (task) => {
    if (!task) return false;
    return new Date(task.dueDate) < new Date() && task.status !== 'Completed';
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

        {/* Modal panel container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className={`glass-panel border w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden z-10 h-[85vh] flex flex-col transition-all duration-300 ${
            isOverdue(task) ? 'border-neon-rose/30 shadow-[0_0_25px_rgba(244,63,94,0.1)]' : 'border-white/10'
          }`}
        >
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-neon-cyan animate-spin" />
              </div>
              <p className="text-sm text-gray-500 mt-4 italic">Assembling task context...</p>
            </div>
          ) : (
            task && (
              <>
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-neon-purple shadow-[0_0_12px_rgba(139,92,246,0.1)]">
                      <ClipboardCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                        Project Task details
                      </span>
                      <h2 className="text-lg font-bold text-gray-100 truncate font-display max-w-md">
                        {task.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Overdue alert indicator */}
                    {isOverdue(task) && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neon-rose/20 text-neon-rose border border-neon-rose/30 shadow-[0_0_12px_rgba(244,63,94,0.25)] animate-pulse">
                        <BellRing className="w-3.5 h-3.5" />
                        <span>OVERDUE</span>
                      </span>
                    )}

                    <button
                      onClick={onClose}
                      className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Body container split */}
                <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-5">
                  {/* Left task details space */}
                  <div className="md:col-span-3 p-6 overflow-y-auto space-y-5 border-r border-white/5 bg-gray-950/10">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Task Summary Description
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed bg-white/5 border border-white/5 p-4 rounded-xl">
                        {task.description || (
                          <span className="text-gray-500 italic">No summary description provided.</span>
                        )}
                      </p>
                    </div>

                    {/* Metadata indicators */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Due Deadline
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Calendar className={`w-4 h-4 ${isOverdue(task) ? 'text-neon-rose animate-pulse' : 'text-gray-500'}`} />
                          <span className={isOverdue(task) ? 'text-neon-rose font-bold' : ''}>
                            {new Date(task.dueDate).toLocaleDateString(undefined, {
                              dateStyle: 'medium',
                            })}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Priority Rating
                        </h4>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    {/* Progress Slider (New Feature 🚀) */}
                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Task Completion Ratio
                        </h4>
                        <span className="text-xs font-extrabold text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded-full border border-neon-cyan/20 shadow-[0_0_8px_rgba(6,182,212,0.1)]">
                          {task.percentageCompleted || 0}%
                        </span>
                      </div>

                      {/* Interactive Slider for Assignee and Admins */}
                      {user && (task.assignedTo?._id === user._id || user.role === 'Admin') ? (
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={task.percentageCompleted || 0}
                            onChange={(e) => setTask({ ...task, percentageCompleted: Number(e.target.value) })}
                            onMouseUp={() => handleProgressChange(task.percentageCompleted)}
                            onTouchEnd={() => handleProgressChange(task.percentageCompleted)}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                          />
                          <p className="text-[10px] text-gray-400">
                            Drag slider to log completed milestone progress (changes auto-sync on release).
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1.5">
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div
                              className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full transition-all duration-300"
                              style={{ width: `${task.percentageCompleted || 0}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-gray-500 italic">
                            Only assigned member ({task.assignedTo?.name || 'Unassigned'}) or Admins can modify progress logs.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Assignee space */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Assigned Node
                      </h4>
                      {task.assignedTo ? (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-white/5 w-fit">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs border border-white/10"
                            style={{ backgroundColor: task.assignedTo.avatarColor }}
                          >
                            {task.assignedTo.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-200 block">
                              {task.assignedTo.name}
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold">
                              {task.assignedTo.role}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No member assigned.</p>
                      )}
                    </div>

                    {/* Created by */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                      <span>Associated Project: <strong className="text-neon-cyan">{task.project?.title}</strong></span>
                      <span>Logged by: {task.createdBy?.name || 'Admin'}</span>
                    </div>
                  </div>

                  {/* Right Chat-style comments section */}
                  <div className="md:col-span-2 flex flex-col overflow-hidden bg-gray-950/20">
                    <div className="px-4 py-3.5 border-b border-white/5 flex items-center gap-2 bg-gray-950/10">
                      <MessageSquare className="w-4 h-4 text-neon-cyan" />
                      <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Task Discussion Feed ({comments.length})
                      </span>
                    </div>

                    {/* Comments list container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {comments.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                          <MessageSquare className="w-8 h-8 text-gray-600 mb-2" />
                          <p className="text-xs text-gray-500 italic">
                            No comment entries logged yet. Start the task conversation!
                          </p>
                        </div>
                      ) : (
                        comments.map((comment) => (
                          <div key={comment._id} className="flex gap-2.5 items-start">
                            {/* Avatar */}
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-[10px] shrink-0 border border-white/10"
                              style={{ backgroundColor: comment.user?.avatarColor || '#8b5cf6' }}
                            >
                              {(comment.user?.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            {/* Message Bubble */}
                            <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-2.5 max-w-[85%]">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[10px] font-bold text-gray-300 truncate">
                                  {comment.user?.name}
                                </span>
                                <span className="text-[8px] text-gray-500 shrink-0">
                                  {new Date(comment.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={commentEndRef} />
                    </div>

                    {/* Write comment Form */}
                    <form
                      onSubmit={handlePostComment}
                      className="p-3 border-t border-white/5 bg-gray-950/30 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Type standard comment update..."
                        className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                        disabled={commentLoading}
                      />
                      <button
                        type="submit"
                        className="p-2 rounded-xl bg-neon-cyan hover:opacity-90 shadow-lg shadow-cyan-950/20 text-white transition-opacity shrink-0"
                        disabled={commentLoading || !newComment.trim()}
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskDetailsModal;
