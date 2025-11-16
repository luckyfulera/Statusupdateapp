
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg p-6 sm:p-8 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
