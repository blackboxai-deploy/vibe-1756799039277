'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PomodoroSettings, SoundType } from '@/types/pomodoro';

interface SettingsPanelProps {
  settings: PomodoroSettings;
  onUpdateSettings: (settings: PomodoroSettings) => void;
  onClose?: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const [localSettings, setLocalSettings] = useState<PomodoroSettings>(settings);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    onClose?.();
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  const updateSetting = <K extends keyof PomodoroSettings>(
    key: K,
    value: PomodoroSettings[K]
  ) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>⚙️</span>
          <span>Timer Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Durations */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Timer Durations (minutes)
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="work-duration" className="text-sm">Work Session</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="work-duration"
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.workDuration.toString()}
                  onChange={(e) => updateSetting('workDuration', parseInt(e.target.value) || 25)}
                  className="w-16 text-center"
                />
                <span className="text-xs text-gray-500">min</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="short-break-duration" className="text-sm">Short Break</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="short-break-duration"
                  type="number"
                  min="1"
                  max="30"
                  value={localSettings.shortBreakDuration.toString()}
                  onChange={(e) => updateSetting('shortBreakDuration', parseInt(e.target.value) || 5)}
                  className="w-16 text-center"
                />
                <span className="text-xs text-gray-500">min</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="long-break-duration" className="text-sm">Long Break</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="long-break-duration"
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.longBreakDuration.toString()}
                  onChange={(e) => updateSetting('longBreakDuration', parseInt(e.target.value) || 15)}
                  className="w-16 text-center"
                />
                <span className="text-xs text-gray-500">min</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="long-break-interval" className="text-sm">Long Break After</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="long-break-interval"
                  type="number"
                  min="2"
                  max="8"
                  value={localSettings.longBreakInterval.toString()}
                  onChange={(e) => updateSetting('longBreakInterval', parseInt(e.target.value) || 4)}
                  className="w-16 text-center"
                />
                <span className="text-xs text-gray-500">sessions</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Auto-Start Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Auto-Start
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start-breaks" className="text-sm">Auto-start Breaks</Label>
              <Switch
                id="auto-start-breaks"
                checked={localSettings.autoStartBreaks}
                onCheckedChange={(checked) => updateSetting('autoStartBreaks', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start-work" className="text-sm">Auto-start Work</Label>
              <Switch
                id="auto-start-work"
                checked={localSettings.autoStartWork}
                onCheckedChange={(checked) => updateSetting('autoStartWork', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Sound Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Sound & Notifications
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-enabled" className="text-sm">Enable Sounds</Label>
              <Switch
                id="sound-enabled"
                checked={localSettings.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>

            {localSettings.soundEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="sound-volume" className="text-sm">Volume</Label>
                  <div className="px-3">
                    <Slider
                      id="sound-volume"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[localSettings.soundVolume]}
                      onValueChange={([value]) => updateSetting('soundVolume', value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Silent</span>
                    <span>{Math.round(localSettings.soundVolume * 100)}%</span>
                    <span>Loud</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-sound" className="text-sm">Notification Sound</Label>
                  <Select
                    value={localSettings.notificationSound}
                    onValueChange={(value: SoundType) => updateSetting('notificationSound', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bell">🔔 Bell</SelectItem>
                      <SelectItem value="chime">🎵 Chime</SelectItem>
                      <SelectItem value="beep">📻 Beep</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Goals */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Daily Goal
          </h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="daily-goal" className="text-sm">Pomodoros per Day</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="daily-goal"
                type="number"
                min="1"
                max="20"
                value={localSettings.dailyGoal.toString()}
                onChange={(e) => updateSetting('dailyGoal', parseInt(e.target.value) || 8)}
                className="w-16 text-center"
              />
              <span className="text-xs text-gray-500">🍅</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="ghost" size="sm">
              ✕
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};