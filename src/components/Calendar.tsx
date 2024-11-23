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

// Add this utility function at the top of the file
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

export const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  habits,
  onChangeMonth,
  getDaysInMonth,
  getCompletedHabitsForDate,
  onToggleHabit
}) => {
  const { theme } = useThemeContext();
  const isMobile = useIsMobile();

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

  // Update selected date data when habits change
  const [selectedDate, setSelectedDate] = React.useState<{
    date: string;
    completedHabits: Habit[];
    incompleteHabits: Habit[];
  } | null>(null);

  // Update the selected date data whenever habits change or a habit is toggled
  React.useEffect(() => {
    if (selectedDate) {
      setSelectedDate({
        date: selectedDate.date,
        completedHabits: getCompletedHabitsForDate(selectedDate.date),
        incompleteHabits: habits.filter(habit =>
          !getCompletedHabitsForDate(selectedDate.date)
            .map(h => h.id)
            .includes(habit.id)
        )
      });
    }
  }, [habits, getCompletedHabitsForDate]);

  // Modified habit toggle handler for mobile view
  const handleMobileHabitToggle = async (e: React.MouseEvent, habitId: number, date: string) => {
    e.stopPropagation();
    await onToggleHabit(habitId, date);

    // Ensure we're using the correct date for the selected date display
    const selectedUTCDate = new Date(date + 'T00:00:00.000Z');

    setSelectedDate({
      date,
      completedHabits: getCompletedHabitsForDate(date),
      incompleteHabits: habits.filter(habit =>
        !getCompletedHabitsForDate(date)
          .map(h => h.id)
          .includes(habit.id)
      )
    });
  };

  // Update the formatDisplayDate function to handle UTC dates correctly
  const formatDisplayDate = (dateStr: string) => {
    // Create a UTC date from the ISO string
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return date.toLocaleDateString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC' // Ensure we use UTC timezone
    });
  };

  return (
    <>
      <div className={`
        rounded-lg shadow-md p-6 md:p-6
        ${theme.calendar.background}
        ${isMobile ? 'p-2 mx-[-1rem]' : ''}
      `}>
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <h2 className={`
            ${theme.calendar.header}
            ${isMobile ? 'text-lg' : 'text-2xl'}
            font-bold
          `}>
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

        <div className="grid grid-cols-7 gap-1 md:gap-4">
          {daysOfWeek.map(day => (
            <div key={day} className={`
              text-center font-semibold mb-1 md:mb-2
              ${theme.calendar.weekDay}
              ${isMobile ? 'text-xs' : ''}
            `}>
              {isMobile ? day.charAt(0) : day}
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
                  onClick={() => {
                    if (isMobile) {
                      setSelectedDate({
                        date,
                        completedHabits,
                        incompleteHabits
                      });
                    }
                  }}
                  className={`
                    border rounded-lg relative
                    ${theme.border}
                    ${isCurrentMonth ? theme.calendar.day.default : theme.calendar.day.otherMonth}
                    ${isToday ? theme.calendar.day.today : ''}
                    ${isMobile ? 'p-1 min-h-[60px] active:bg-gray-100 dark:active:bg-gray-800' : 'p-3 min-h-[80px]'}
                  `}
                >
                  <span className={`
                    font-medium
                    ${isCurrentMonth ? theme.text : theme.calendar.day.otherMonth}
                    ${isToday ? 'relative' : ''}
                    ${isMobile ? 'text-sm' : ''}
                  `}>
                    {dayNumber}
                  </span>
                  {habits.length > 0 && (
                    <div className={`
                      absolute bottom-1 left-1/2 transform -translate-x-1/2
                      ${isMobile ? 'w-full px-1' : ''}
                    `}>
                      <div
                        className="relative"
                        {...(!isMobile ? {
                          onMouseEnter: (e) => showTooltip(e, date, completedHabits, incompleteHabits),
                          onMouseLeave: hideTooltip
                        } : {})}
                      >
                        {isMobile ? (
                          <div className="flex flex-col items-center">
                            <div className={`
                              text-xs font-medium px-1.5 py-0.5 rounded
                              ${completedHabits.length > 0
                                ? 'text-green-700 dark:text-green-300'
                                : `${theme.text} opacity-75`
                              }
                            `}>
                              {completedHabits.length}/{habits.length}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {isToday && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                            )}
                            <div className={`
                              h-6 px-2.5 rounded-full cursor-pointer
                              transition-all duration-200 flex items-center justify-center gap-1
                              ${completedHabits.length > 0
                                ? 'bg-green-100 dark:bg-green-900/30 shadow-[0_2px_10px] shadow-green-900/20 dark:shadow-green-100/20'
                                : `bg-gray-100 dark:bg-gray-800 shadow-sm`
                              }
                            `}>
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
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Mobile Selected Date Details */}
      {isMobile && selectedDate && (
        <div className={`
          mt-6 p-4 rounded-lg
          ${theme.cardBackground}
          border ${theme.border}
          shadow-md
        `}>
          <div className="mb-4">
            <h3 className={`text-lg font-medium ${theme.text}`}>
              {formatDisplayDate(selectedDate.date)}
            </h3>
          </div>

          {selectedDate.completedHabits.length > 0 && (
            <div className="mb-4">
              <span className="text-emerald-500 dark:text-emerald-400 font-medium block mb-2.5 text-sm">
                ✓ Completed
              </span>
              <ul className="space-y-2">
                {selectedDate.completedHabits.map(habit => (
                  <li
                    key={habit.id}
                    className={`${theme.text} text-sm truncate flex items-center justify-between group`}
                  >
                    <span className="truncate mr-2">{habit.name}</span>
                    <button
                      onClick={(e) => handleMobileHabitToggle(e, habit.id, selectedDate.date)}
                      className={`p-1.5 rounded-lg transition-colors ${theme.habitItem}`}
                    >
                      <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedDate.incompleteHabits.length > 0 && (
            <div>
              <span className="text-rose-500 dark:text-rose-400 font-medium block mb-2.5 text-sm">
                ○ Pending
              </span>
              <ul className="space-y-2">
                {selectedDate.incompleteHabits.map(habit => (
                  <li
                    key={habit.id}
                    className={`${theme.text} text-sm truncate flex items-center justify-between group`}
                  >
                    <span className="truncate mr-2">{habit.name}</span>
                    <button
                      onClick={(e) => handleMobileHabitToggle(e, habit.id, selectedDate.date)}
                      className={`p-1.5 rounded-lg transition-colors ${theme.habitItem}`}
                    >
                      <Check className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-emerald-500 dark:hover:text-emerald-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedDate.completedHabits.length === 0 && selectedDate.incompleteHabits.length === 0 && (
            <p className={`text-sm ${theme.mutedText} text-center py-4`}>
              No habits tracked for this date
            </p>
          )}
        </div>
      )}

      {/* Desktop Tooltip Portal - unchanged */}
      {!isMobile && tooltipData && createPortal(
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
            zIndex: 100,
          }}
        >
          <div
            className={`
              rounded-2xl p-5
              w-[240px]
              bg-white dark:bg-[#232323]
              border
              ${theme.border}
              shadow-lg
              relative
              transition-all duration-150 ease-in-out
              scale-100 origin-[bottom]
              ${tooltipData.isVisible ? 'scale-100' : 'scale-98'}
            `}
          >
            {/* Updated Arrow */}
            <div
              className={`
                absolute -bottom-[6px] left-1/2 -translate-x-1/2
                w-3 h-3 rotate-45
                bg-white dark:bg-[#232323]
                ${theme.border}
                border-t-0 border-l-0
              `}
            />

            <div className="relative">
              {tooltipData.completedHabits.length > 0 && (
                <div className="mb-4">
                  <span className="text-emerald-500 dark:text-emerald-400 font-medium block mb-2.5 text-sm">
                    ✓ Completed
                  </span>
                  <ul className="space-y-2">
                    {tooltipData.completedHabits.map(habit => (
                      <li
                        key={habit.id}
                        className={`${theme.text} text-sm truncate flex items-center justify-between group`}
                      >
                        <span className="truncate mr-2">{habit.name}</span>
                        <button
                          onClick={(e) => handleToggleHabit(e, habit.id, tooltipData.date)}
                          className={`p-1.5 rounded-lg transition-colors ${theme.habitItem}`}
                        >
                          <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tooltipData.incompleteHabits.length > 0 && (
                <div>
                  <span className="text-rose-500 dark:text-rose-400 font-medium block mb-2.5 text-sm">
                    ○ Pending
                  </span>
                  <ul className="space-y-2">
                    {tooltipData.incompleteHabits.map(habit => (
                      <li
                        key={habit.id}
                        className={`${theme.text} text-sm truncate flex items-center justify-between group`}
                      >
                        <span className="truncate mr-2">{habit.name}</span>
                        <button
                          onClick={(e) => handleToggleHabit(e, habit.id, tooltipData.date)}
                          className={`p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${theme.habitItem}`}
                        >
                          <Check className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-emerald-500 dark:hover:text-emerald-400" />
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
