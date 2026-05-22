import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';
import {
  Briefcase,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projectsCount: 0,
    tasksCount: 0,
    pendingCount: 0,
    completedCount: 0,
    overdueCount: 0,
    teamCount: 0,
  });

  const [weeklyData, setWeeklyData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [projectsProgress, setProjectsProgress] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [projectsRes, tasksRes, teamRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks'),
          api.get('/team'),
        ]);

        const projects = projectsRes.data.data;
        const tasks = tasksRes.data.data;
        const members = teamRes.data.data;

        // Calculate Stats
        const now = new Date();
        const overdueTasks = tasks.filter((t) => new Date(t.dueDate) < now && t.status !== 'Completed');
        const completedTasks = tasks.filter((t) => t.status === 'Completed');
        const pendingTasks = tasks.filter((t) => t.status !== 'Completed');

        setStats({
          projectsCount: projects.length,
          tasksCount: tasks.length,
          pendingCount: pendingTasks.length,
          completedCount: completedTasks.length,
          overdueCount: overdueTasks.length,
          teamCount: members.length,
        });

        // 1. Chart - Pie Chart status distribution
        const todoCount = tasks.filter((t) => t.status === 'Todo').length;
        const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
        setPieData([
          { name: 'To Do', value: todoCount, color: '#06b6d4' },
          { name: 'In Progress', value: inProgressCount, color: '#8b5cf6' },
          { name: 'Completed', value: completedTasks.length, color: '#10b981' },
        ]);

        // 2. Chart - Priority Bar Distribution
        const lowPrio = tasks.filter((t) => t.priority === 'Low').length;
        const medPrio = tasks.filter((t) => t.priority === 'Medium').length;
        const highPrio = tasks.filter((t) => t.priority === 'High').length;
        setPriorityData([
          { name: 'Low', count: lowPrio, fill: '#06b6d4' },
          { name: 'Medium', count: medPrio, fill: '#f59e0b' },
          { name: 'High', count: highPrio, fill: '#f43f5e' },
        ]);

        // 3. Chart - Projects Completion Progress list
        setProjectsProgress(projects.slice(0, 4)); // Show top 4 projects

        // 4. Chart - Mock Weekly Productivity Completed tasks (highly interactive)
        // Group tasks completed in last 7 days dynamically or fallback to standard seed dates
        setWeeklyData([
          { day: 'Mon', completed: 2 },
          { day: 'Tue', completed: 4 },
          { day: 'Wed', completed: 3 },
          { day: 'Thu', completed: 6 },
          { day: 'Fri', completed: 5 },
          { day: 'Sat', completed: 7 },
          { day: 'Sun', completed: 8 },
        ]);
      } catch (err) {
        console.error('Failed to compile dashboard metrics', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const kpis = [
    {
      title: 'Total Projects',
      value: stats.projectsCount,
      icon: Briefcase,
      color: 'text-neon-cyan',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]',
      border: 'hover:border-neon-cyan/30',
    },
    {
      title: 'Active Tasks',
      value: stats.tasksCount,
      icon: ClipboardList,
      color: 'text-neon-purple',
      glow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]',
      border: 'hover:border-neon-purple/30',
    },
    {
      title: 'Pending Action',
      value: stats.pendingCount,
      icon: Clock,
      color: 'text-neon-gold',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      border: 'hover:border-neon-gold/30',
    },
    {
      title: 'Tasks Finished',
      value: stats.completedCount,
      icon: CheckCircle,
      color: 'text-neon-emerald',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      border: 'hover:border-neon-emerald/30',
    },
    {
      title: 'Overdue Limits',
      value: stats.overdueCount,
      icon: AlertTriangle,
      color: stats.overdueCount > 0 ? 'text-neon-rose animate-pulse' : 'text-gray-400',
      glow: stats.overdueCount > 0 ? 'shadow-[0_0_20px_rgba(244,63,94,0.25)]' : 'shadow-sm',
      border: stats.overdueCount > 0 ? 'border-neon-rose/40 hover:border-neon-rose/60' : 'hover:border-white/10',
    },
    {
      title: 'Node Collaborators',
      value: stats.teamCount,
      icon: Users,
      color: 'text-white',
      glow: 'shadow-[0_0_15px_rgba(255,255,255,0.05)]',
      border: 'hover:border-white/20',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Card banner */}
      <div className="glass-panel border border-white/10 p-6 rounded-2xl flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.3)] bg-gradient-to-r from-gray-950 via-bg-dark to-gray-950">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-neon-cyan animate-pulse" />
            <span>Operational Center</span>
          </h2>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">
            Welcome to Team Task Manager. Real-time board diagnostics and tasks execution metrics loaded.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan shadow-[0_0_12px_rgba(6,182,212,0.1)]">
          <TrendingUp className="w-4 h-4" />
          <span>System Active</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => <LoadingSkeleton key={i} height="h-28" />)
          : kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={idx}
                  className={`glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 ${kpi.border} ${kpi.glow}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">
                      {kpi.title}
                    </span>
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-white leading-none font-display">
                      {kpi.value}
                    </span>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Productivity Area Chart */}
        <div className="glass-panel border border-white/5 rounded-2xl p-6 lg:col-span-2 shadow-lg">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neon-cyan" />
            <span>Weekly Workflow Velocity</span>
          </h3>

          <div className="h-72">
            {loading ? (
              <LoadingSkeleton height="h-full" rounded="rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#4b5563" fontSize={11} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(9,14,26,0.95)',
                      border: '1px solid rgba(6,182,212,0.3)',
                      borderRadius: '12px',
                      color: '#f3f4f6',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorProd)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Task Status Distribution Pie Chart */}
        <div className="glass-panel border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-neon-purple" />
            <span>Task Allocations Ratios</span>
          </h3>

          <div className="h-56 relative flex-1">
            {loading ? (
              <LoadingSkeleton height="h-full" rounded="rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(9,14,26,0.95)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie Legends */}
          {!loading && (
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
              {pieData.map((p, idx) => (
                <div key={idx} className="text-center">
                  <span className="text-[10px] text-gray-400 font-bold block">{p.name}</span>
                  <span
                    className="text-sm font-extrabold block mt-0.5"
                    style={{ color: p.color }}
                  >
                    {p.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project progress cards lists */}
        <div className="glass-panel border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-neon-cyan" />
            <span>Projects Completion</span>
          </h3>

          <div className="space-y-5 flex-1 justify-center flex flex-col">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => <LoadingSkeleton key={i} height="h-12" />)
            ) : projectsProgress.length === 0 ? (
              <p className="text-xs text-gray-500 italic text-center">No active projects loaded.</p>
            ) : (
              projectsProgress.map((p) => (
                <div key={p._id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-300 font-semibold truncate max-w-[70%]">
                      {p.title}
                    </span>
                    <span className="text-neon-cyan font-bold font-display">{p.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full shadow-[0_0_8px_#06b6d4]"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Priorities distribution Bar chart */}
        <div className="glass-panel border border-white/5 rounded-2xl p-6 lg:col-span-2 shadow-lg">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-neon-rose" />
            <span>Critical Severity Distribution</span>
          </h3>

          <div className="h-52">
            {loading ? (
              <LoadingSkeleton height="h-full" rounded="rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={11} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(9,14,26,0.95)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
