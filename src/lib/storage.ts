import { PomodoroSession, PomodoroSettings, PomodoroStats, Task, Achievement } from '@/types/pomodoro';

const STORAGE_KEYS = {
  SETTINGS: 'pomodoro-settings',
  SESSIONS: 'pomodoro-sessions',
  STATS: 'pomodoro-stats',
  TASKS: 'pomodoro-tasks',
  ACHIEVEMENTS: 'pomodoro-achievements',
} as const;

// Default settings
export const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
  soundVolume: 0.5,
  notificationSound: 'bell',
  dailyGoal: 8,
};

// Storage utilities
export const storage = {
  // Settings
  getSettings(): PomodoroSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  setSettings(settings: PomodoroSettings): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  // Sessions
  getSessions(): PomodoroSession[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      const sessions = stored ? JSON.parse(stored) : [];
      // Convert date strings back to Date objects
      return sessions.map((session: any) => ({
        ...session,
        completedAt: new Date(session.completedAt),
      }));
    } catch {
      return [];
    }
  },

  addSession(session: PomodoroSession): void {
    if (typeof window === 'undefined') return;
    
    try {
      const sessions = this.getSessions();
      sessions.push(session);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  },

  clearSessions(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    } catch (error) {
      console.error('Failed to clear sessions:', error);
    }
  },

  // Stats
  getStats(): PomodoroStats {
    if (typeof window === 'undefined') {
      return { today: 0, thisWeek: 0, thisMonth: 0, total: 0, streak: 0, longestStreak: 0 };
    }
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATS);
      return stored ? JSON.parse(stored) : {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        total: 0,
        streak: 0,
        longestStreak: 0,
      };
    } catch {
      return { today: 0, thisWeek: 0, thisMonth: 0, total: 0, streak: 0, longestStreak: 0 };
    }
  },

  setStats(stats: PomodoroStats): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  },

  // Tasks
  getTasks(): Task[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      const tasks = stored ? JSON.parse(stored) : [];
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
    } catch {
      return [];
    }
  },

  setTasks(tasks: Task[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  },

  // Achievements
  getAchievements(): Achievement[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      const achievements = stored ? JSON.parse(stored) : [];
      return achievements.map((achievement: any) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined,
      }));
    } catch {
      return [];
    }
  },

  setAchievements(achievements: Achievement[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (error) {
      console.error('Failed to save achievements:', error);
    }
  },
};

// Helper functions for calculating stats
export const calculateStats = (sessions: PomodoroSession[]): PomodoroStats => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const workSessions = sessions.filter(s => s.type === 'work');

  const todaySessions = workSessions.filter(s => 
    s.completedAt >= today
  ).length;

  const thisWeekSessions = workSessions.filter(s => 
    s.completedAt >= thisWeekStart
  ).length;

  const thisMonthSessions = workSessions.filter(s => 
    s.completedAt >= thisMonthStart
  ).length;

  // Calculate streak
  let streak = 0;
  let longestStreak = 0;
  const daysSessions: { [key: string]: number } = {};

  workSessions.forEach(session => {
    const dateKey = session.completedAt.toDateString();
    daysSessions[dateKey] = (daysSessions[dateKey] || 0) + 1;
  });

  const sortedDays = Object.keys(daysSessions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Calculate current streak from today backwards
  let currentDate = new Date(today);
  while (true) {
    const dateKey = currentDate.toDateString();
    if (daysSessions[dateKey]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (streak === 0 && dateKey === today.toDateString()) {
      // Allow for today to not have sessions yet
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak
  let tempStreak = 0;
  let lastDate: Date | null = null;
  
  sortedDays.forEach(dateKey => {
    const date = new Date(dateKey);
    if (lastDate && Math.abs(date.getTime() - lastDate.getTime()) === 24 * 60 * 60 * 1000) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
    lastDate = date;
  });
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    today: todaySessions,
    thisWeek: thisWeekSessions,
    thisMonth: thisMonthSessions,
    total: workSessions.length,
    streak,
    longestStreak,
  };
};