import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
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
    <div className="flex-1">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <form onSubmit={handleAddHabit} className="flex items-center gap-4">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Add a new habit"
              className={`flex-1 px-4 py-2 rounded-lg ${theme.input}`}
            />
            <button
              type="submit"
              disabled={!newHabit.trim()}
              className={`px-4 py-2 rounded-lg ${theme.button.primary} disabled:opacity-50`}
            >
              Add Habit
            </button>
          </form>
        </div>

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
  );

  const renderCalendarView = () => (
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
    <div className={`min-h-screen ${theme.background}`}>
      <div className="flex flex-col md:flex-row h-screen">
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