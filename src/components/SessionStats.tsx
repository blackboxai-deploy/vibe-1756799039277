'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSessionStorage } from '@/hooks/useSessionStorage';

export const SessionStats: React.FC = () => {
  const { 
    stats, 
    getTodayFocusTime, 
    getAverageSessionsPerDay, 
    getWeeklyBreakdown 
  } = useSessionStorage();

  const todayFocusTime = getTodayFocusTime();
  const averageSessions = getAverageSessionsPerDay();
  const weeklyBreakdown = getWeeklyBreakdown();

  const formatFocusTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {stats.today}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Today
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {stats.thisWeek}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                This Week
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {stats.streak}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Day Streak
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {stats.total}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                Total
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>📊</span>
            <span>Weekly Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Focus time and average */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Today's Focus Time:</span>
            <Badge variant="outline" className="font-mono">
              {formatFocusTime(todayFocusTime)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Daily Average (7d):</span>
            <Badge variant="outline" className="font-mono">
              {averageSessions} sessions
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Longest Streak:</span>
            <Badge variant="outline" className="font-mono">
              {stats.longestStreak} days
            </Badge>
          </div>

          {/* Weekly breakdown */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">This Week:</div>
            <div className="grid grid-cols-7 gap-1">
              {weeklyBreakdown.map((day) => (
                <div
                  key={day.day}
                  className={`text-center p-2 rounded-lg text-xs transition-colors ${
                    day.isToday
                      ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-300 dark:border-blue-700'
                      : day.sessions > 0
                      ? 'bg-green-100 dark:bg-green-900'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <div className="font-medium">{day.day}</div>
                  <div className={`font-bold ${
                    day.isToday
                      ? 'text-blue-700 dark:text-blue-300'
                      : day.sessions > 0
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {day.sessions}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};