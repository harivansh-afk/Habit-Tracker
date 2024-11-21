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

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function HabitTrackerContent() {
  const { theme, isDark, toggleDarkMode, defaultView, habitSort } = useThemeContext();
  const [newHabit, setNewHabit] = useState('');
  const [activeView, setActiveView] = useState<'habits' | 'calendar' | 'settings'>(defaultView);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { user, loading, signOut } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  const { 
    habits, 
    fetchHabits, 
    addHabit: addHabitApi, 
    toggleHabit, 
    updateHabit, 
    deleteHabit 
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
    <div className="space-y-6">
      <form onSubmit={handleAddHabit} className="flex gap-2">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a new habit"
          className={`flex-grow px-4 py-2 border rounded-lg ${theme.input}`}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg ${theme.button.primary}`}
        >
          Add Habit
        </button>
      </form>

      <div className={`rounded-lg shadow p-6 ${theme.cardBackground}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">Your Habits</h2>
            <p className="text-sm text-gray-400 dark:text-gray-300 mt-1">Track your weekly progress</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToCurrentWeek}
              className={`px-4 py-2 rounded-lg ${theme.button.primary} text-sm`}
            >
              Today
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => changeWeek('prev')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <ChevronLeft className="h-5 w-5 dark:text-white" />
              </button>
              <button
                onClick={() => changeWeek('next')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <ChevronRight className="h-5 w-5 dark:text-white" />
              </button>
            </div>
          </div>
        </div>

        <HabitList
          habits={getSortedHabits()}
          currentWeek={currentWeek}
          daysOfWeek={DAYS_OF_WEEK}
          onToggleHabit={toggleHabit}
          onUpdateHabit={updateHabit}
          onDeleteHabit={deleteHabit}
        />
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-4">Keep up the good work! Consistency is key.</p>
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
      <div className="flex h-screen">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-8">
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
      <ThemeProvider>
        <HabitTrackerContent />
      </ThemeProvider>
    </AuthProvider>
  );
}