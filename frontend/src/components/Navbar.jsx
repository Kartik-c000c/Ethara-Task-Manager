import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Layout, BellRing, Clock } from 'lucide-react';
import api from '../utils/api';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [activities, setActivities] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Convert path to display titles
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Hub';
    if (path === '/projects') return 'Active Projects';
    if (path === '/tasks') return 'Kanban Taskboard';
    if (path === '/team') return 'Team Roster';
    if (path === '/activity') return 'Organization Activity Logs';
    if (path === '/profile') return 'Account Profiles';
    return 'Team Task Manager';
  };

  // Fetch recent activities for notification dropdown
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get('/activities');
        const logs = res.data.data || [];
        setActivities(logs.slice(0, 5)); // Take latest 5 events
        
        // Calculate unread count based on last viewed timestamp
        const lastViewed = localStorage.getItem('lastViewedNotifications');
        if (!lastViewed) {
          setUnreadCount(logs.length);
        } else {
          const unread = logs.filter(act => new Date(act.createdAt) > new Date(lastViewed)).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error('Failed to load recent notifications', err);
      }
    };
    if (user) {
      fetchActivities();
    }
  }, [user, location.pathname]); // Refresh when user changes or page changes

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8 border-b border-white/5 bg-gray-950/20 backdrop-blur-md shadow-sm">
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white font-display">
          {getHeaderTitle()}
        </h1>
      </div>

      {/* Action controls right */}
      <div className="flex items-center gap-6">
        {/* Status notification dot */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => {
              const nextState = !showNotifications;
              setShowNotifications(nextState);
              if (nextState) {
                // Mark as read by saving current timestamp
                localStorage.setItem('lastViewedNotifications', new Date().toISOString());
                setUnreadCount(0);
              }
            }}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group text-gray-400 hover:text-gray-200 relative"
          >
            <BellRing className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#06b6d4]" />
            )}
          </div>

          {/* Floating Notification Popover Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-gray-950/95 backdrop-blur-2xl p-4 shadow-2xl z-50 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">Workspace Alerts</span>
                <span className="text-[9px] text-neon-cyan font-bold bg-neon-cyan/10 px-2.5 py-0.5 rounded-full">Recent</span>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {activities.length === 0 ? (
                  <p className="text-xs text-gray-500 italic text-center py-4">No recent activity logs.</p>
                ) : (
                  activities.map((act) => (
                    <div key={act._id} className="text-left text-xs p-2.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                      <p className="text-gray-300 font-medium leading-relaxed">{act.details}</p>
                      <span className="text-[9px] text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-2.5 h-2.5 text-neon-cyan" />
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 border-t border-white/5">
                <Link
                  to="/activity"
                  onClick={() => setShowNotifications(false)}
                  className="block text-center text-xs font-bold text-neon-cyan hover:text-neon-purple transition-colors"
                >
                  View All Activities
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-white/10" />

        {/* Organization Space metadata */}
        <Link
          to="/projects"
          className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-opacity"
        >
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-neon-cyan shadow-[0_0_12px_rgba(6,182,212,0.1)] group-hover:border-neon-cyan/20 transition-all">
            <Layout className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Workspace</p>
            <p className="text-sm font-bold text-gray-100 flex items-center gap-1.5 justify-end">
              <span>Main Node</span>
              {user?.role === 'Admin' && (
                <Shield className="w-3.5 h-3.5 text-neon-rose glow-text-rose" />
              )}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
