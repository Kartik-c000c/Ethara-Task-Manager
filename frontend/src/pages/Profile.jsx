import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';
import toast from 'react-hot-toast';
import { User, Mail, ShieldAlert, Sparkles, ClipboardCheck, ClipboardList, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { themes, applyTheme, getActiveTheme } from '../utils/theme';

const Profile = () => {
  const { user } = useAuth();
  const [profileStats, setProfileStats] = useState({
    assignedCount: 0,
    completedCount: 0,
    projectCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState(getActiveTheme());

  const handleThemeChange = (themeId) => {
    applyTheme(themeId);
    setActiveTheme(getActiveTheme());
    toast.success('Visual core accent updated system-wide!');
  };

  useEffect(() => {
    const fetchProfileStats = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [tasksRes, projectsRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/projects'),
        ]);

        const tasks = tasksRes.data.data;
        const projects = projectsRes.data.data;

        // Tasks assigned to user
        const assignedTasks = tasks.filter((t) => t.assignedTo?._id === user._id);
        const completedTasks = assignedTasks.filter((t) => t.status === 'Completed');

        setProfileStats({
          assignedCount: assignedTasks.length,
          completedCount: completedTasks.length,
          projectCount: projects.length, // Total projects user is registered in
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileStats();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="p-6 glass-panel border border-white/10 rounded-2xl bg-gradient-to-r from-gray-950 via-bg-dark to-gray-950 shadow-md">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-neon-purple" />
          <span>Profile Dashboard</span>
        </h2>
        <p className="text-gray-400 text-xs mt-1">
          Review node allocations, collaboration statistics, and system roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Avatar details card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Big circular avatar */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center font-extrabold text-white text-3xl border-4 border-white/10 shadow-xl relative mt-4 mb-4 hover:rotate-3 transition-transform"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>

          <h3 className="text-lg font-bold text-gray-100">{user.name}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
            <Mail className="w-3.5 h-3.5 text-neon-cyan" />
            <span>{user.email}</span>
          </p>

          <span
            className={`text-[9px] px-3 py-1 mt-4 rounded-full font-bold uppercase tracking-wider ${
              user.role === 'Admin'
                ? 'bg-neon-rose/10 text-neon-rose border border-neon-rose/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
                : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
            }`}
          >
            {user.role} Status
          </span>
        </motion.div>

        {/* Right stats indices cards */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => <LoadingSkeleton key={i} height="h-28" />)
            ) : (
              <>
                <div className="glass-panel border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-neon-cyan/20 transition-all duration-300">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <ClipboardList className="w-3.5 h-3.5 text-neon-cyan" />
                    <span>Assigned Tasks</span>
                  </span>
                  <span className="text-3xl font-extrabold text-white font-display mt-3">
                    {profileStats.assignedCount}
                  </span>
                </div>

                <div className="glass-panel border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-neon-emerald/20 transition-all duration-300">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <ClipboardCheck className="w-3.5 h-3.5 text-neon-emerald" />
                    <span>Tasks Completed</span>
                  </span>
                  <span className="text-3xl font-extrabold text-white font-display mt-3">
                    {profileStats.completedCount}
                  </span>
                </div>

                <div className="glass-panel border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-neon-purple/20 transition-all duration-300">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <LayoutGrid className="w-3.5 h-3.5 text-neon-purple" />
                    <span>Active Projects</span>
                  </span>
                  <span className="text-3xl font-extrabold text-white font-display mt-3">
                    {profileStats.projectCount}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Accent Glow Theme Customizer */}
          <div className="glass-panel border border-white/5 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-neon-cyan animate-pulse" />
              <span>Accent Glow Customizer</span>
            </h3>
            <p className="text-xs text-gray-400">
              Customize the system-wide visual mood with dynamic neon gradients and glows.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {themes.map((theme) => {
                const isActive = activeTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`relative p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                      isActive
                        ? 'border-neon-cyan bg-white/5 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-200">{theme.name}</span>
                      <div className="flex gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/10"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/10"
                          style={{ backgroundColor: theme.secondary }}
                        />
                      </div>
                    </div>
                    {isActive && (
                      <span className="absolute bottom-1 right-2 text-[8px] font-extrabold text-neon-cyan uppercase tracking-wider">
                        Active Mode
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* System metadata access guidelines info panel */}
          <div className="glass-panel border border-white/5 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-neon-gold" />
              <span>Platform Access Policies guidelines</span>
            </h3>
            
            <div className="space-y-3.5 text-xs text-gray-400 leading-relaxed">
              <p>
                The <strong>Team Task Manager</strong> platform enforces strict role-based access controls (RBAC) to secure organization schemas and parameters logs.
              </p>
              
              <ul className="list-disc pl-4 space-y-2">
                <li>
                  <strong className="text-white">Admin Privileges:</strong> Full creation, editing, members enrollment management, task publishing, and cascade deletion capacities.
                </li>
                <li>
                  <strong className="text-white">Member Privileges:</strong> Board visibility restricted strictly to project associations. Drag-and-drop actions limited explicitly to tasks assigned to your node (only status field updates allowed).
                </li>
              </ul>

              <div className="p-3.5 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20 text-neon-cyan flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon-cyan animate-pulse" />
                <span className="font-semibold text-[11px]">Your workspace privileges are secure and active.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
