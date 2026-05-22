import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';
import EmptyState from '../components/UI/EmptyState';
import toast from 'react-hot-toast';
import {
  Activity as ActivityIcon,
  PlusCircle,
  CheckCircle,
  FileEdit,
  Trash,
  UserPlus,
  UserMinus,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Activity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/activities');
      setActivities(res.data.data);
    } catch (err) {
      toast.error('Failed to load activity histories logs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLog = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this activity log entry?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/activities/${id}`);
      toast.success('Activity log removed successfully');
      fetchActivities();
    } catch (err) {
      toast.error(err.message || 'Failed to remove activity log');
    }
  };

  const handleClearLogs = async () => {
    const confirmClear = window.confirm('WARNING: Are you sure you want to permanently delete ALL activity logs? This action cannot be undone!');
    if (!confirmClear) return;

    try {
      await api.delete('/activities');
      toast.success('All activity logs cleared successfully');
      fetchActivities();
    } catch (err) {
      toast.error(err.message || 'Failed to clear activity logs');
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Map event types to icons and glowing colors
  const getEventMeta = (type) => {
    switch (type) {
      case 'PROJECT_CREATE':
        return { icon: PlusCircle, color: 'text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5 shadow-[0_0_10px_rgba(6,182,212,0.15)]' };
      case 'TASK_CREATE':
        return { icon: PlusCircle, color: 'text-neon-purple border-neon-purple/20 bg-neon-purple/5 shadow-[0_0_10px_rgba(139,92,246,0.15)]' };
      case 'TASK_STATUS':
        return { icon: CheckCircle, color: 'text-neon-emerald border-neon-emerald/20 bg-neon-emerald/5 shadow-[0_0_10px_rgba(16,185,129,0.15)]' };
      case 'TASK_UPDATE':
      case 'PROJECT_UPDATE':
        return { icon: FileEdit, color: 'text-neon-gold border-neon-gold/20 bg-neon-gold/5 shadow-[0_0_10px_rgba(245,158,11,0.15)]' };
      case 'TASK_DELETE':
      case 'PROJECT_DELETE':
        return { icon: Trash, color: 'text-neon-rose border-neon-rose/20 bg-neon-rose/5 shadow-[0_0_10px_rgba(244,63,94,0.15)]' };
      case 'MEMBER_ADD':
        return { icon: UserPlus, color: 'text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5 shadow-[0_0_10px_rgba(6,182,212,0.15)]' };
      case 'MEMBER_REMOVE':
        return { icon: UserMinus, color: 'text-neon-rose border-neon-rose/20 bg-neon-rose/5 shadow-[0_0_10px_rgba(244,63,94,0.15)]' };
      default:
        return { icon: ActivityIcon, color: 'text-white border-white/10 bg-white/5 shadow-sm' };
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header Banner */}
      <div className="p-6 glass-panel border border-white/10 rounded-2xl bg-gradient-to-r from-gray-950 via-bg-dark to-gray-950 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-neon-cyan" />
              <span>Team Activity stream</span>
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Historical timeline auditing all projects modifications, tasks operations, and team adjustments.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === 'Admin' && activities.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-neon-rose/10 border border-neon-rose/20 text-neon-rose hover:bg-neon-rose/20 transition-all cursor-pointer"
              >
                <Trash className="w-3.5 h-3.5" />
                <span>Clear Feed</span>
              </button>
            )}
            <button
              onClick={fetchActivities}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/5 text-gray-300 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sync Feed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      {loading ? (
        <div className="space-y-4 max-w-3xl mx-auto">
          {Array(3)
            .fill(0)
            .map((_, i) => <LoadingSkeleton key={i} height="h-20" rounded="rounded-2xl" />)}
        </div>
      ) : activities.length === 0 ? (
        <EmptyState
          icon={ActivityIcon}
          title="Activity stream empty"
          description="Operational events will populate here chronologically once team boards become active."
        />
      ) : (
        <div className="max-w-3xl mx-auto relative pl-6 border-l border-white/5 space-y-6">
          {activities.map((activity, idx) => {
            const { icon: Icon, color } = getEventMeta(activity.type);
            return (
              <motion.div
                key={activity._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4 items-start shadow-sm hover:bg-white/10 transition-colors"
              >
                {/* Connector Timeline Dot indicator */}
                <div
                  className={`absolute -left-[37px] top-4 p-1.5 rounded-full border shrink-0 ${color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Event User Initials Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 border border-white/10 shadow-inner"
                  style={{ backgroundColor: activity.user?.avatarColor || '#8b5cf6' }}
                  title={`${activity.user?.name} (${activity.user?.role})`}
                >
                  {(activity.user?.name || 'U').charAt(0).toUpperCase()}
                </div>

                {/* Feed content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-200">
                      {activity.user?.name || 'Deleted User'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {user?.role === 'Admin' && (
                        <button
                          onClick={() => handleDeleteLog(activity._id)}
                          className="p-1 rounded-lg hover:bg-white/5 text-gray-500 hover:text-neon-rose transition-colors cursor-pointer"
                          title="Delete Log Entry"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                    Successfully <span className="text-gray-300 font-semibold">{activity.details}</span>
                  </p>
                  
                  {/* Embedded project/task tags references */}
                  {(activity.project || activity.task) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {activity.project && (
                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-neon-cyan/5 border border-neon-cyan/15 text-neon-cyan font-bold uppercase">
                          Project: {activity.project.title}
                        </span>
                      )}
                      {activity.task && (
                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-neon-purple/5 border border-neon-purple/15 text-neon-purple font-bold uppercase">
                          Task: {activity.task.title}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Activity;
