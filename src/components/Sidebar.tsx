import React from 'react';
import { Plus, CalendarIcon, SettingsIcon, LogOut, User } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type View = 'habits' | 'calendar' | 'settings';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { theme } = useThemeContext();
  const { signOut, user } = useAuth();
  
  return (
    <nav className={`w-72 h-screen sticky top-0 border-r ${theme.border} ${theme.sidebarBackground} flex flex-col`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className={`text-2xl font-bold ${theme.text}`}>Habit Tracker</h1>
      </div>
      <div className="flex-grow overflow-y-auto">
        <ul className="space-y-2 p-4">
          <li>
            <button
              onClick={() => setActiveView('habits')}
              className={`w-full px-6 py-3 text-left rounded-lg transition-all duration-200 flex items-center ${
                activeView === 'habits'
                  ? `${theme.button.secondary} shadow-md`
                  : `${theme.text} ${theme.habitItem} hover:translate-x-1`
              }`}
            >
              <Plus className="h-5 w-5 mr-3" />
              <span className="font-medium">Habits</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView('calendar')}
              className={`w-full px-6 py-3 text-left rounded-lg transition-all duration-200 flex items-center ${
                activeView === 'calendar'
                  ? `${theme.button.secondary} shadow-md`
                  : `${theme.text} ${theme.habitItem} hover:translate-x-1`
              }`}
            >
              <CalendarIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">Calendar</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView('settings')}
              className={`w-full px-6 py-3 text-left rounded-lg transition-all duration-200 flex items-center ${
                activeView === 'settings'
                  ? `${theme.button.secondary} shadow-md`
                  : `${theme.text} ${theme.habitItem} hover:translate-x-1`
              }`}
            >
              <SettingsIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">Settings</span>
            </button>
          </li>
        </ul>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <div className={`w-full px-6 py-3 rounded-lg ${theme.text} ${theme.habitItem} flex items-center`}>
          <User className="h-5 w-5 mr-3" />
          <div className="flex-1 truncate">
            <span className="font-medium block truncate">{user?.email}</span>
          </div>
        </div>
        <button
          onClick={signOut}
          className={`w-full px-6 py-3 text-left rounded-lg transition-all duration-200 flex items-center
            ${theme.text} ${theme.habitItem} hover:bg-red-500/10 hover:text-red-500`}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </nav>
  );
}; 