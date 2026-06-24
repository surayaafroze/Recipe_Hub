import React from 'react';

export default function Loader({ size = 'md', text = 'Loading details...', fullScreen = false }) {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-14 h-14 border-4',
    lg: 'w-20 h-20 border-4'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white/90 dark:bg-zinc-950/90 z-50 flex flex-col items-center justify-center backdrop-blur-sm'
    : 'flex flex-col items-center justify-center py-12 w-full min-h-[300px]';

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        {/* Outer spinning gradient ring */}
        <div className={`${sizeClasses[size]} border-gray-100 dark:border-zinc-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin shadow-inner`}></div>
        {/* Inner pulsing element */}
        <div className="absolute">
          <div className="w-3 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-ping"></div>
        </div>
      </div>
      {text && (
        <p className="mt-4 text-sm font-semibold tracking-wide text-indigo-600/80 dark:text-indigo-400/80 uppercase animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
