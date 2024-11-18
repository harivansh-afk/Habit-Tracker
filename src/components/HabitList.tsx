import React from 'react';
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
  if (completedDates.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const sortedDates = [...completedDates].sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  let currentStreak = 1;
  let bestStreak = 1;
  let tempStreak = 1;

  // Check if the last completion was today or yesterday
  const lastDate = new Date(sortedDates[sortedDates.length - 1]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000));
  
  // If the last completion was more than a day ago, current streak is 0
  if (diffDays > 1) {
    currentStreak = 0;
  }

  // Calculate streaks
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    prevDate.setHours(0, 0, 0, 0);
    currDate.setHours(0, 0, 0, 0);
    
    const diffTime = currDate.getTime() - prevDate.getTime();
    const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));
    
    if (diffDays === 1) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else if (diffDays === 0) {
      // Same day completions don't affect streak
      continue;
    } else {
      tempStreak = 1;
    }
  }

  // Current streak should be the same as tempStreak if the last completion was today or yesterday
  if (diffDays <= 1) {
    currentStreak = tempStreak;
  }

  return { currentStreak, bestStreak };
};

export function HabitList({
  habits,
  currentWeek,
  daysOfWeek,
  onToggleHabit,
  onUpdateHabit,
  onDeleteHabit,
  onUpdateStreak,
}: HabitListProps) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left dark:text-white">Habit</th>
          {daysOfWeek.map((day, index) => (
            <th key={day} className="px-4 py-2 text-center dark:text-white">
              {day}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(currentWeek[index]).getDate()}
              </div>
            </th>
          ))}
          <th className="px-4 py-2 text-center dark:text-white">
            Current Streak
          </th>
          <th className="px-4 py-2 text-center dark:text-white">
            Best Streak
          </th>
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
                {calculateStreak(habit.completedDates).currentStreak}
              </span>
            </td>
            <td className="px-4 py-2 text-center">
              <span className="dark:text-white font-medium">
                {calculateStreak(habit.completedDates).bestStreak}
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
