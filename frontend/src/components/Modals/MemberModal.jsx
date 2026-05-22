import React, { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { X, UserPlus, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MemberModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123'); // Default secure testing password
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Name and email are required fields');
      return;
    }

    try {
      setLoading(true);
      // Create user using a standard auth register payload, but let Admin assign roles directly
      const payload = { name, email, password };
      const res = await api.post('/auth/register', payload);
      
      // If Admin specified a different role (Admin), change it via the team API!
      const createdUser = res.data.data;
      if (role !== 'Member') {
        await api.put(`/team/${createdUser._id}/role`, { role });
      }

      toast.success(`Successfully registered ${name} in the organization!`);
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
          className="glass-panel border border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/20">
            <div className="flex items-center gap-2 text-neon-cyan">
              <UserPlus className="w-5 h-5 text-neon-cyan" />
              <h2 className="text-lg font-bold text-white font-display">
                Add Team Member
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
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Member Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-neon-rose">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marie Curie"
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                required
              />
            </div>

            {/* Member Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-neon-rose">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marie@organization.com"
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                required
              />
            </div>

            {/* Default Password Info */}
            <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 text-xs text-gray-400 space-y-1">
              <div className="flex items-center gap-1.5 text-neon-gold mb-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="font-bold uppercase tracking-wider text-[10px]">Security Credentials</span>
              </div>
              <p>Default login password will be set to: <strong className="text-white">password123</strong></p>
              <p>New team members can update this in their profile panel upon logging in.</p>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Organizational Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-neon-cyan transition-colors [&>option]:bg-bg-dark"
              >
                <option value="Member">Member (View & update assigned tasks only)</option>
                <option value="Admin">Admin (Full administrative dashboard privileges)</option>
              </select>
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
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90 shadow-lg shadow-cyan-950/20 transition-all"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Register User'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MemberModal;
