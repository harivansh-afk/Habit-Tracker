import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';
import { Habit } from '../types';

interface CalendarProps {
  currentMonth: Date;
  habits: Habit[];
  onChangeMonth: (direction: 'prev' | 'next') => void;
  getDaysInMonth: (year: number, month: number) => number;
  getCompletedHabitsForDate: (date: string) => Habit[];
  onToggleHabit: (habitId: number, date: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  habits,
  onChangeMonth,
  getDaysInMonth,
  getCompletedHabitsForDate,
  onToggleHabit
}) => {
  const { theme } = useThemeContext();
  
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getFirstDayOfMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    return date.getDay() === 0 ? 6 : date.getDay() - 1;
  };

  // Helper function to format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDate(today);

  const handleToggleHabit = async (e: React.MouseEvent, habitId: number, date: string) => {
    e.stopPropagation();
    await onToggleHabit(habitId, date);
  };

  return (
    <div className={`rounded-lg shadow-md p-6 ${theme.calendar.background}`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className={`text-2xl font-bold ${theme.calendar.header}`}>
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={() => onChangeMonth('prev')}
            className={`p-2.5 rounded-lg ${theme.calendar.navigation.button}`}
          >
            <ChevronLeft className={theme.calendar.navigation.icon} />
          </button>
          <button
            onClick={() => onChangeMonth('next')}
            className={`p-2.5 rounded-lg ${theme.calendar.navigation.button}`}
          >
            <ChevronRight className={theme.calendar.navigation.icon} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {daysOfWeek.map(day => (
          <div key={day} className={`text-center font-semibold mb-2 ${theme.calendar.weekDay}`}>
            {day}
          </div>
        ))}
        
        {(() => {
          const year = currentMonth.getFullYear();
          const month = currentMonth.getMonth();
          const firstDayOfMonth = getFirstDayOfMonth(year, month);
          const daysInMonth = getDaysInMonth(year, month);
          const daysInPrevMonth = getDaysInMonth(year, month - 1);
          
          const days = [];

          // Previous month days
          for (let i = 0; i < firstDayOfMonth; i++) {
            const day = daysInPrevMonth - firstDayOfMonth + i + 1;
            const date = formatDate(new Date(year, month - 1, day));
            days.push({
              date,
              dayNumber: day,
              isCurrentMonth: false
            });
          }

          // Current month days
          for (let i = 1; i <= daysInMonth; i++) {
            const date = formatDate(new Date(year, month, i));
            days.push({
              date,
              dayNumber: i,
              isCurrentMonth: true
            });
          }

          // Next month days
          const remainingDays = 42 - days.length;
          for (let i = 1; i <= remainingDays; i++) {
            const date = formatDate(new Date(year, month + 1, i));
            days.push({
              date,
              dayNumber: i,
              isCurrentMonth: false
            });
          }

          return days.map(({ date, dayNumber, isCurrentMonth }) => {
            const completedHabits = getCompletedHabitsForDate(date);
            const incompleteHabits = habits.filter(habit => !habit.completedDates.includes(date));
            const isToday = date === todayStr;
            
            return (
              <div
                key={date}
                className={`
                  border rounded-lg p-3 min-h-[80px] relative
                  ${theme.border}
                  ${isCurrentMonth ? theme.calendar.day.default : theme.calendar.day.otherMonth}
                  ${isToday ? `
                    border-2 
                    ${theme.calendar.day.today}
                    ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400
                    bg-blue-50 dark:bg-blue-900/20
                    shadow-sm
                  ` : ''}
                `}
              >
                <span className={`font-medium ${isCurrentMonth ? theme.text : theme.calendar.day.otherMonth}`}>
                  {dayNumber}
                </span>
                {habits.length > 0 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                    <div className="group relative inline-block">
                      <div 
                        className={`
                          h-5 px-2 rounded-full cursor-pointer
                          transition-colors duration-200 flex items-center justify-center
                          ${completedHabits.length > 0 
                            ? 'bg-[#2ecc71] dark:bg-[#2ecc71] shadow-sm shadow-[#2ecc7150]' 
                            : `bg-[#e9e9e8] dark:bg-[#393939]`
                          }
                        `}
                      >
                        <span className="text-[8px] font-medium text-black/70 dark:text-white/70">
                          {completedHabits.length}/{habits.length}
                        </span>
                      </div>
                      <div 
                        className={`
                          absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                          opacity-0 invisible 
                          group-hover:opacity-100 group-hover:visible
                          transition-all duration-150 ease-in-out
                          z-50 transform
                          translate-y-1 group-hover:translate-y-0
                        `}
                      >
                        <div className={`
                          pointer-events-auto 
                          rounded-lg p-4 
                          min-w-[200px] max-w-[300px]
                          ${theme.calendar.tooltip.background}
                          ${theme.calendar.tooltip.border}
                          ${theme.calendar.tooltip.shadow}
                          border
                          backdrop-blur-sm
                        `}>
                          {completedHabits.length > 0 && (
                            <div className="mb-3">
                              <span className="text-[#2ecc71] font-semibold block mb-2">
                                ✓ Completed
                              </span>
                              <ul className="space-y-1.5">
                                {completedHabits.map(habit => (
                                  <li 
                                    key={habit.id} 
                                    className={`${theme.text} text-sm truncate flex items-center justify-between`}
                                  >
                                    <span>{habit.name}</span>
                                    <button
                                      onClick={(e) => handleToggleHabit(e, habit.id, date)}
                                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                    >
                                      <Check className="h-4 w-4 text-[#2ecc71]" />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {incompleteHabits.length > 0 && (
                            <div>
                              <span className="text-[#e74c3c] font-semibold block mb-2">
                                ○ Pending
                              </span>
                              <ul className="space-y-1.5">
                                {incompleteHabits.map(habit => (
                                  <li 
                                    key={habit.id} 
                                    className={`${theme.text} text-sm truncate flex items-center justify-between group`}
                                  >
                                    <span>{habit.name}</span>
                                    <button
                                      onClick={(e) => handleToggleHabit(e, habit.id, date)}
                                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Check className="h-4 w-4 text-gray-400 hover:text-[#2ecc71]" />
                                    </button>
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
          });
        })()}
      </div>
    </div>
  );
};