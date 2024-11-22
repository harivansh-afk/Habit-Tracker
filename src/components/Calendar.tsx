import React from 'react';
import { createPortal } from 'react-dom';
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

  // Add state for tooltip positioning
  const [tooltipData, setTooltipData] = React.useState<{
    x: number;
    y: number;
    completedHabits: Habit[];
    incompleteHabits: Habit[];
    date: string;
    isVisible: boolean;
  } | null>(null);

  // Add ref for timeout
  const hideTimeoutRef = React.useRef<NodeJS.Timeout>();
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  // Modified tooltip handlers
  const showTooltip = (e: React.MouseEvent, date: string, completed: Habit[], incomplete: Habit[]) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipData({
      x: rect.left + rect.width / 2,
      y: rect.top,
      completedHabits: completed,
      incompleteHabits: incomplete,
      date,
      isVisible: true
    });
  };

  const hideTooltip = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      setTooltipData(prev => prev ? { ...prev, isVisible: false } : null);
    }, 150); // 150ms delay before hiding
  };

  const cancelHideTooltip = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
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
                    ${isToday ? theme.calendar.day.today : ''}
                  `}
                >
                  <span className={`
                    font-medium 
                    ${isCurrentMonth ? theme.text : theme.calendar.day.otherMonth}
                    ${isToday ? 'relative' : ''}
                  `}>
                    {dayNumber}
                  </span>
                  {habits.length > 0 && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                      <div 
                        className="relative"
                        onMouseEnter={(e) => showTooltip(e, date, completedHabits, incompleteHabits)}
                        onMouseLeave={hideTooltip}
                      >
                        <div className="flex items-center gap-1.5">
                          {isToday && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                          )}
                          <div 
                            className={`
                              h-6 px-2.5 rounded-full cursor-pointer
                              transition-all duration-200 flex items-center justify-center gap-1
                              ${completedHabits.length > 0 
                                ? 'bg-green-100 dark:bg-green-900/30 shadow-[0_2px_10px] shadow-green-900/20 dark:shadow-green-100/20' 
                                : `bg-gray-100 dark:bg-gray-800 shadow-sm`
                              }
                            `}
                          >
                            <span className={`
                              text-xs font-medium
                              ${completedHabits.length > 0 
                                ? 'text-green-700 dark:text-green-300' 
                                : 'text-gray-600 dark:text-gray-400'
                              }
                            `}>
                              {completedHabits.length}/{habits.length}
                            </span>
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

      {/* Updated tooltip portal with more subtle animations */}
      {tooltipData && createPortal(
        <div
          ref={tooltipRef}
          onMouseEnter={cancelHideTooltip}
          onMouseLeave={hideTooltip}
          className={`
            fixed
            transition-all duration-150 ease-in-out
            ${tooltipData.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-1'
            }
          `}
          style={{
            left: tooltipData.x,
            top: tooltipData.y - 8,
            transform: 'translate(-50%, -100%)',
            pointerEvents: tooltipData.isVisible ? 'auto' : 'none',
          }}
        >
          <div 
            className={`
              rounded-lg p-4 
              w-[200px]
              ${theme.calendar.tooltip.background}
              ${theme.calendar.tooltip.border}
              shadow-[0_10px_38px_-10px_rgba(22,23,24,0.35),0_10px_20px_-15px_rgba(22,23,24,0.2)]
              border
              backdrop-blur-sm
              relative
              transition-all duration-150 ease-in-out
              scale-100 origin-[bottom]
              ${tooltipData.isVisible ? 'scale-100' : 'scale-98'}
            `}
          >
            {/* Arrow */}
            <div 
              className={`
                absolute -bottom-2 left-1/2 -translate-x-1/2
                w-4 h-4 rotate-45
                ${theme.calendar.tooltip.background}
                ${theme.calendar.tooltip.border}
                border-t-0 border-l-0
              `}
            />
            
            <div className="relative">
              {tooltipData.completedHabits.length > 0 && (
                <div className="mb-3">
                  <span className="text-[#2ecc71] font-semibold block mb-2">
                    ✓ Completed
                  </span>
                  <ul className="space-y-1.5">
                    {tooltipData.completedHabits.map(habit => (
                      <li 
                        key={habit.id} 
                        className={`${theme.text} text-sm truncate flex items-center justify-between`}
                      >
                        <span>{habit.name}</span>
                        <button
                          onClick={(e) => handleToggleHabit(e, habit.id, tooltipData.date)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Check className="h-4 w-4 text-[#2ecc71]" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tooltipData.incompleteHabits.length > 0 && (
                <div>
                  <span className="text-[#e74c3c] font-semibold block mb-2">
                    ○ Pending
                  </span>
                  <ul className="space-y-1.5">
                    {tooltipData.incompleteHabits.map(habit => (
                      <li 
                        key={habit.id} 
                        className={`${theme.text} text-sm truncate flex items-center justify-between group`}
                      >
                        <span>{habit.name}</span>
                        <button
                          onClick={(e) => handleToggleHabit(e, habit.id, tooltipData.date)}
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
        </div>,
        document.body
      )}
    </>
  );
};