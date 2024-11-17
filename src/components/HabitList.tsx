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
  getStreakForHabit: (habit: Habit) => number;
}

export function HabitList({
  habits,
  currentWeek,
  daysOfWeek,
  onToggleHabit,
  onUpdateHabit,
  onDeleteHabit,
  getStreakForHabit
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
          <th className="px-4 py-2 text-center dark:text-white">Streak</th>
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
                className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-gray-300 rounded px-2"
              />
            </td>
            {currentWeek.map((date) => (
              <td key={date} className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={habit.completedDates.includes(date)}
                  onChange={() => onToggleHabit(habit.id, date)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                />
              </td>
            ))}
            <td className="px-4 py-2 text-center dark:text-white">
              {getStreakForHabit(habit)}
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