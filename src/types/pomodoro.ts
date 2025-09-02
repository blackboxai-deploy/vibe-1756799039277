export interface PomodoroSession {
  id: string;
  type: 'work' | 'shortBreak' | 'longBreak' | 'custom';
  duration: number; // in seconds
  completedAt: Date;
  notes?: string;
}

export interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  longBreakInterval: number; // after how many work sessions
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  soundVolume: number; // 0-1
  notificationSound: 'bell' | 'chime' | 'beep';
  dailyGoal: number; // number of pomodoros
}

export interface PomodoroStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  streak: number; // consecutive days with completed sessions
  longestStreak: number;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  currentMode: 'work' | 'shortBreak' | 'longBreak' | 'custom';
  timeLeft: number; // in seconds
  totalTime: number; // in seconds
  completedSessions: number;
  currentCycle: number; // current work/break cycle
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: PomodoroStats, sessions: PomodoroSession[]) => boolean;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  pomodorosEstimated?: number;
  pomodorosCompleted: number;
  createdAt: Date;
}

export type SoundType = 'bell' | 'chime' | 'beep';
export type TimerMode = 'work' | 'shortBreak' | 'longBreak' | 'custom';