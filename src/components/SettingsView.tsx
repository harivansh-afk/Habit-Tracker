import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';

export function SettingsView() {
  const { 
    theme, 
    isDark, 
    showStreaks, 
    dailyReminder, 
    defaultView,
    habitSort,
    toggleDarkMode, 
    toggleStreaks, 
    toggleDailyReminder,
    setDefaultView,
    setHabitSort
  } = useThemeContext();

  const handleReminderToggle = () => {
    if (!dailyReminder && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toggleDailyReminder();
        }
      });
    } else {
      toggleDailyReminder();
    }
  };

  return (
    <div className={`rounded-lg shadow p-6 ${theme.cardBackground}`}>
      <h2 className="text-xl font-semibold mb-6 dark:text-white">Settings</h2>
      
      {/* Theme Toggle */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 dark:text-white">Theme</h3>
        <button
          onClick={toggleDarkMode}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200
            ${isDark 
              ? 'bg-gray-700 text-white hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
        >
          {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>

      {/* Streaks Toggle */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 dark:text-white">Streaks</h3>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={showStreaks}
              onChange={toggleStreaks}
            />
            <div className={`w-10 h-6 rounded-full transition-colors duration-200 
              ${showStreaks ? 'bg-green-500' : 'bg-gray-300'}`}>
              <div className={`absolute w-4 h-4 rounded-full bg-white transition-transform duration-200 transform 
                ${showStreaks ? 'translate-x-5' : 'translate-x-1'} top-1`} />
            </div>
          </div>
          <span className="ml-3 dark:text-white">Show Streaks</span>
        </label>
      </div>

      {/* Daily Reminder Toggle */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 dark:text-white">Notifications</h3>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={dailyReminder}
              onChange={handleReminderToggle}
            />
            <div className={`w-10 h-6 rounded-full transition-colors duration-200 
              ${dailyReminder ? 'bg-green-500' : 'bg-gray-300'}`}>
              <div className={`absolute w-4 h-4 rounded-full bg-white transition-transform duration-200 transform 
                ${dailyReminder ? 'translate-x-5' : 'translate-x-1'} top-1`} />
            </div>
          </div>
          <span className="ml-3 dark:text-white">Daily Reminder</span>
        </label>
      </div>

      {/* Default View */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 dark:text-white">Default View</h3>
        <select
          value={defaultView}
          onChange={(e) => setDefaultView(e.target.value as 'habits' | 'calendar')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="habits">Habits</option>
          <option value="calendar">Calendar</option>
        </select>
      </div>

      {/* Habit Sort */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 dark:text-white">Sort Habits By</h3>
        <select
          value={habitSort}
          onChange={(e) => setHabitSort(e.target.value as 'dateCreated' | 'alphabetical')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="dateCreated">Date Created</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
    </div>
  );
} 