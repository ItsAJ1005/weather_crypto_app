import React from 'react';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Alert = ({
  title,
  children,
  variant = 'info',
  icon,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const variantStyles = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300',
      icon: <FaInfoCircle />,
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300',
      icon: <FaCheckCircle />,
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-300',
      icon: <FaExclamationTriangle />,
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300',
      icon: <FaExclamationCircle />,
    },
  };
  
  const selectedVariant = variantStyles[variant] || variantStyles.info;
  
  return (
    <div className={`border-l-4 p-4 ${selectedVariant.container} ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5 mr-3">
          {icon || selectedVariant.icon}
        </div>
        <div className="flex-1">
          {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && onDismiss && (
          <button
            className="flex-shrink-0 ml-3 -mt-0.5 text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;