import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g., 'text-indigo-500'
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color, ...props }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-[3px]',
    lg: 'w-8 h-8 border-4',
  };

  // Default color that works well in both themes or relies on parent context
  const defaultColor = color || 'text-indigo-600 dark:text-indigo-400';

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} ${defaultColor} border-solid border-t-transparent`}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;