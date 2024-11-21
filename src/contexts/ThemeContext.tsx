import React, { createContext, useContext, useEffect } from 'react';
import { lightTheme, darkTheme } from '../styles/theme';
import { usePreferences } from './PreferencesContext';

interface ThemeContextType {
  theme: typeof lightTheme;
  showStreaks: boolean;
  habitSort: 'dateCreated' | 'alphabetical';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { preferences, updatePreferences } = usePreferences();

  // Use preferences or fallback to defaults
  const currentTheme = preferences?.theme === 'dark' ? darkTheme : lightTheme;
  const showStreaks = preferences?.show_streaks ?? true;
  const habitSort = preferences?.habit_sort ?? 'dateCreated';

  useEffect(() => {
    // Apply theme to document
    if (preferences?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences?.theme]);

  return (
    <ThemeContext.Provider value={{ 
      theme: currentTheme, 
      showStreaks, 
      habitSort 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
} 