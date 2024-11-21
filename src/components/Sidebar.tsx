import React from 'react';
import { Plus, CalendarIcon, SettingsIcon, LogOut } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type View = 'habits' | 'calendar' | 'settings';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { theme } = useThemeContext();
  const { signOut } = useAuth();
  
  return (
    <nav className={`w-64 border-r ${theme.border} ${theme.sidebarBackground} flex flex-col`}>
      <div className="p-4">
        <h1 className={`text-2xl font-bold ${theme.text}`}>Habit Tracker</h1>
      </div>
      <ul className="space-y-2 p-4 flex-grow">
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
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={signOut}
          className={`w-full px-4 py-2 text-left rounded-lg ${theme.text} ${theme.habitItem}`}
        >
          <LogOut className="inline-block mr-2 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}; 