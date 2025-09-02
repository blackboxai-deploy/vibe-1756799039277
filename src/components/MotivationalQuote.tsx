'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PRODUCTIVITY_QUOTES = [
  {
    text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey"
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss"
  },
  {
    text: "You have to decide what your highest priorities are and have the courage to say 'no' to other things.",
    author: "Stephen Covey"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "What we fear doing most is usually what we most need to do.",
    author: "Tim Ferriss"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "It's not about having time. It's about making time.",
    author: "Unknown"
  },
  {
    text: "Time blocking is the most powerful time management technique.",
    author: "Cal Newport"
  },
  {
    text: "Deep work is like a superpower in our increasingly competitive economy.",
    author: "Cal Newport"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    text: "Progress, not perfection, is the goal.",
    author: "Unknown"
  },
  {
    text: "You don't have to be great to get started, but you have to get started to be great.",
    author: "Les Brown"
  },
  {
    text: "Focus is a matter of deciding what things you're not going to do.",
    author: "John Carmack"
  },
  {
    text: "The Pomodoro Technique teaches us that time is not our enemy but our ally.",
    author: "Francesco Cirillo"
  },
  {
    text: "A goal is a dream with a deadline.",
    author: "Napoleon Hill"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln"
  },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma"
  }
];

interface MotivationalQuoteProps {
  className?: string;
  showRefresh?: boolean;
}

export const MotivationalQuote: React.FC<MotivationalQuoteProps> = ({
  className = '',
  showRefresh = true,
}) => {
  const [currentQuote, setCurrentQuote] = useState(PRODUCTIVITY_QUOTES[0]);

  useEffect(() => {
    // Set random quote on component mount
    const randomIndex = Math.floor(Math.random() * PRODUCTIVITY_QUOTES.length);
    setCurrentQuote(PRODUCTIVITY_QUOTES[randomIndex]);
  }, []);

  const getNewQuote = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * PRODUCTIVITY_QUOTES.length);
    } while (PRODUCTIVITY_QUOTES[randomIndex] === currentQuote && PRODUCTIVITY_QUOTES.length > 1);
    
    setCurrentQuote(PRODUCTIVITY_QUOTES[randomIndex]);
  };

  return (
    <Card className={`bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800 ${className}`}>
      <CardContent className="p-6 text-center space-y-4">
        <div className="text-2xl">💡</div>
        
        <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
          "{currentQuote.text}"
        </blockquote>
        
        <cite className="text-sm text-purple-600 dark:text-purple-400 font-medium">
          — {currentQuote.author}
        </cite>
        
        {showRefresh && (
          <Button
            onClick={getNewQuote}
            variant="outline"
            size="sm"
            className="mt-4 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20"
          >
            <div className="flex items-center space-x-1">
              <span className="text-sm">🔄</span>
              <span>New Quote</span>
            </div>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};