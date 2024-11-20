import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, useTheme } from '../styles/theme';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  showStreaks: boolean;
  toggleDarkMode: () => void;
  toggleStreaks: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showStreaks, setShowStreaks] = useState(() => localStorage.getItem('showStreaks') !== 'false');
  const theme = useTheme(isDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark.toString());
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('showStreaks', showStreaks.toString());
  }, [showStreaks]);

  const toggleDarkMode = () => setIsDark(!isDark);
  const toggleStreaks = () => setShowStreaks(!showStreaks);

  return (
    <ThemeContext.Provider value={{ theme, isDark, showStreaks, toggleDarkMode, toggleStreaks }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}; 