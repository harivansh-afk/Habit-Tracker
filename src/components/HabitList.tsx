import React from 'react';
import { Trash2 } from 'lucide-react';
import { Habit } from '../types';
import { useThemeContext } from '../contexts/ThemeContext';
import { calculateStreak } from '../utils/streakCalculator';

interface HabitListProps {
  habits: Habit[];
  currentWeek: string[];
  daysOfWeek: string[];
  onToggleHabit: (id: number, date: string) => void;
  onUpdateHabit: (id: number, name: string) => void;
  onDeleteHabit: (id: number) => void;
  onUpdateStreak?: (id: number, newStreak: number) => Promise<void>;
}

export function HabitList({
  habits,
  currentWeek,
  daysOfWeek,
  onToggleHabit,
  onUpdateHabit,
  onDeleteHabit,
}: HabitListProps) {
  const { showStreaks } = useThemeContext();

  // Helper function to get day name
  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
    return daysOfWeek[dayIndex];
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left px-4 py-2 dark:text-white">Habit</th>
            {currentWeek.map((dateStr) => {
              const date = new Date(dateStr);
              return (
                <th key={dateStr} className="px-4 py-2 text-center dark:text-white">
                  <div>{getDayName(dateStr)}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {date.getDate()}
                  </div>
                </th>
              );
            })}
            {showStreaks && (
              <>
                <th className="px-4 py-2 text-center dark:text-white">Current Streak</th>
                <th className="px-4 py-2 text-center dark:text-white">Best Streak</th>
              </>
            )}
            <th className="px-4 py-2 text-center dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <tr key={habit.id} className="border-t dark:border-gray-700">
              <td className="px-4 py-2 dark:text-white">
                <input
                  type="text"
                  value={habit.name}
                  onChange={(e) => onUpdateHabit(habit.id, e.target.value)}
                  aria-label="Habit name"
                  placeholder="Enter habit name"
                  className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-gray-300 rounded px-2"
                />
              </td>
              {currentWeek.map((date) => (
                <td key={date} className="px-4 py-2 text-center">
                  <label className="relative inline-block cursor-pointer">
                    <input
                      type="checkbox"
                      checked={habit.completedDates.includes(date)}
                      onChange={() => {
                        onToggleHabit(habit.id, date);
                      }}
                      aria-label={`Mark ${habit.name} as completed for ${date}`}
                      className="sr-only"
                    />
                    <div className={`
                      w-6 h-6 rounded-md border-2 transition-all duration-200
                      ${habit.completedDates.includes(date) 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-400'}
                      flex items-center justify-center
                    `}>
                      {habit.completedDates.includes(date) && (
                        <svg 
                          className="w-4 h-4 text-white" 
                          fill="none" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                  </label>
                </td>
              ))}
              {showStreaks && (
                <>
                  <td className="px-4 py-2 text-center">
                    <span className="text-yellow-500 dark:text-yellow-400 font-medium text-lg">
                      {calculateStreak(habit.completedDates || []).currentStreak}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className="text-yellow-500 dark:text-yellow-400 font-medium text-lg">
                      {calculateStreak(habit.completedDates || []).bestStreak}
                    </span>
                  </td>
                </>
              )}
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => onDeleteHabit(habit.id)}
                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
