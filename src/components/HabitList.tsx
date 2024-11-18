import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Habit } from '../types';

interface HabitListProps {
  habits: Habit[];
  currentWeek: string[];
  daysOfWeek: string[];
  onToggleHabit: (id: number, date: string) => void;
  onUpdateHabit: (id: number, name: string) => void;
  onDeleteHabit: (id: number) => void;
  onUpdateStreak: (id: number, newStreak: number) => Promise<void>;
}

const calculateStreak = (completedDates: string[]): { currentStreak: number; bestStreak: number } => {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  // Sort dates in descending order (most recent first)
  const sortedDates = [...completedDates]
    .filter(date => !isNaN(new Date(date).getTime()))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // First, check if today is completed
  const hasTodayCompleted = sortedDates.includes(todayStr);
  
  if (!hasTodayCompleted) {
    // If today isn't completed, current streak is 0
    currentStreak = 0;
  } else {
    // Start counting current streak from today
    let checkDate = new Date(today);
    currentStreak = 1; // Start with 1 for today

    // Check previous days
    while (true) {
      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (sortedDates.includes(dateStr)) {
        currentStreak++;
      } else {
        break; // Break streak if a day is missed
      }
    }
  }

  // Calculate best streak
  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(sortedDates[i - 1]);
      const diffDays = Math.floor(
        (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays === 0) {
        // Same day, skip
        continue;
      } else {
        // Reset streak on gap
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  
  // Final check for best streak
  bestStreak = Math.max(bestStreak, tempStreak);
  // Also check if current streak is the best
  bestStreak = Math.max(bestStreak, currentStreak);

  return { currentStreak, bestStreak };
};

const getCurrentWeekDates = () => {
  // Start with Sunday (today's week)
  const now = new Date();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - now.getDay());

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    // Format as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    weekDates.push(formattedDate);
  }

  return weekDates;
};

// If you want Monday first, rotate the array
const currentWeek = (() => {
  const dates = getCurrentWeekDates();
  // Move Sunday to the end
  const sunday = dates.shift()!;
  dates.push(sunday);
  return dates;
})();

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function HabitList({
  habits,
  currentWeek,
  daysOfWeek,
  onToggleHabit,
  onUpdateHabit,
  onDeleteHabit,
  onUpdateStreak,
}: HabitListProps) {
  useEffect(() => {
    console.log('Current week dates:', 
      currentWeek.map(date => 
        `${new Date(date).toLocaleDateString()} (${daysOfWeek[new Date(date).getDay() === 0 ? 6 : new Date(date).getDay() - 1]})`
      )
    );
  }, []);

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left dark:text-white">Habit</th>
          {currentWeek.map((dateStr, index) => {
            const date = new Date(dateStr);
            // Ensure date is interpreted in local timezone
            const displayDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            
            return (
              <th key={dateStr} className="px-4 py-2 text-center dark:text-white">
                <div>{daysOfWeek[index]}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {displayDate.getDate()}
                </div>
              </th>
            );
          })}
          <th className="px-4 py-2 text-center dark:text-white">Current Streak</th>
          <th className="px-4 py-2 text-center dark:text-white">Best Streak</th>
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
                <input
                  type="checkbox"
                  checked={habit.completedDates.includes(date)}
                  onChange={() => {
                    onToggleHabit(habit.id, date);
                    const newCompletedDates = habit.completedDates.includes(date)
                      ? habit.completedDates.filter(d => d !== date)
                      : [...habit.completedDates, date];
                    
                    const { currentStreak, bestStreak } = calculateStreak(newCompletedDates);
                    onUpdateStreak(habit.id, bestStreak);
                  }}
                  aria-label={`Mark ${habit.name} as completed for ${date}`}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                />
              </td>
            ))}
            <td className="px-4 py-2 text-center">
              <span className="dark:text-white font-medium">
                {calculateStreak(habit.completedDates || []).currentStreak}
              </span>
            </td>
            <td className="px-4 py-2 text-center">
              <span className="dark:text-white font-medium">
                {calculateStreak(habit.completedDates || []).bestStreak}
              </span>
            </td>
            <td className="px-4 py-2 text-center">
              <button
                onClick={() => onDeleteHabit(habit.id)}
                className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
