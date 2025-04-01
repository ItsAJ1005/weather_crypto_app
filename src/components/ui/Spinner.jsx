import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };
  
  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-500 ${sizeClasses[size]} ${className}`} />
  );
};

export const LoadingState = ({ text = 'Loading...', centered = false }) => {
  const containerClasses = centered ? 'flex flex-col items-center justify-center p-8' : 'p-4';
  
  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-center space-x-2">
        <Spinner />
        <span className="text-gray-500 dark:text-gray-400">{text}</span>
      </div>
    </div>
  );
};

export default Spinner;