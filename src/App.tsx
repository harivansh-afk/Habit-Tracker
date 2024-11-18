import React, { useState, useEffect } from 'react';
import { Plus, CalendarIcon, SettingsIcon, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { HabitList } from './components/HabitList';
import { Calendar } from './components/Calendar';
import { Habit } from './types';

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [currentWeek, setCurrentWeek] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'habits' | 'calendar' | 'settings'>('habits');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [streakGoal, setStreakGoal] = useState(7);
  const [showCompletedHabits, setShowCompletedHabits] = useState(true);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    fetchHabits();
    setCurrentWeek(getCurrentWeekDates());
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const fetchHabits = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/habits');
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      setHabits([]); // Set empty array on error
    }
  };

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      try {
        const response = await fetch('http://localhost:5000/api/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newHabit }),
        });
        if (response.ok) {
          setNewHabit('');
          fetchHabits();
        }
      } catch (error) {
        console.error('Error adding habit:', error);
      }
    }
  };

  const toggleHabit = async (id: number, date: string) => {
    try {
      await fetch(`http://localhost:5000/api/habits/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      fetchHabits();
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const updateHabit = async (id: number, name: string) => {
    try {
      await fetch(`http://localhost:5000/api/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      fetchHabits();
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const deleteHabit = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/habits/${id}`, {
        method: 'DELETE',
      });
      fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const getCurrentWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  const changeWeek = (direction: 'prev' | 'next') => {
    const firstDay = new Date(currentWeek[0]);
    const newFirstDay = new Date(firstDay.setDate(firstDay.getDate() + (direction === 'prev' ? -7 : 7)));
    setCurrentWeek(Array.from({ length: 7 }, (_, i) => {
      const date = new Date(newFirstDay);
      date.setDate(newFirstDay.getDate() + i);
      return date.toISOString().split('T')[0];
    }));
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + (direction === 'prev' ? -1 : 1));
      return newMonth;
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getCompletedHabitsForDate = (date: string) => {
    return habits.filter(habit => habit.completedDates.includes(date));
  };

  const getStreakForHabit = (habit: Habit) => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < streakGoal; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      if (habit.completedDates.includes(dateString)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const handleUpdateStreak = async (id: number, newStreak: number) => {
    // Prevent negative streaks
    if (newStreak < 0) return;

    // Update in database
    await db.habits.update(id, { manualStreak: newStreak });

    // Update state
    setHabits(habits.map(habit =>
      habit.id === id
        ? { ...habit, manualStreak: newStreak }
        : habit
    ));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="flex h-screen">
        <nav className="w-64 border-r border-gray-200 dark:border-gray-800">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Habit Tracker</h1>
          </div>
          <ul className="space-y-2 p-4">
            <li>
              <button
                onClick={() => setActiveView('habits')}
                className={`w-full px-4 py-2 text-left rounded-lg ${
                  activeView === 'habits'
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                } dark:text-white`}
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
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                } dark:text-white`}
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
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                } dark:text-white`}
              >
                <SettingsIcon className="inline-block mr-2 h-4 w-4" />
                Settings
              </button>
            </li>
          </ul>
        </nav>

        <main className="flex-1 p-8">
          {activeView === 'habits' && (
            <div className="space-y-6">
              <form onSubmit={addHabit} className="flex gap-2">
                <input
                  type="text"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  placeholder="Add a new habit"
                  className="flex-grow px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg dark:bg-white dark:text-black"
                >
                  Add Habit
                </button>
              </form>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold dark:text-white">Weekly Progress</h2>
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

                <HabitList
                  habits={habits}
                  currentWeek={currentWeek}
                  daysOfWeek={daysOfWeek}
                  onToggleHabit={toggleHabit}
                  onUpdateHabit={updateHabit}
                  onDeleteHabit={deleteHabit}
                  onUpdateStreak={handleUpdateStreak}
                />
              </div>
            </div>
          )}

          {activeView === 'calendar' && (
            <Calendar
              currentMonth={currentMonth}
              habits={habits}
              onChangeMonth={changeMonth}
              getDaysInMonth={getDaysInMonth}
              getCompletedHabitsForDate={getCompletedHabitsForDate}
            />
          )}

          {activeView === 'settings' && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="dark:text-white">Dark Mode</span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {darkMode ? (
                      <Sun className="h-5 w-5 dark:text-white" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark:text-white">Streak Goal</span>
                  <select
                    value={streakGoal}
                    onChange={(e) => setStreakGoal(Number(e.target.value))}
                    className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    {[3, 5, 7, 10, 14, 21, 30].map(days => (
                      <option key={days} value={days}>{days} days</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark:text-white">Show Completed Habits</span>
                  <input
                    type="checkbox"
                    checked={showCompletedHabits}
                    onChange={(e) => setShowCompletedHabits(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}