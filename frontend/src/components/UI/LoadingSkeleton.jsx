import React from 'react';

const LoadingSkeleton = ({ height = 'h-8', width = 'w-full', rounded = 'rounded-lg' }) => {
  return (
    <div
      className={`animate-pulse bg-white/5 border border-white/5 backdrop-blur-sm ${height} ${width} ${rounded} relative overflow-hidden`}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
    </div>
  );
};

export default LoadingSkeleton;
