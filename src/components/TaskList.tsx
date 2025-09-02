'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/pomodoro';
import { storage } from '@/lib/storage';

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState<number>(1);

  useEffect(() => {
    const storedTasks = storage.getTasks();
    setTasks(storedTasks);
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    storage.setTasks(updatedTasks);
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      pomodorosEstimated: newTaskPomodoros,
      pomodorosCompleted: 0,
      createdAt: new Date(),
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    setNewTaskTitle('');
    setNewTaskPomodoros(1);
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  const incrementTaskPomodoros = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId 
        ? { ...task, pomodorosCompleted: task.pomodorosCompleted + 1 }
        : task
    );
    saveTasks(updatedTasks);
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>📋</span>
          <span>Task List</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new task */}
        <div className="space-y-3">
          <Input
            placeholder="What are you working on?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="w-full"
          />
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Estimated:
            </label>
            <Input
              type="number"
              min="1"
              max="20"
              value={newTaskPomodoros.toString()}
              onChange={(e) => setNewTaskPomodoros(parseInt(e.target.value) || 1)}
              className="w-16 text-center"
            />
            <span className="text-xs text-gray-500">🍅</span>
            <Button onClick={addTask} size="sm" className="flex-1">
              Add Task
            </Button>
          </div>
        </div>

        {/* Active tasks */}
        {activeTasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Tasks ({activeTasks.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{task.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        {task.pomodorosCompleted}/{task.pomodorosEstimated} 🍅
                      </Badge>
                      
                      {task.pomodorosCompleted < (task.pomodorosEstimated || 0) && (
                        <button
                          onClick={() => incrementTaskPomodoros(task.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          +1
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Completed ({completedTasks.length})
            </h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {completedTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 opacity-75"
                >
                  <Checkbox checked={true} disabled />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-through text-gray-600 dark:text-gray-400 truncate">
                      {task.title}
                    </p>
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {task.pomodorosCompleted} 🍅
                    </Badge>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 text-sm opacity-50 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {completedTasks.length > 5 && (
                <p className="text-xs text-gray-500 text-center py-1">
                  ... and {completedTasks.length - 5} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No tasks yet.</p>
            <p className="text-xs mt-1">Add your first task above!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};