
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, description, className = '' }) => {
  return (
    <div className={`bg-white p-5 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {title && (
        <div className="border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
