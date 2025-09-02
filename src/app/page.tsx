'use client';

import React, { useState } from 'react';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { SessionStats } from '@/components/SessionStats';
import { SettingsPanel } from '@/components/SettingsPanel';
import { TaskList } from '@/components/TaskList';
import { MotivationalQuote } from '@/components/MotivationalQuote';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePomodoro } from '@/hooks/usePomodoro';

export default function PomodoroApp() {
  const { settings, updateSettings } = usePomodoro();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🍅</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Pomodoro Focus
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Boost your productivity with focused work sessions
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <span>⚙️</span>
                <span>Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {showSettings ? (
          /* Settings View */
          <div className="max-w-4xl mx-auto">
            <SettingsPanel
              settings={settings}
              onUpdateSettings={updateSettings}
              onClose={() => setShowSettings(false)}
            />
          </div>
        ) : (
          /* Main Timer View */
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="timer" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
                <TabsTrigger value="timer" className="flex items-center space-x-2">
                  <span>⏰</span>
                  <span>Timer</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>Stats</span>
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center space-x-2">
                  <span>📋</span>
                  <span>Tasks</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timer" className="space-y-8">
                {/* Timer Section */}
                <div className="flex justify-center">
                  <PomodoroTimer />
                </div>

                {/* Quick Tips */}
                <Card className="max-w-2xl mx-auto bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
                      🎯 How to Use Pomodoro Technique
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <span className="text-blue-500 font-bold">1.</span>
                          <span>Choose a task to work on</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-blue-500 font-bold">2.</span>
                          <span>Start a 25-minute focus session</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <span className="text-green-500 font-bold">3.</span>
                          <span>Take a 5-minute break</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-green-500 font-bold">4.</span>
                          <span>After 4 sessions, take a longer break</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <SessionStats />
                <div className="max-w-2xl mx-auto">
                  <MotivationalQuote />
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <TaskList />
                  <div className="space-y-6">
                    <MotivationalQuote />
                    <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                          🎯 Task Tips
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <p>• Break large tasks into smaller, manageable chunks</p>
                          <p>• Estimate 1-2 pomodoros for small tasks</p>
                          <p>• Use the +1 button to track completed sessions</p>
                          <p>• Mark tasks as complete when finished</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              Built with focus and productivity in mind 🚀
            </p>
            <div className="flex items-center justify-center space-x-4">
              <span>🍅 Stay focused</span>
              <span>•</span>
              <span>⏰ Take breaks</span>
              <span>•</span>
              <span>📈 Track progress</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}