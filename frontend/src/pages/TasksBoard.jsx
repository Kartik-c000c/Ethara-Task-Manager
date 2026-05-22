import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import KanbanColumn from '../components/Kanban/KanbanColumn';
import TaskModal from '../components/Modals/TaskModal';
import TaskDetailsModal from '../components/Modals/TaskDetailsModal';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';
import EmptyState from '../components/UI/EmptyState';
import toast from 'react-hot-toast';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  Plus,
  Search,
  Filter,
  Briefcase,
  AlertTriangle,
  Clock,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

const TasksBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsList, setProjectsList] = useState([]);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [filterOverdue, setFilterOverdue] = useState(false);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const { user } = useAuth();

  // Sensors configuration for dnd-kit (enables drag-and-drop triggers)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Drags start after moving 8 pixels to prevent accidental clicks blocking details modal opening
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // Touch press 200ms starts drags, perfect for mobile devices scroll compat
        tolerance: 5,
      },
    })
  );

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (selectedProject) queryParams.append('project', selectedProject);
      if (selectedPriority) queryParams.append('priority', selectedPriority);
      if (filterOverdue) queryParams.append('overdue', 'true');

      const res = await api.get(`/tasks?${queryParams.toString()}`);
      setTasks(res.data.data);
    } catch (err) {
      toast.error('Failed to retrieve task nodes');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjectsList(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, selectedProject, selectedPriority, filterOverdue]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id; // Destination Column ID ('Todo', 'In Progress', 'Completed')

    // Find the task in state
    const taskIndex = tasks.findIndex((t) => t._id === taskId);
    if (taskIndex === -1) return;

    const targetTask = tasks[taskIndex];
    if (targetTask.status === newStatus) return;

    // RBAC validation: Members can ONLY update tasks assigned to them
    if (user.role !== 'Admin') {
      const isAssigned = targetTask.assignedTo && targetTask.assignedTo._id === user._id;
      if (!isAssigned) {
        toast.error('Access Restricted: Members can only drag tasks assigned to themselves.');
        return;
      }
    }

    // Instantly update UI state to support fast optimistic renders
    const prevTasks = [...tasks];
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = { ...targetTask, status: newStatus };
    setTasks(updatedTasks);

    try {
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success(`Task shifted to ${newStatus}`);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === taskId ? res.data.data : t))
      );
    } catch (err) {
      // Revert states on API failures
      setTasks(prevTasks);
      toast.error(err.message || 'Failed to update task boards');
    }
  };

  const handleCardClick = (id) => {
    setActiveTaskId(id);
    setIsDetailsOpen(true);
  };

  // Group tasks by status columns
  const todoTasks = tasks.filter((t) => t.status === 'Todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  return (
    <div className="space-y-6 pb-12 h-full flex flex-col">
      {/* Title Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 glass-panel border border-white/10 rounded-2xl bg-gradient-to-r from-gray-950 via-bg-dark to-gray-950 shadow-md shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-neon-purple" />
            <span>Kanban Sprint board</span>
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Drag and drop tasks between lanes. Overdue tasks automatically highlighted in neon red.
          </p>
        </div>

        {/* Create Task (Admin only) */}
        {user?.role === 'Admin' && (
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 active:scale-[0.98] shadow-lg shadow-purple-950/20 transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        )}
      </div>

      {/* Dynamic Filters Panel */}
      <div className="glass-panel border border-white/5 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-center shrink-0">
        {/* Text Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search task logs..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
          />
        </div>

        {/* Project Selector */}
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white focus:outline-none focus:border-neon-cyan transition-colors [&>option]:bg-bg-dark"
          >
            <option value="">All Projects</option>
            {projectsList.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Selector */}
        <div className="relative">
          <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white focus:outline-none focus:border-neon-cyan transition-colors [&>option]:bg-bg-dark"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Overdue Checkbox */}
        <label className="flex items-center gap-2.5 px-3 py-2 border border-white/5 bg-white/5 rounded-xl cursor-pointer select-none hover:bg-white/10 transition-colors">
          <input
            type="checkbox"
            checked={filterOverdue}
            onChange={(e) => setFilterOverdue(e.target.checked)}
            className="rounded border-white/10 bg-white/5 text-neon-rose focus:ring-0 w-3.5 h-3.5 accent-red-500"
          />
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 uppercase tracking-wider">
            <Clock className={`w-3.5 h-3.5 ${filterOverdue ? 'text-neon-rose animate-pulse' : 'text-gray-500'}`} />
            <span className={filterOverdue ? 'text-neon-rose' : ''}>Overdue Only</span>
          </div>
        </label>
      </div>

      {/* Board drag lanes */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          {Array(3)
            .fill(0)
            .map((_, i) => <LoadingSkeleton key={i} height="h-[400px]" rounded="rounded-2xl" />)}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks registered"
          description="Clear filters or draft a new task block to populate board columns."
          action={
            user?.role === 'Admin' && (
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-neon-purple to-neon-cyan shadow-lg shadow-purple-950/20"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            )
          }
        />
      ) : (
        <div className="flex-1 overflow-x-auto min-h-0">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex gap-6 pb-6 h-full min-w-[900px]">
              <KanbanColumn
                id="Todo"
                title="To Do"
                color="bg-neon-cyan shadow-[0_0_8px_#06b6d4]"
                tasks={todoTasks}
                onCardClick={handleCardClick}
              />
              <KanbanColumn
                id="In Progress"
                title="In Progress"
                color="bg-neon-purple shadow-[0_0_8px_#8b5cf6]"
                tasks={inProgressTasks}
                onCardClick={handleCardClick}
              />
              <KanbanColumn
                id="Completed"
                title="Completed"
                color="bg-neon-emerald shadow-[0_0_8px_#10b981]"
                tasks={completedTasks}
                onCardClick={handleCardClick}
              />
            </div>
          </DndContext>
        </div>
      )}

      {/* Task modals wrappers */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={fetchTasks}
        preselectedProjectId={selectedProject}
      />

      <TaskDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setActiveTaskId(null);
          fetchTasks(); // Refresh list to catch status updates and new comments counts
        }}
        taskId={activeTaskId}
      />
    </div>
  );
};

export default TasksBoard;
