import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;