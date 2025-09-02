'use client';

import React from 'react';

interface ProgressRingProps {
  progress: number; // 0-100
  size: number;
  strokeWidth: number;
  isWorkSession: boolean;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size,
  strokeWidth,
  isWorkSession,
  className = '',
}) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const progressColor = isWorkSession 
    ? 'stroke-blue-500' 
    : 'stroke-green-500';

  const backgroundRingColor = isWorkSession
    ? 'stroke-blue-100 dark:stroke-blue-900'
    : 'stroke-green-100 dark:stroke-green-900';

  return (
    <div className={`relative ${className}`}>
      <svg 
        width={size} 
        height={size} 
        className="transform -rotate-90"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className={backgroundRingColor}
        />
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${progressColor} transition-all duration-1000 ease-out`}
          style={{
            filter: isWorkSession 
              ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' 
              : 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))'
          }}
        />
      </svg>
      
      {/* Pulse effect for active timer */}
      {progress > 0 && (
        <div 
          className={`absolute inset-0 rounded-full animate-pulse opacity-20 ${
            isWorkSession ? 'bg-blue-500' : 'bg-green-500'
          }`}
          style={{ 
            animationDuration: '2s',
            transform: `scale(${0.8 + (progress / 100) * 0.1})`,
          }}
        />
      )}
    </div>
  );
};