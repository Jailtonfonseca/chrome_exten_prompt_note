import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import Spinner from './Spinner'; // Assuming Spinner.tsx will be created

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; // Typically an SVG icon component
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'transparent';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label: string; // For accessibility (aria-label)
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'secondary',
  isLoading = false,
  size = 'md',
  label,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = "rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 inline-flex items-center justify-center transition-colors duration-150";

  const sizeStyles = {
    sm: 'p-1.5', // Smaller padding for icon buttons
    md: 'p-2',
    lg: 'p-3',
  };

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-gray-500',
    transparent: 'bg-transparent hover:bg-gray-500/10 text-gray-700 dark:text-gray-200 focus:ring-gray-500',
  };

  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <button
      type="button"
      aria-label={label}
      className={`
        ${baseStyle}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${(disabled || isLoading) ? disabledStyle : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner size={size === 'sm' ? 'sm' : 'md'} /> : children}
    </button>
  );
};

export default IconButton;
