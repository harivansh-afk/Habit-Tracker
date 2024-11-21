import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { usePreferences } from '../contexts/PreferencesContext';
import { useThemeContext } from '../contexts/ThemeContext';

export function SettingsView() {
  const { preferences, updatePreferences } = usePreferences();
  const { theme } = useThemeContext();

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    await updatePreferences({ theme: newTheme });
    // Theme will be updated automatically through ThemeContext
  };

  const handleSortChange = async (newSort: 'dateCreated' | 'alphabetical') => {
    await updatePreferences({ habit_sort: newSort });
    // Sort will be updated automatically through ThemeContext
  };

  const handleStreaksChange = async (showStreaks: boolean) => {
    await updatePreferences({ show_streaks: showStreaks });
    // Streaks visibility will be updated automatically through ThemeContext
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      {/* Default View */}
      <div className="space-y-2">
        <h3 className={`text-lg font-medium ${theme.text}`}>Default View</h3>
        <select
          value={preferences.default_view}
          onChange={(e) => updatePreferences({ default_view: e.target.value as 'habits' | 'calendar' })}
          className={`w-full p-2 rounded-lg border ${theme.input}`}
        >
          <option value="habits">Habits</option>
          <option value="calendar">Calendar</option>
        </select>
      </div>

      {/* Sort Habits */}
      <div className="space-y-2">
        <h3 className={`text-lg font-medium ${theme.text}`}>Sort Habits By</h3>
        <select
          value={preferences.habit_sort}
          onChange={(e) => handleSortChange(e.target.value as 'dateCreated' | 'alphabetical')}
          className={`w-full p-2 rounded-lg border ${theme.input}`}
        >
          <option value="dateCreated">Date Created</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      {/* Show Streaks */}
      <div className="space-y-2">
        <h3 className={`text-lg font-medium ${theme.text}`}>Show Streaks</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.show_streaks}
            onChange={(e) => handleStreaksChange(e.target.checked)}
            className="form-checkbox h-5 w-5 text-green-500"
          />
          <span className={theme.text}>Enable streak counting</span>
        </label>
      </div>

      {/* Daily Reminder */}
      <div className="space-y-2">
        <h3 className={`text-lg font-medium ${theme.text}`}>Daily Reminder</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.daily_reminder}
            onChange={(e) => updatePreferences({ daily_reminder: e.target.checked })}
            className="form-checkbox h-5 w-5 text-green-500"
          />
          <span className={theme.text}>Enable daily reminders</span>
        </label>
      </div>

      {/* Theme */}
      <div className="space-y-2">
        <h3 className={`text-lg font-medium ${theme.text}`}>Theme</h3>
        <select
          value={preferences.theme}
          onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
          className={`w-full p-2 rounded-lg border ${theme.input}`}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
} 