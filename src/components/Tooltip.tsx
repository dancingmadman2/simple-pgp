'use client';

import { useState, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-10 px-3 py-2 text-sm font-medium text-white transform -translate-x-1/2 bg-gray-900 rounded-lg shadow-sm -top-10 left-1/2 dark:bg-gray-700 min-w-64 max-w-xs">
          {content}
          <div className="absolute z-10 w-3 h-3 transform rotate-45 bg-gray-900 dark:bg-gray-700 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
}; 