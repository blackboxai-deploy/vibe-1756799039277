'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerState, PomodoroSettings, PomodoroSession, TimerMode } from '@/types/pomodoro';
import { storage, DEFAULT_SETTINGS } from '@/lib/storage';
import { audioManager } from '@/lib/audio';

export const usePomodoro = () => {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    currentMode: 'work',
    timeLeft: DEFAULT_SETTINGS.workDuration * 60, // Convert minutes to seconds
    totalTime: DEFAULT_SETTINGS.workDuration * 60,
    completedSessions: 0,
    currentCycle: 1,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Load settings and initialize
  useEffect(() => {
    const savedSettings = storage.getSettings();
    setSettings(savedSettings);
    
    setTimerState(prev => ({
      ...prev,
      timeLeft: savedSettings.workDuration * 60,
      totalTime: savedSettings.workDuration * 60,
    }));

    // Initialize audio on user interaction
    audioManager.initializeOnUserInteraction();
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (timerState.isRunning && !timerState.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeLeft <= 1) {
            // Timer finished
            handleTimerComplete();
            return {
              ...prev,
              timeLeft: 0,
              isRunning: false,
            };
          }
          
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1,
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.isPaused]);

  // Handle timer completion
  const handleTimerComplete = useCallback(async () => {
    if (settings.soundEnabled) {
      await audioManager.playNotification(settings.notificationSound, settings.soundVolume);
    }

    // Create session record
    const session: PomodoroSession = {
      id: Date.now().toString(),
      type: timerState.currentMode,
      duration: timerState.totalTime,
      completedAt: new Date(),
    };

    // Save session if it's a work session
    if (timerState.currentMode === 'work') {
      storage.addSession(session);
    }

    // Show notification
    const notificationMessages = {
      work: 'Great job! Time for a break.',
      shortBreak: 'Break over! Ready to focus?',
      longBreak: 'Long break finished! Ready for the next session?',
      custom: 'Timer finished!',
    };

    await audioManager.showNotification(
      'Pomodoro Timer',
      notificationMessages[timerState.currentMode],
    );

    // Auto-progression logic
    let nextMode: TimerMode = 'work';
    let nextDuration = settings.workDuration * 60;
    let newCompletedSessions = timerState.completedSessions;
    let newCycle = timerState.currentCycle;

    if (timerState.currentMode === 'work') {
      newCompletedSessions++;
      
      // Determine next break type
      if (newCompletedSessions % settings.longBreakInterval === 0) {
        nextMode = 'longBreak';
        nextDuration = settings.longBreakDuration * 60;
      } else {
        nextMode = 'shortBreak';
        nextDuration = settings.shortBreakDuration * 60;
      }
    } else {
      // After any break, go back to work
      nextMode = 'work';
      nextDuration = settings.workDuration * 60;
      newCycle++;
    }

    const shouldAutoStart = 
      (nextMode === 'work' && settings.autoStartWork) ||
      (nextMode !== 'work' && settings.autoStartBreaks);

    setTimerState(prev => ({
      ...prev,
      currentMode: nextMode,
      timeLeft: nextDuration,
      totalTime: nextDuration,
      completedSessions: newCompletedSessions,
      currentCycle: newCycle,
      isRunning: shouldAutoStart,
      isPaused: false,
    }));

  }, [settings, timerState.currentMode, timerState.totalTime, timerState.completedSessions, timerState.currentCycle]);

  // Control functions
  const startTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
    }));
    startTimeRef.current = Date.now() - pausedTimeRef.current;
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: true,
    }));
    if (startTimeRef.current) {
      pausedTimeRef.current = Date.now() - startTimeRef.current;
    }
  }, []);

  const resetTimer = useCallback(() => {
    const duration = getCurrentModeDuration() * 60;
    
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      timeLeft: duration,
      totalTime: duration,
    }));
    
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, [settings]);

  const skipTimer = useCallback(() => {
    handleTimerComplete();
  }, [handleTimerComplete]);

  const switchMode = useCallback((mode: TimerMode) => {
    const duration = getModeDuration(mode) * 60;
    
    setTimerState(prev => ({
      ...prev,
      currentMode: mode,
      timeLeft: duration,
      totalTime: duration,
      isRunning: false,
      isPaused: false,
    }));
    
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, [settings]);

  const updateSettings = useCallback((newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    storage.setSettings(newSettings);
    
    // Update timer if not running
    if (!timerState.isRunning) {
      const duration = getModeDuration(timerState.currentMode, newSettings) * 60;
      setTimerState(prev => ({
        ...prev,
        timeLeft: duration,
        totalTime: duration,
      }));
    }
  }, [timerState.isRunning, timerState.currentMode]);

  // Helper functions
  const getCurrentModeDuration = useCallback(() => {
    return getModeDuration(timerState.currentMode);
  }, [timerState.currentMode, settings]);

  const getModeDuration = useCallback((mode: TimerMode, settingsOverride?: PomodoroSettings) => {
    const currentSettings = settingsOverride || settings;
    
    switch (mode) {
      case 'work':
        return currentSettings.workDuration;
      case 'shortBreak':
        return currentSettings.shortBreakDuration;
      case 'longBreak':
        return currentSettings.longBreakDuration;
      case 'custom':
        return Math.floor(timerState.totalTime / 60);
      default:
        return currentSettings.workDuration;
    }
  }, [settings, timerState.totalTime]);

  const getProgress = useCallback(() => {
    if (timerState.totalTime === 0) return 0;
    return ((timerState.totalTime - timerState.timeLeft) / timerState.totalTime) * 100;
  }, [timerState.timeLeft, timerState.totalTime]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const isWorkSession = timerState.currentMode === 'work';
  const isBreakSession = timerState.currentMode === 'shortBreak' || timerState.currentMode === 'longBreak';

  return {
    // State
    timerState,
    settings,
    
    // Control functions
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    switchMode,
    updateSettings,
    
    // Helper functions
    getProgress,
    formatTime,
    getCurrentModeDuration,
    
    // Computed properties
    isWorkSession,
    isBreakSession,
  };
};