'use client';

import React from 'react';
import { ProgressRing } from './ProgressRing';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { usePomodoro } from '@/hooks/usePomodoro';
import { Card, CardContent } from '@/components/ui/card';

export const PomodoroTimer: React.FC = () => {
  const {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    switchMode,
    getProgress,
    formatTime,
    isWorkSession,
  } = usePomodoro();

  const progress = getProgress();

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 shadow-2xl">
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Progress Ring Container */}
          <div className="flex justify-center">
            <div className="relative">
              <ProgressRing
                progress={progress}
                size={280}
                strokeWidth={8}
                isWorkSession={isWorkSession}
                className="drop-shadow-lg"
              />
              
              {/* Timer display overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 flex items-center justify-center">
                  <TimerDisplay
                    timerState={timerState}
                    formatTime={formatTime}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <TimerControls
              timerState={timerState}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              onSkip={skipTimer}
            />

            {/* Quick mode switches */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => switchMode('work')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  timerState.currentMode === 'work'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                disabled={timerState.isRunning}
              >
                Work
              </button>
              
              <button
                onClick={() => switchMode('shortBreak')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  timerState.currentMode === 'shortBreak'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                disabled={timerState.isRunning}
              >
                Short Break
              </button>
              
              <button
                onClick={() => switchMode('longBreak')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  timerState.currentMode === 'longBreak'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                disabled={timerState.isRunning}
              >
                Long Break
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};