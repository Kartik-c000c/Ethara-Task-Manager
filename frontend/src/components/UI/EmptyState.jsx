import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'Add a new item to get started with the team task tracker.',
  action,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-white/5 max-w-lg mx-auto">
      <div className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-400 mb-4 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
        <Icon className="w-8 h-8 text-neon-cyan glow-text-cyan" />
      </div>
      <h3 className="text-xl font-bold text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
