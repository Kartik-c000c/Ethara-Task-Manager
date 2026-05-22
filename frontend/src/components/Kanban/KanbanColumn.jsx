import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

const KanbanColumn = ({ id, title, color, tasks, onCardClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div className="flex-1 flex flex-col min-w-[280px] max-w-[400px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-2.5">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-display">
            {title}
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-gray-400 font-bold">
          {tasks.length}
        </span>
      </div>

      {/* Droppable Board Column Space */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 rounded-2xl bg-black/20 border transition-colors duration-300 min-h-[500px] flex flex-col gap-3.5 overflow-y-auto ${
          isOver
            ? 'border-neon-cyan/20 bg-neon-cyan/5 shadow-[inset_0_0_15px_rgba(6,182,212,0.05)]'
            : 'border-white/5'
        }`}
      >
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-white/5 rounded-xl text-center text-gray-500 min-h-[350px]">
            <span className="text-[10px] italic">Drop tasks here</span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} onClick={onCardClick} />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
