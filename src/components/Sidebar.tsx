import React from 'react';
import { Plus, CalendarIcon, SettingsIcon } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';

type View = 'habits' | 'calendar' | 'settings';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { theme } = useThemeContext();
  
  return (
    <nav className={`w-64 border-r ${theme.border} ${theme.sidebarBackground}`}>
      <div className="p-4">
        <h1 className={`text-2xl font-bold ${theme.text}`}>Habit Tracker</h1>
      </div>
      <ul className="space-y-2 p-4">
        <li>
          <button
            onClick={() => setActiveView('habits')}
            className={`w-full px-4 py-2 text-left rounded-lg ${
              activeView === 'habits'
                ? theme.button.secondary
                : `${theme.text} ${theme.habitItem}`
            }`}
          >
            <Plus className="inline-block mr-2 h-4 w-4" />
            Habits
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveView('calendar')}
            className={`w-full px-4 py-2 text-left rounded-lg ${
              activeView === 'calendar'
                ? theme.button.secondary
                : `${theme.text} ${theme.habitItem}`
            }`}
          >
            <CalendarIcon className="inline-block mr-2 h-4 w-4" />
            Calendar
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveView('settings')}
            className={`w-full px-4 py-2 text-left rounded-lg ${
              activeView === 'settings'
                ? theme.button.secondary
                : `${theme.text} ${theme.habitItem}`
            }`}
          >
            <SettingsIcon className="inline-block mr-2 h-4 w-4" />
            Settings
          </button>
        </li>
      </ul>
    </nav>
  );
}; 