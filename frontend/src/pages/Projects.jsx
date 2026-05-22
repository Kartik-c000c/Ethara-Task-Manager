import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProjectModal from '../components/Modals/ProjectModal';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';
import EmptyState from '../components/UI/EmptyState';
import toast from 'react-hot-toast';
import { Briefcase, Calendar, Users, Edit3, Trash2, Plus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      toast.error('Failed to retrieve project nodes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      const projectToUpdate = projects.find((p) => p._id === projectId);
      if (!projectToUpdate) return;

      // Optimistic update
      setProjects(
        projects.map((p) =>
          p._id === projectId ? { ...p, status: newStatus } : p
        )
      );

      await api.put(`/projects/${projectId}`, {
        title: projectToUpdate.title,
        description: projectToUpdate.description,
        deadline: projectToUpdate.deadline,
        status: newStatus,
        members: projectToUpdate.members.map((m) => m._id || m),
      });

      toast.success(`Project status updated to ${newStatus}`);
    } catch (err) {
      fetchProjects();
      toast.error(err.message || 'Failed to update project status');
    }
  };

  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project? ALL related tasks and discussion comments will be cascade deleted!'
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/projects/${projectId}`);
      toast.success('Project and child nodes deleted successfully!');
      fetchProjects();
    } catch (err) {
      toast.error(err.message || 'Failed to remove project');
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'Completed') {
      return 'bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
    }
    if (status === 'On Hold') {
      return 'bg-neon-gold/10 text-neon-gold border border-neon-gold/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]';
    }
    return 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 glass-panel border border-white/10 rounded-2xl bg-gradient-to-r from-gray-950 via-bg-dark to-gray-950 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-neon-cyan" />
            <span>Workspace Project Boards</span>
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Browse active project boards, progress states, and collaborator nodes.
          </p>
        </div>

        {/* Admin Create Action */}
        {user?.role === 'Admin' && (
          <button
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90 active:scale-[0.98] shadow-lg shadow-cyan-950/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Projects Grid Container */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => <LoadingSkeleton key={i} height="h-60" />)}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No project boards active"
          description="Initialize your first project block to start tracking tasks workflows."
          action={
            user?.role === 'Admin' && (
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-neon-cyan to-neon-purple shadow-lg shadow-cyan-950/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Initialize Project</span>
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel border border-white/5 rounded-2xl p-6 flex flex-col justify-between glass-panel-hover"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  {user?.role === 'Admin' ? (
                    <select
                      value={project.status}
                      onChange={(e) => handleStatusChange(project._id, e.target.value)}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider focus:outline-none cursor-pointer border transition-all [&>option]:bg-bg-dark [&>option]:text-white ${getStatusStyle(project.status)}`}
                    >
                      <option value="Active">Active</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusStyle(project.status)}`}>
                      {project.status}
                    </span>
                  )}
                  
                  {/* Admin specific triggers */}
                  {user?.role === 'Admin' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-neon-cyan transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-neon-rose transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-gray-100 mb-2 truncate group-hover:text-white">
                  {project.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-5 line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Progress bar and Deadline */}
              <div className="space-y-4">
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 font-medium">Completion Ratio</span>
                    <span className="text-neon-cyan font-bold font-display">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer details */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  {/* Deadline date */}
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                    <Calendar className="w-3.5 h-3.5 text-neon-cyan" />
                    <span>
                      {new Date(project.deadline).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Members pile */}
                  <div className="flex items-center -space-x-2 overflow-hidden">
                    {project.members?.slice(0, 4).map((member) => (
                      <div
                        key={member._id}
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-[9px] border border-gray-900 shadow-sm shrink-0"
                        style={{ backgroundColor: member.avatarColor }}
                        title={`${member.name} (${member.role})`}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {project.members?.length > 4 && (
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center font-bold text-[9px]">
                        +{project.members.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Project configuration modal wrapper */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
        onSave={fetchProjects}
      />
    </div>
  );
};

export default Projects;
