import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import MemberModal from '../components/Modals/MemberModal';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';
import EmptyState from '../components/UI/EmptyState';
import toast from 'react-hot-toast';
import { Users, Search, Plus, UserCheck, ShieldAlert, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/team');
      setMembers(res.data.data);
    } catch (err) {
      toast.error('Failed to load team roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleRoleToggle = async (memberId, currentRole) => {
    const newRole = currentRole === 'Admin' ? 'Member' : 'Admin';
    const confirmChange = window.confirm(
      `Are you sure you want to change this member's role to ${newRole}?`
    );
    if (!confirmChange) return;

    try {
      await api.put(`/team/${memberId}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchMembers();
    } catch (err) {
      toast.error(err.message || 'Failed to update member role');
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    const confirmRemove = window.confirm(
      `Are you sure you want to remove ${memberName} from the organization? This will unassign them from all tasks and pull them from all projects!`
    );
    if (!confirmRemove) return;

    try {
      await api.delete(`/team/${memberId}`);
      toast.success(`${memberName} has been removed from organization`);
      fetchMembers();
    } catch (err) {
      toast.error(err.message || 'Failed to remove member');
    }
  };

  // Filter members list based on search term
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 glass-panel border border-white/10 rounded-2xl bg-gradient-to-r from-gray-950 via-bg-dark to-gray-950 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-neon-cyan" />
            <span>Organization Team Hub</span>
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Manage organization members, search collaborators, and configure access roles.
          </p>
        </div>

        {/* Invite action (Admin only) */}
        {user?.role === 'Admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90 active:scale-[0.98] shadow-lg shadow-cyan-950/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* Roster Controls */}
      <div className="glass-panel border border-white/5 rounded-2xl p-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collaborators by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
          />
        </div>
      </div>

      {/* Roster List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => <LoadingSkeleton key={i} height="h-44" />)}
        </div>
      ) : filteredMembers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No collaborators matches"
          description="Clear search input or register a new team member."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`glass-panel border p-5 rounded-2xl flex flex-col justify-between items-center text-center relative overflow-hidden group transition-all duration-300 ${
                member.role === 'Admin'
                  ? 'border-neon-purple/20 bg-purple-950/5 shadow-[0_0_12px_rgba(139,92,246,0.06)]'
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              {/* Profile details */}
              <div className="space-y-4 w-full flex flex-col items-center mt-3">
                {/* Big Avatar */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-white text-xl border-2 border-white/10 shadow-lg relative group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-200 truncate max-w-full">
                    {member.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 truncate max-w-full mt-0.5">
                    {member.email}
                  </p>
                </div>

                {/* Role badges */}
                <span
                  className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    member.role === 'Admin'
                      ? 'bg-neon-rose/10 text-neon-rose border border-neon-rose/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
                      : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                  }`}
                >
                  {member.role}
                </span>
              </div>

              {/* Admin Actions buttons (bottom aligned) */}
              {user?.role === 'Admin' && member._id !== user._id && (
                <div className="pt-4 mt-5 border-t border-white/5 w-full flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleRoleToggle(member._id, member.role)}
                    className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-neon-purple transition-colors cursor-pointer"
                    title={member.role === 'Admin' ? 'Demote to Member' : 'Promote to Admin'}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Role</span>
                  </button>
                  
                  <div className="h-3 w-px bg-white/10" />

                  <button
                    onClick={() => handleRemoveMember(member._id, member.name)}
                    className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-neon-rose transition-colors cursor-pointer"
                    title="Remove Member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Member Creation Modal wrapper */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchMembers}
      />
    </div>
  );
};

export default Team;
