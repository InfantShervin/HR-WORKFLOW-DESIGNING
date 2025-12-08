import React from 'react';
import { FiLoader } from 'react-icons/fi';

export const Button = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-colors';

  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 disabled:bg-gray-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-400',
    success: 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {loading && <FiLoader className="animate-spin mr-2" />}
      {children}
    </button>
  );
};
