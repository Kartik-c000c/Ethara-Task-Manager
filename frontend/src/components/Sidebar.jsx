import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  KanbanSquare,
  Users,
  Activity as ActivityIcon,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Projects', to: '/projects', icon: Briefcase },
    { name: 'Tasks Board', to: '/tasks', icon: KanbanSquare },
    { name: 'Team Hub', to: '/team', icon: Users },
    { name: 'Activity Feed', to: '/activity', icon: ActivityIcon },
    { name: 'Profile Account', to: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 fixed inset-y-0 left-0 z-20 flex flex-col justify-between glass-panel border-r border-white/5 bg-gray-950/20 backdrop-blur-xl">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-white/5 bg-gray-950/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-neon-cyan to-neon-purple shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent uppercase font-display">
              Ethara Tasks
            </span>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1.5 mt-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden ${
                    isActive
                      ? 'text-white active-nav-glow font-semibold border-l-2 border-neon-cyan'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-l-2 border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                        isActive ? 'text-neon-cyan' : 'text-gray-400'
                      }`}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeGlow"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#06b6d4]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Micro card Profile & Logout Button */}
      {user && (
        <div className="p-4 border-t border-white/5 bg-gray-950/20">
          <Link
            to="/profile"
            className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-white/10 hover:border-white/15 transition-all block text-left"
          >
            {/* Avatar block */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-[0_0_12px_rgba(255,255,255,0.05)] border border-white/10 shrink-0"
              style={{ backgroundColor: user.avatarColor }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            {/* Metadata user */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-100 truncate">{user.name}</h4>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            {/* Role Badge */}
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                user.role === 'Admin'
                  ? 'bg-neon-rose/10 text-neon-rose border border-neon-rose/20 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                  : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
              }`}
            >
              {user.role}
            </span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-transparent hover:bg-neon-rose/10 hover:border-neon-rose/20 text-gray-400 hover:text-neon-rose text-sm font-medium transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
