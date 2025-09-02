'use client';

import { useState, useEffect } from 'react';
import { PomodoroSession, PomodoroStats } from '@/types/pomodoro';
import { storage, calculateStats } from '@/lib/storage';

export const useSessionStorage = () => {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [stats, setStats] = useState<PomodoroStats>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
    streak: 0,
    longestStreak: 0,
  });

  // Load sessions and calculate stats
  useEffect(() => {
    const loadedSessions = storage.getSessions();
    setSessions(loadedSessions);
    
    const calculatedStats = calculateStats(loadedSessions);
    setStats(calculatedStats);
    storage.setStats(calculatedStats);
  }, []);

  // Refresh stats when sessions change
  const refreshStats = () => {
    const currentSessions = storage.getSessions();
    setSessions(currentSessions);
    
    const calculatedStats = calculateStats(currentSessions);
    setStats(calculatedStats);
    storage.setStats(calculatedStats);
  };

  // Add a new session
  const addSession = (session: PomodoroSession) => {
    storage.addSession(session);
    refreshStats();
  };

  // Clear all sessions
  const clearSessions = () => {
    storage.clearSessions();
    setSessions([]);
    setStats({
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      total: 0,
      streak: 0,
      longestStreak: 0,
    });
  };

  // Get sessions for a specific date
  const getSessionsForDate = (date: Date): PomodoroSession[] => {
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1);

    return sessions.filter(session => {
      const sessionDate = new Date(session.completedAt);
      return sessionDate >= targetDate && sessionDate < nextDate;
    });
  };

  // Get sessions for the current week
  const getThisWeekSessions = (): PomodoroSession[] => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return sessions.filter(session => 
      new Date(session.completedAt) >= startOfWeek
    );
  };

  // Get daily breakdown for current week
  const getWeeklyBreakdown = () => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const breakdown = weekdays.map((day, index) => {
      const date = new Date();
      date.setDate(date.getDate() - date.getDay() + index);
      const daysSessions = getSessionsForDate(date).filter(s => s.type === 'work');
      
      return {
        day,
        date: date.toDateString(),
        sessions: daysSessions.length,
        isToday: date.toDateString() === new Date().toDateString(),
      };
    });

    return breakdown;
  };

  // Get recent sessions (last 10)
  const getRecentSessions = (): PomodoroSession[] => {
    return sessions
      .filter(session => session.type === 'work')
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 10);
  };

  // Calculate session duration in minutes
  const getSessionDurationInMinutes = (session: PomodoroSession): number => {
    return Math.round(session.duration / 60);
  };

  // Get total focus time for today (in minutes)
  const getTodayFocusTime = (): number => {
    const today = new Date();
    const todaySessions = getSessionsForDate(today).filter(s => s.type === 'work');
    return todaySessions.reduce((total, session) => total + getSessionDurationInMinutes(session), 0);
  };

  // Get average sessions per day over the last 7 days
  const getAverageSessionsPerDay = (): number => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const daySessions = getSessionsForDate(date).filter(s => s.type === 'work');
      last7Days.push(daySessions.length);
    }
    
    const total = last7Days.reduce((sum, count) => sum + count, 0);
    return Math.round((total / 7) * 10) / 10; // Round to 1 decimal place
  };

  return {
    // State
    sessions,
    stats,
    
    // Actions
    addSession,
    clearSessions,
    refreshStats,
    
    // Getters
    getSessionsForDate,
    getThisWeekSessions,
    getWeeklyBreakdown,
    getRecentSessions,
    getSessionDurationInMinutes,
    getTodayFocusTime,
    getAverageSessionsPerDay,
  };
};