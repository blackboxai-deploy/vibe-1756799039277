'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { TimerState } from '@/types/pomodoro';

interface TimerControlsProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  timerState,
  onStart,
  onPause,
  onReset,
  onSkip,
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Play/Pause Button */}
      <Button
        onClick={timerState.isRunning ? onPause : onStart}
        size="lg"
        className={`min-w-[120px] h-12 text-white font-semibold transition-all duration-200 ${
          timerState.isRunning
            ? 'bg-red-500 hover:bg-red-600 shadow-red-200 dark:shadow-red-800'
            : timerState.currentMode === 'work'
            ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-200 dark:shadow-blue-800'
            : 'bg-green-500 hover:bg-green-600 shadow-green-200 dark:shadow-green-800'
        } shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95`}
      >
        {timerState.isRunning ? (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-white rounded"></div>
              <div className="w-1 h-4 bg-white rounded"></div>
            </div>
            <span>Pause</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
            <span>{timerState.isPaused ? 'Resume' : 'Start'}</span>
          </div>
        )}
      </Button>

      {/* Reset Button */}
      <Button
        onClick={onReset}
        variant="outline"
        size="lg"
        className="h-12 px-6 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 active:scale-95"
        disabled={!timerState.isRunning && !timerState.isPaused && timerState.timeLeft === timerState.totalTime}
      >
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current rounded-full relative">
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-current transform rotate-45 -translate-y-0.5 translate-x-0.5"></div>
          </div>
          <span>Reset</span>
        </div>
      </Button>

      {/* Skip Button */}
      <Button
        onClick={onSkip}
        variant="outline"
        size="lg"
        className="h-12 px-6 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 active:scale-95"
        disabled={!timerState.isRunning && !timerState.isPaused}
      >
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-0 h-0 border-l-[6px] border-l-current border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>
            <div className="w-0 h-0 border-l-[6px] border-l-current border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
            <div className="w-0.5 h-4 bg-current ml-1"></div>
          </div>
          <span>Skip</span>
        </div>
      </Button>
    </div>
  );
};