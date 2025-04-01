import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  title,
  subtitle,
  footer,
  onClick,
  hoverable = false,
}) => {
  const cardClasses = `bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden 
    ${hoverable ? 'hover:shadow-lg transition-shadow duration-300' : ''} 
    ${onClick ? 'cursor-pointer' : ''} ${className}`;
  
  const cardContent = (
    <>
      {(title || subtitle) && (
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700 border-t border-gray-200 dark:border-gray-700">{footer}</div>}
    </>
  );
  
  if (onClick) {
    return (
      <div className={cardClasses} onClick={onClick}>
        {cardContent}
      </div>
    );
  }
  
  return <div className={cardClasses}>{cardContent}</div>;
};

export default Card;