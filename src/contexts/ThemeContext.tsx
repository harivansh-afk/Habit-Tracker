import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, useTheme } from '../styles/theme';

type HabitSortOption = 'dateCreated' | 'alphabetical';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  showStreaks: boolean;
  dailyReminder: boolean;
  defaultView: 'habits' | 'calendar';
  habitSort: HabitSortOption;
  toggleDarkMode: () => void;
  toggleStreaks: () => void;
  toggleDailyReminder: () => void;
  setDefaultView: (view: 'habits' | 'calendar') => void;
  setHabitSort: (sort: HabitSortOption) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showStreaks, setShowStreaks] = useState(() => localStorage.getItem('showStreaks') !== 'false');
  const [dailyReminder, setDailyReminder] = useState(() => localStorage.getItem('dailyReminder') === 'true');
  const [defaultView, setDefaultView] = useState<'habits' | 'calendar'>(() => 
    (localStorage.getItem('defaultView') as 'habits' | 'calendar') || 'habits'
  );
  const [habitSort, setHabitSort] = useState<HabitSortOption>(() => 
    (localStorage.getItem('habitSort') as HabitSortOption) || 'dateCreated'
  );
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

  useEffect(() => {
    if (dailyReminder) {
      // Request notification permission if not granted
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }

      // Schedule notification for 10am
      const now = new Date();
      const scheduledTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        10, // 10am
        0,
        0
      );

      // If it's past 10am, schedule for tomorrow
      if (now > scheduledTime) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime();

      const timer = setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Habit Tracker Reminder', {
            body: "Don't forget to track your habits for today!",
            icon: '/favicon.ico' // Add your app's icon path here
          });
          
          // Schedule next day's notification
          const nextDay = new Date(scheduledTime);
          nextDay.setDate(nextDay.getDate() + 1);
          const nextTimeUntilNotification = nextDay.getTime() - new Date().getTime();
          setTimeout(() => {
            if (dailyReminder) {
              new Notification('Habit Tracker Reminder', {
                body: "Don't forget to track your habits for today!",
                icon: '/favicon.ico'
              });
            }
          }, nextTimeUntilNotification);
        }
      }, timeUntilNotification);

      return () => clearTimeout(timer);
    }
  }, [dailyReminder]);

  const toggleDarkMode = () => setIsDark(!isDark);
  const toggleStreaks = () => setShowStreaks(!showStreaks);
  const toggleDailyReminder = () => {
    if (!dailyReminder && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setDailyReminder(true);
          localStorage.setItem('dailyReminder', 'true');
        }
      });
    } else {
      setDailyReminder(!dailyReminder);
      localStorage.setItem('dailyReminder', (!dailyReminder).toString());
    }
  };

  const handleSetDefaultView = (view: 'habits' | 'calendar') => {
    setDefaultView(view);
    localStorage.setItem('defaultView', view);
  };

  const handleSetHabitSort = (sort: HabitSortOption) => {
    setHabitSort(sort);
    localStorage.setItem('habitSort', sort);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDark, 
      showStreaks, 
      dailyReminder,
      defaultView,
      habitSort,
      toggleDarkMode, 
      toggleStreaks,
      toggleDailyReminder,
      setDefaultView: handleSetDefaultView,
      setHabitSort: handleSetHabitSort
    }}>
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