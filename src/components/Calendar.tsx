import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Habit } from '../types';

interface CalendarProps {
  currentMonth: Date;
  habits: Habit[];
  onChangeMonth: (direction: 'prev' | 'next') => void;
  getDaysInMonth: (year: number, month: number) => number;
  getCompletedHabitsForDate: (date: string) => Habit[];
}

export function Calendar({
  currentMonth,
  habits,
  onChangeMonth,
  getDaysInMonth,
  getCompletedHabitsForDate
}: CalendarProps) {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold dark:text-white">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onChangeMonth('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5 dark:text-white" />
          </button>
          <button
            onClick={() => onChangeMonth('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
          >
            <ChevronRight className="h-5 w-5 dark:text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-300 mb-2">
            {day}
          </div>
        ))}
        {Array.from({ length: getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, index) => {
          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            index + 1
          ).toISOString().split('T')[0];
          const completedHabits = getCompletedHabitsForDate(date);
          const incompleteHabits = habits.filter(habit => !habit.completedDates.includes(date));
          
          return (
            <div
              key={date}
              className="border dark:border-gray-700 rounded-lg p-3 min-h-[80px] relative group hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-sm font-medium dark:text-white">{index + 1}</span>
              {habits.length > 0 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <div 
                      className={`h-3 w-3 ${
                        completedHabits.length > 0 
                          ? 'bg-green-500 shadow-sm shadow-green-200' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      } rounded-full transition-colors duration-200`}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 hidden group-hover:block">
                      <div className="bg-white dark:bg-gray-800 text-sm rounded-lg shadow-lg p-4 border dark:border-gray-700 min-w-[200px]">
                        {completedHabits.length > 0 && (
                          <div className="mb-3">
                            <span className="text-green-500 font-semibold block mb-1">
                              ✓ Completed
                            </span>
                            <ul className="space-y-1">
                              {completedHabits.map(habit => (
                                <li key={habit.id} className="text-gray-600 dark:text-gray-300">
                                  {habit.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {incompleteHabits.length > 0 && (
                          <div>
                            <span className="text-red-500 font-semibold block mb-1">
                              ○ Pending
                            </span>
                            <ul className="space-y-1">
                              {incompleteHabits.map(habit => (
                                <li key={habit.id} className="text-gray-600 dark:text-gray-300">
                                  {habit.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}