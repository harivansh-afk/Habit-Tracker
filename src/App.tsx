import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sun, Moon, Plus, Circle, User } from 'lucide-react';
import { HabitList } from './components/HabitList';
import { Calendar } from './components/Calendar';
import { Sidebar } from './components/Sidebar';
import { useHabits } from './hooks/useHabits';
import { useWeek } from './hooks/useWeek';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { SettingsView } from './components/SettingsView';
import { MobileNav } from './components/MobileNav';
import { PreferencesProvider, usePreferences } from './contexts/PreferencesContext';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function HabitTrackerContent() {
  const { theme, isDark, toggleDarkMode, defaultView, habitSort } = useThemeContext();
  const [newHabit, setNewHabit] = useState('');
  const [activeView, setActiveView] = useState<'habits' | 'calendar' | 'settings'>(defaultView);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { user, loading, signOut } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const { preferences } = usePreferences();

  const { 
    habits, 
    fetchHabits, 
    addHabit: addHabitApi, 
    toggleHabit, 
    updateHabit, 
    deleteHabit, 
    error 
  } = useHabits();
  
  const { 
    currentWeek, 
    setCurrentWeek, 
    getCurrentWeekDates, 
    changeWeek 
  } = useWeek();

  useEffect(() => {
    fetchHabits();
    setCurrentWeek(getCurrentWeekDates());
  }, []);

  useEffect(() => {
    if (preferences?.default_view) {
      setActiveView(preferences.default_view);
    }
  }, [preferences?.default_view]);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      const success = await addHabitApi(newHabit);
      if (success) {
        setNewHabit('');
      }
    }
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + (direction === 'prev' ? -1 : 1));
      return newMonth;
    });
  };

  const getCompletedHabitsForDate = (date: string) => {
    return habits.filter(habit => habit.completedDates.includes(date));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(getCurrentWeekDates());
  };

  const getSortedHabits = () => {
    if (habitSort === 'alphabetical') {
      return [...habits].sort((a, b) => a.name.localeCompare(b.name));
    }
    // Default to dateCreated (assuming habits are already in creation order)
    return habits;
  };

  const renderHabitsView = () => (
    <div className="flex-1 relative">
      <div className="max-w-5xl mx-auto relative">
        <div className="md:hidden mb-4">
          <div className={`
            p-4 rounded-lg
            ${theme.cardBackground}
            ${theme.border}
            border
            flex items-center gap-3
          `}>
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${theme.text} truncate`}>
                {user?.email}
              </div>
              <div className={`text-xs ${theme.mutedText}`}>
                Logged in
              </div>
            </div>
          </div>
        </div>

        <div className={`
          mb-8 p-4 md:p-6 
          rounded-lg shadow-md
          ${theme.cardBackground}
          ${theme.border}
          border
          relative z-10
        `}>
          <form onSubmit={handleAddHabit} className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
            <div className="flex-1 relative">
              <Plus className={`
                absolute left-4 top-1/2 transform -translate-y-1/2 
                h-5 w-5 
                ${theme.text} opacity-50
              `} />
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Add a new habit"
                className={`
                  w-full px-12 py-3 
                  rounded-lg
                  transition-all duration-200
                  ${theme.input}
                  focus:ring-2 focus:ring-blue-500/20 focus:outline-none
                  placeholder:opacity-50
                `}
              />
            </div>
            <button
              type="submit"
              disabled={!newHabit.trim()}
              className={`
                w-full md:w-auto
                px-6 py-3 
                rounded-lg
                transition-all duration-200
                flex items-center justify-center gap-2
                ${theme.button.primary} 
                disabled:opacity-50
                ${newHabit.trim() ? 'hover:translate-x-1' : ''}
              `}
            >
              <span className="font-medium">Add Habit</span>
            </button>
          </form>
        </div>

        <div className="relative z-10">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-xl font-bold ${theme.text}`}>Your Habits</h2>
                <p className={`text-sm ${theme.mutedText}`}>Track your weekly progress</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => changeWeek('prev')}
                  className={`p-2 rounded-lg ${theme.button.icon}`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToCurrentWeek}
                  className={`px-4 py-2 rounded-lg ${theme.button.secondary}`}
                >
                  Today
                </button>
                <button
                  onClick={() => changeWeek('next')}
                  className={`p-2 rounded-lg ${theme.button.icon}`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">
              {error}
              <button
                onClick={fetchHabits}
                className="ml-2 text-blue-500 hover:underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <HabitList
                habits={getSortedHabits()}
                currentWeek={currentWeek}
                daysOfWeek={DAYS_OF_WEEK}
                onToggleHabit={toggleHabit}
                onUpdateHabit={updateHabit}
                onDeleteHabit={deleteHabit}
              />
              <p className={`text-sm ${theme.mutedText} mt-4`}>
                Keep up the good work! Consistency is key.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderCalendarView = () => (
    <div className="relative">
      <Calendar
        currentMonth={currentMonth}
        habits={habits}
        onChangeMonth={changeMonth}
        getDaysInMonth={(year, month) => new Date(year, month + 1, 0).getDate()}
        getCompletedHabitsForDate={getCompletedHabitsForDate}
        onToggleHabit={async (habitId, date) => {
          await toggleHabit(habitId, date);
          await fetchHabits();
        }}
      />
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return authView === 'login' ? (
      <Login onSwitchToSignUp={() => setAuthView('signup')} />
    ) : (
      <SignUp onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div className={`min-h-screen ${theme.background} relative overflow-hidden`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-[10%] right-[-5%] w-[60%] h-[60%] opacity-[0.02] dark:opacity-[0.04]">
          <Circle className="w-full h-full" />
        </div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] opacity-[0.015] dark:opacity-[0.03]">
          <Circle className="w-full h-full" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-screen relative" style={{ zIndex: 1 }}>
        <div className="md:hidden">
          <MobileNav activeView={activeView} setActiveView={setActiveView} />
        </div>
        <div className="hidden md:block">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
        </div>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
          {activeView === 'habits' && renderHabitsView()}
          {activeView === 'calendar' && renderCalendarView()}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

export default function HabitTracker() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <ThemeProvider>
          <HabitTrackerContent />
        </ThemeProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
}