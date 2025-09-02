'use client';

import React from 'react';
import { TimerState } from '@/types/pomodoro';

interface TimerDisplayProps {
  timerState: TimerState;
  formatTime: (seconds: number) => string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timerState,
  formatTime,
}) => {
  const getModeDisplayName = (mode: string) => {
    switch (mode) {
      case 'work':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      case 'custom':
        return 'Custom Timer';
      default:
        return 'Pomodoro';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'work':
        return 'text-blue-600 dark:text-blue-400';
      case 'shortBreak':
      case 'longBreak':
        return 'text-green-600 dark:text-green-400';
      case 'custom':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'work':
        return '🎯';
      case 'shortBreak':
        return '☕';
      case 'longBreak':
        return '🌟';
      case 'custom':
        return '⏱️';
      default:
        return '🍅';
    }
  };

  return (
    <div className="text-center space-y-4">
      {/* Mode indicator */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-2xl">{getModeIcon(timerState.currentMode)}</span>
        <h2 className={`text-lg font-semibold ${getModeColor(timerState.currentMode)}`}>
          {getModeDisplayName(timerState.currentMode)}
        </h2>
      </div>

      {/* Main timer display */}
      <div className="relative">
        <div className={`text-6xl md:text-7xl font-mono font-bold tabular-nums ${
          timerState.isRunning 
            ? timerState.currentMode === 'work' 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-green-600 dark:text-green-400'
            : 'text-gray-700 dark:text-gray-300'
        } transition-colors duration-300`}>
          {formatTime(timerState.timeLeft)}
        </div>
        
        {/* Status indicator */}
        <div className="mt-2 flex items-center justify-center space-x-2">
          {timerState.isRunning && (
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              timerState.currentMode === 'work' ? 'bg-blue-500' : 'bg-green-500'
            }`} />
          )}
          
          <span className={`text-sm font-medium ${
            timerState.isRunning 
              ? 'text-gray-700 dark:text-gray-300'
              : timerState.isPaused
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-gray-500 dark:text-gray-400'
          }`}>
            {timerState.isRunning 
              ? 'Running' 
              : timerState.isPaused 
                ? 'Paused' 
                : 'Stopped'
            }
          </span>
        </div>
      </div>

      {/* Session info */}
      <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <span>🍅</span>
          <span>Sessions: {timerState.completedSessions}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>🔄</span>
          <span>Cycle: {timerState.currentCycle}</span>
        </div>
      </div>

      {/* Progress percentage */}
      {timerState.totalTime > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {Math.round(((timerState.totalTime - timerState.timeLeft) / timerState.totalTime) * 100)}% Complete
        </div>
      )}
    </div>
  );
};