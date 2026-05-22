import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, AlertTriangle, MessageSquare, ShieldAlert } from 'lucide-react';

const TaskCard = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
  });

  // Calculate Overdue status
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'text-neon-rose border-neon-rose/20 bg-neon-rose/5 shadow-[0_0_8px_rgba(244,63,94,0.1)]';
    if (priority === 'Medium') return 'text-neon-gold border-neon-gold/20 bg-neon-gold/5 shadow-[0_0_8px_rgba(245,158,11,0.1)]';
    return 'text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5 shadow-[0_0_8px_rgba(6,182,212,0.1)]';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task._id)}
      className={`glass-panel border p-4 rounded-xl cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all duration-300 relative group flex flex-col justify-between h-40 ${
        isOverdue
          ? 'border-neon-rose/40 shadow-[0_0_12px_rgba(244,63,94,0.12)] bg-rose-950/5 hover:border-neon-rose/60'
          : 'border-white/5 hover:border-white/10'
      }`}
    >
      {/* Card Header details */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Priority tag */}
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          {/* Overdue label indicator */}
          {isOverdue && (
            <span className="flex items-center gap-0.5 text-[8px] font-bold text-neon-rose animate-pulse">
              <ShieldAlert className="w-2.5 h-2.5 text-neon-rose" />
              <span>OVERDUE</span>
            </span>
          )}
        </div>

        <h4 className="text-xs font-bold text-gray-200 line-clamp-2 leading-relaxed tracking-wide group-hover:text-white transition-colors">
          {task.title}
        </h4>
      </div>

      {/* Progress Bar inside TaskCard */}
      <div className="w-full space-y-1">
        <div className="flex justify-between items-center text-[9px]">
          <span className="text-gray-500 font-medium">Progress</span>
          <span className="text-neon-cyan font-bold font-display">{task.percentageCompleted || 0}%</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full transition-all duration-300"
            style={{ width: `${task.percentageCompleted || 0}%` }}
          />
        </div>
      </div>

      {/* Card Footer details */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
        {/* Due date */}
        <div className="flex items-center gap-1">
          <Calendar className={`w-3 h-3 ${isOverdue ? 'text-neon-rose animate-pulse' : 'text-gray-500'}`} />
          <span className={isOverdue ? 'text-neon-rose font-semibold' : ''}>
            {new Date(task.dueDate).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Assignee Profile Circle */}
          {task.assignedTo ? (
            <div
              className="w-5.5 h-5.5 rounded-full flex items-center justify-center font-bold text-white text-[9px] border border-white/5 shadow-sm"
              style={{ backgroundColor: task.assignedTo.avatarColor }}
              title={`Assigned to ${task.assignedTo.name}`}
            >
              {task.assignedTo.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="w-5.5 h-5.5 rounded-full bg-white/5 border border-white/5 flex items-center justify-center font-semibold text-gray-600 text-[9px]" title="Unassigned">
              U
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
